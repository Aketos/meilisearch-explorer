'use client';

import { useEffect, useState } from 'react';
import { getCurrentConfig, setMeilisearchConfig } from '@/lib/meilisearch';
import { useI18n } from '@/components/I18nProvider';

interface ConnectionSettingsProps {
  onSaved?: () => void;
}

export default function ConnectionSettings({ onSaved }: ConnectionSettingsProps) {
  const { t } = useI18n();
  const [host, setHost] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState<null | { type: 'success' | 'error'; message: string }>(null);

  const errorToMessage = (e: unknown) => {
    if (e instanceof Error) return e.message;
    try { return JSON.stringify(e); } catch { return String(e); }
  };

  useEffect(() => {
    const cfg = getCurrentConfig();
    setHost(cfg.host);
    setApiKey(cfg.apiKey || '');
  }, []);

  const handleSave = () => {
    setMeilisearchConfig(host.trim(), apiKey.trim());
    setStatus({ type: 'success', message: t('conn.saved') });
    if (onSaved) onSaved();
  };

  const testConnection = async () => {
    setTesting(true);
    setStatus(null);
    try {
      const res = await fetch(`${host.replace(/\/$/, '')}/health`, {
        headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : undefined,
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = await res.json();
      if (data?.status === 'available') {
        setStatus({ type: 'success', message: t('conn.health_ok') });
      } else {
        setStatus({ type: 'error', message: t('conn.health_unexpected') });
      }
    } catch (e: unknown) {
      setStatus({ type: 'error', message: t('conn.health_failed', { message: errorToMessage(e) }) });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-2">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">{t('conn.title')}</h3>
          <p className="text-xs text-gray-500">{t('conn.subtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('conn.host_label')}</label>
          <input
            type="url"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            placeholder={t('conn.host_placeholder')}
            className="w-full px-4 py-3 bg-white/80 border-2 border-gray-200/50 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-gray-800 transition-all duration-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('conn.api_key_label')}</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={t('conn.api_key_placeholder')}
            className="w-full px-4 py-3 bg-white/80 border-2 border-gray-200/50 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-gray-800 transition-all duration-300"
          />
        </div>
      </div>

      {status && (
        <div className={`${status.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'} border px-4 py-3 rounded-xl`}> 
          {status.message}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2.5 px-5 rounded-xl shadow-sm hover:shadow transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {t('conn.save')}
        </button>
        <button
          onClick={testConnection}
          disabled={testing}
          className="px-4 py-2.5 bg-white/80 border-2 border-gray-200/50 rounded-xl text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
        >
          {testing ? t('conn.testing') : t('conn.test')}
        </button>
      </div>
    </div>
  );
}
