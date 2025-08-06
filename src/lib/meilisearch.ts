import { MeiliSearch } from 'meilisearch';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';

// Default Meilisearch server configuration
const DEFAULT_HOST = process.env.NEXT_PUBLIC_MEILISEARCH_HOST || 'http://localhost:7700';
const DEFAULT_API_KEY = process.env.NEXT_PUBLIC_MEILISEARCH_API_KEY || '';

// Keys for persisting config in localStorage
const STORAGE_KEYS = {
  host: 'meili_host',
  apiKey: 'meili_api_key',
};

// Mutable current configuration and client singletons (client-side only)
let currentHost: string = DEFAULT_HOST;
let currentApiKey: string = DEFAULT_API_KEY;
let currentMeiliClient: MeiliSearch | null = null;
let currentInstantClient: any | null = null;

const isBrowser = () => typeof window !== 'undefined';

const readConfigFromStorage = () => {
  if (!isBrowser()) return { host: DEFAULT_HOST, apiKey: DEFAULT_API_KEY };
  try {
    const storedHost = window.localStorage.getItem(STORAGE_KEYS.host);
    const storedKey = window.localStorage.getItem(STORAGE_KEYS.apiKey);
    return {
      host: storedHost || DEFAULT_HOST,
      apiKey: storedKey || DEFAULT_API_KEY,
    };
  } catch {
    return { host: DEFAULT_HOST, apiKey: DEFAULT_API_KEY };
  }
};

const writeConfigToStorage = (host: string, apiKey: string) => {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEYS.host, host);
    window.localStorage.setItem(STORAGE_KEYS.apiKey, apiKey);
  } catch {
    // ignore storage errors
  }
};

const initClients = (host: string, apiKey: string) => {
  currentHost = host;
  currentApiKey = apiKey;
  currentMeiliClient = new MeiliSearch({ host, apiKey });
  // instant-meilisearch returns an adapter with an Algolia-compatible client under `.searchClient`
  currentInstantClient = instantMeiliSearch(host, apiKey);
};

// Initialize from storage or defaults on first import (browser only)
(() => {
  const cfg = readConfigFromStorage();
  initClients(cfg.host, cfg.apiKey);
})();

// Public API
export const setMeilisearchConfig = (host: string, apiKey: string) => {
  initClients(host, apiKey);
  writeConfigToStorage(host, apiKey);
};

export const getCurrentConfig = () => ({ host: currentHost, apiKey: currentApiKey });

export const getMeilisearchClient = () => {
  if (!currentMeiliClient) {
    const cfg = readConfigFromStorage();
    initClients(cfg.host, cfg.apiKey);
  }
  return currentMeiliClient as MeiliSearch;
};

export const getSearchClient = () => {
  if (!currentInstantClient) {
    const cfg = readConfigFromStorage();
    initClients(cfg.host, cfg.apiKey);
  }
  // Some versions of instantMeiliSearch return a wrapper with `.searchClient`
  const maybeWrapper = currentInstantClient as any;
  return (maybeWrapper && maybeWrapper.searchClient) ? maybeWrapper.searchClient : maybeWrapper;
};

// Helper function to wait for a task to complete
export const waitForTask = async (taskUid: number) => {
  // Simple polling mechanism to wait for task completion
  let status = 'processing';
  let taskInfo: any = null;
  
  while (status !== 'succeeded' && status !== 'failed') {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      // Try to get the task status
      const { host, apiKey } = getCurrentConfig();
      const response = await fetch(`${host}/tasks/${taskUid}`, {
        headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {}
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get task status: ${response.statusText}`);
      }
      
      taskInfo = await response.json();
      status = taskInfo.status;
    } catch (error) {
      console.error('Error checking task status:', error);
      throw error;
    }
  }
  
  return taskInfo;
};

// Note: use getSearchClient() inside components to get the live adapter
