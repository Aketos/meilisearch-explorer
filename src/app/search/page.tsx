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
    <div className="py-6">
      <h1 className="text-3xl font-bold mb-6">Search</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-6">
        <label htmlFor="index-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Index
        </label>
        <select
          id="index-select"
          value={selectedIndex}
          onChange={(e) => setSelectedIndex(e.target.value)}
          className="block w-full max-w-md px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          disabled={loading || indexes.length === 0}
        >
          {indexes.length === 0 && <option value="">No indexes available</option>}
          {indexes.map(indexUid => (
            <option key={indexUid} value={indexUid}>{indexUid}</option>
          ))}
        </select>
      </div>
      
      {selectedIndex && (
        <SearchInterface indexName={selectedIndex} />
      )}
      
      {!selectedIndex && !loading && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          No index selected. Please create an index first.
        </div>
      )}
    </div>
  );
}
