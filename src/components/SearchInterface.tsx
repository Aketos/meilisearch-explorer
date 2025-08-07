'use client';

import { useState } from 'react';
import { InstantSearch, SearchBox, Hits, Configure, Pagination } from 'react-instantsearch';
import { getSearchClient } from '@/lib/meilisearch';
import { useI18n } from '@/components/I18nProvider';
import type { SearchClient, Hit as ISHit } from 'instantsearch.js';

interface SearchInterfaceProps {
  indexName: string;
}

interface HitProps {
  hit: Record<string, unknown>;
}

type HitItem = {
  __position: number;
  objectID?: string;
  id?: string;
  uid?: string;
  _id?: string;
  primaryKey?: string;
} & Record<string, unknown>;

// Safely read a string property from a generic record
const readStr = (obj: Record<string, unknown>, key: string): string | undefined => {
  const v = obj[key];
  return typeof v === 'string' ? v : undefined;
};

const ResultHit = ({ hit }: HitProps) => {
  const entries = Object.entries(hit).filter(([key]) => !key.startsWith('_'));
  const mainField = entries[0];
  const otherFields = entries.slice(1);
  const { t } = useI18n();
  
  return (
    <div className="group bg-gradient-to-br from-white/90 to-gray-50/50 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      {/* Main field as title */}
      {mainField && (
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
            {typeof mainField[1] === 'object' 
              ? (mainField[1] === null ? t('search.null') : JSON.stringify(mainField[1])) 
              : String(mainField[1])}
          </h3>
          <p className="text-sm text-gray-500 font-medium">{mainField[0]}</p>
        </div>
      )}
      
      {/* Other fields */}
      {otherFields.length > 0 && (
        <div className="space-y-3">
          {otherFields.map(([key, value]) => (
            <div key={key} className="flex items-start justify-between py-2 border-b border-gray-100/50 last:border-0">
              <div className="flex-1">
                <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{key}</span>
                <div className="mt-1">
                  <span className="text-gray-800">
                    {typeof value === 'object' 
                      ? (value === null ? (
                          <span className="text-gray-400 italic">{t('search.null')}</span>
                        ) : (
                          <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                            {JSON.stringify(value, null, 2)}
                          </code>
                        ))
                      : (
                        <span className="break-words">{String(value)}</span>
                      )}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Hover indicator */}
      <div className="mt-4 pt-4 border-t border-gray-200/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center text-blue-600 text-sm font-medium">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {t('search.hit_found')}
        </div>
      </div>
    </div>
  );
};

export default function SearchInterface({ indexName }: SearchInterfaceProps) {
  const [hitsPerPage, setHitsPerPage] = useState(10);
  const { t } = useI18n();

  return (
    <div className="w-full space-y-8">
      <InstantSearch searchClient={getSearchClient() as unknown as SearchClient} indexName={indexName}>
        {/* Compact Search Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3 shadow-md">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">{t('search.header_title', { index: indexName })}</h2>
                <p className="text-xs text-gray-500">{t('search.header_subtitle')}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Search Box */}
        <div className="bg-gradient-to-br from-white/90 to-purple-50/50 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6">
          <SearchBox
            placeholder={t('search.placeholder')}
            classNames={{
              root: 'w-full',
              form: 'relative',
              input: 'w-full px-6 py-4 pl-14 pr-14 bg-white/80 border-2 border-gray-200/50 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 text-gray-800 transition-all duration-300 hover:border-purple-400 text-lg backdrop-blur-sm placeholder-gray-500',
              submit: 'hidden absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-purple-500',
              reset: 'absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 hover:text-red-500 transition-colors duration-300',
            }}
          />
        </div>
        
        {/* Controls */}
        <div className="flex items-center justify-between bg-gradient-to-br from-white/90 to-gray-50/50 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100-4m0 4v2m0-6V4" />
              </svg>
              <label className="text-sm font-semibold text-gray-700 mr-3">{t('search.hits_per_page')}</label>
              <select 
                className="px-4 py-2 bg-white/80 border-2 border-gray-200/50 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 text-gray-800 transition-all duration-300 hover:border-purple-400 font-medium"
                value={hitsPerPage}
                onChange={(e) => setHitsPerPage(Number(e.target.value))}
              >
                <option key="5" value="5">{t('search.results_count', { count: 5 })}</option>
                <option key="10" value="10">{t('search.results_count', { count: 10 })}</option>
                <option key="20" value="20">{t('search.results_count', { count: 20 })}</option>
                <option key="50" value="50">{t('search.results_count', { count: 50 })}</option>
              </select>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            {t('search.index_label', { name: indexName })}
          </div>
        </div>
        
        <Configure hitsPerPage={hitsPerPage} />
        
        {/* Results Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">{t('search.results')}</h3>
            <div className="text-xs text-gray-500">{t('search.instant')}</div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <Hits<Record<string, unknown>> 
              hitComponent={ResultHit}
              transformItems={(items) =>
                (items as Array<ISHit<Record<string, unknown>>>).map((item, idx) => {
                  const rec = item as unknown as Record<string, unknown>;
                  return {
                    ...item,
                    objectID:
                      item.objectID ??
                      readStr(rec, 'id') ??
                      readStr(rec, 'uid') ??
                      readStr(rec, '_id') ??
                      `${item.__position ?? idx}-${readStr(rec, 'primaryKey') ?? ''}-${readStr(rec, 'id') ?? ''}-${readStr(rec, 'uid') ?? ''}`,
                  };
                }) as Array<ISHit<Record<string, unknown>>>
              }
              classNames={{
                root: 'space-y-4',
                list: 'space-y-4',
                item: '',
              }}
            />
          </div>
        </div>
        
        {/* Pagination */}
        <div className="flex justify-center pt-8">
          <div className="bg-gradient-to-br from-white/90 to-gray-50/50 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-4">
            <Pagination 
              classNames={{
                root: 'flex items-center space-x-2',
                list: 'flex items-center space-x-2',
                item: 'px-4 py-2 rounded-xl bg-white/80 border border-gray-200/50 text-gray-700 transition-all duration-300 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-400 hover:shadow-md hover:-translate-y-0.5 font-medium',
                selectedItem: 'px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105 font-semibold',
                disabledItem: 'px-4 py-2 rounded-xl bg-gray-100 text-gray-400 cursor-not-allowed',
                firstPageItem: 'px-4 py-2 rounded-xl bg-white/80 border border-gray-200/50 text-gray-700 transition-all duration-300 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-400 hover:shadow-md hover:-translate-y-0.5 font-medium',
                previousPageItem: 'px-4 py-2 rounded-xl bg-white/80 border border-gray-200/50 text-gray-700 transition-all duration-300 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-400 hover:shadow-md hover:-translate-y-0.5 font-medium',
                nextPageItem: 'px-4 py-2 rounded-xl bg-white/80 border border-gray-200/50 text-gray-700 transition-all duration-300 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-400 hover:shadow-md hover:-translate-y-0.5 font-medium',
                lastPageItem: 'px-4 py-2 rounded-xl bg-white/80 border border-gray-200/50 text-gray-700 transition-all duration-300 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-400 hover:shadow-md hover:-translate-y-0.5 font-medium',
              }}
            />
          </div>
        </div>
      </InstantSearch>
    </div>
  );
}
