import { MeiliSearch } from 'meilisearch';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';

// Default Meilisearch server configuration
const HOST = process.env.NEXT_PUBLIC_MEILISEARCH_HOST || 'http://localhost:7700';
const API_KEY = process.env.NEXT_PUBLIC_MEILISEARCH_API_KEY || '';

// Create a Meilisearch client instance
export const meilisearchClient = new MeiliSearch({
  host: HOST,
  apiKey: API_KEY,
});

// Helper function to wait for a task to complete
export const waitForTask = async (taskUid: number) => {
  // Simple polling mechanism to wait for task completion
  let status = 'processing';
  let taskInfo: any = null;
  
  while (status !== 'succeeded' && status !== 'failed') {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      // Try to get the task status
      const response = await fetch(`${HOST}/tasks/${taskUid}`, {
        headers: API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {}
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

// Create an instant-meilisearch client for InstantSearch integration
export const searchClient = instantMeiliSearch(HOST, API_KEY).searchClient;
