'use client';

import { useState, useEffect } from 'react';
import SearchInterface from '@/components/SearchInterface';
import { meilisearchClient } from '@/lib/meilisearch';

export default function SearchPage() {
  const [indexes, setIndexes] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIndexes = async () => {
      try {
        setLoading(true);
        const indexesResponse = await meilisearchClient.getIndexes();
        const indexUids = indexesResponse.results.map(index => index.uid);
        setIndexes(indexUids);
        
        if (indexUids.length > 0) {
          setSelectedIndex(indexUids[0]);
        }
        
        setError(null);
      } catch (err: any) {
        setError(`Failed to fetch indexes: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchIndexes();
  }, []);

  return (
    <div className="py-8 animate-fade-in">
      <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">Search</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6 shadow-sm animate-fade-in">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}
      
      <div className="mb-8 animate-slide-up" style={{animationDelay: '0.1s'}}>
        <label htmlFor="index-select" className="block text-lg font-medium text-gray-700 mb-3">
          Select Index
        </label>
        <select
          id="index-select"
          value={selectedIndex}
          onChange={(e) => setSelectedIndex(e.target.value)}
          className="block w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800 transition-all duration-300 hover:border-blue-400"
          disabled={loading || indexes.length === 0}
        >
          {indexes.length === 0 && <option value="">No indexes available</option>}
          {indexes.map(indexUid => (
            <option key={indexUid} value={indexUid}>{indexUid}</option>
          ))}
        </select>
      </div>
      
      {selectedIndex && (
        <div className="glass rounded-xl p-6 shadow-sm border border-gray-200/30 animate-slide-up" style={{animationDelay: '0.2s'}}>
          <SearchInterface indexName={selectedIndex} />
        </div>
      )}
      
      {!selectedIndex && !loading && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-4 rounded-lg shadow-sm animate-fade-in">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>No index selected. Please create an index first.</span>
          </div>
        </div>
      )}
    </div>
  );
}
