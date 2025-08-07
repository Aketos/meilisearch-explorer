'use client';

import { useState, useEffect } from 'react';
import SearchInterface from '@/components/SearchInterface';
import { getMeilisearchClient } from '@/lib/meilisearch';
import { useI18n } from '@/components/I18nProvider';

function errorToMessage(err: unknown): string {
  if (err instanceof Error && err.message) return err.message;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

export default function SearchPage() {
  const [indexes, setIndexes] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useI18n();

  useEffect(() => {
    const fetchIndexes = async () => {
      try {
        setLoading(true);
        const client = getMeilisearchClient();
        const indexesResponse = await client.getIndexes();
        const indexUids = indexesResponse.results.map(index => index.uid);
        setIndexes(indexUids);
        
        if (indexUids.length > 0) {
          setSelectedIndex(indexUids[0]);
        }
        
        setError(null);
      } catch (err: unknown) {
        setError(t('search.fetch_failed', { message: errorToMessage(err) }));
      } finally {
        setLoading(false);
      }
    };

    fetchIndexes();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/50">
      {/* Compact Header */}
      <div className="relative px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between animate-fade-in">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-pink-700">
                  {t('search.page.title')}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {t('search.page.subtitle')}
                </p>
              </div>
            </div>
            <div className="text-xs text-gray-500 bg-gray-100/80 px-3 py-1 rounded-full">
              {t('search.page.badge')}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative px-6 pb-16">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {error && (
            <div className="bg-red-50/80 backdrop-blur-xl border border-red-200/50 text-red-700 px-6 py-4 rounded-2xl shadow-lg animate-fade-in">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">{t('search.error.title')}</h3>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Index Selection Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 animate-slide-up" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{t('search.indexSelect.title')}</h2>
                <p className="text-gray-600">{t('search.indexSelect.desc')}</p>
              </div>
            </div>
            
            <div className="relative">
              <select
                value={selectedIndex}
                onChange={(e) => setSelectedIndex(e.target.value)}
                className="w-full px-6 py-4 bg-white/80 border-2 border-gray-200/50 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 text-gray-800 transition-all duration-300 hover:border-purple-400 text-lg font-medium backdrop-blur-sm"
                disabled={loading || indexes.length === 0}
              >
                {loading && <option value="">{t('search.select.loading')}</option>}
                {!loading && indexes.length === 0 && <option value="">{t('search.select.none')}</option>}
                {indexes.map(indexUid => (
                  <option key={indexUid} value={indexUid}>{indexUid}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Search Interface */}
          {selectedIndex && (
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
              <SearchInterface indexName={selectedIndex} />
            </div>
          )}
          
          {/* No Index Selected State */}
          {!selectedIndex && !loading && (
            <div className="bg-amber-50/80 backdrop-blur-xl border border-amber-200/50 rounded-3xl shadow-lg p-8 animate-fade-in">
              <div className="flex items-center justify-center text-center">
                <div>
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-amber-800 mb-2">{t('search.empty.title')}</h3>
                  <p className="text-amber-700">{t('search.empty.desc')}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Background Decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-400/20 to-red-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-600/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
