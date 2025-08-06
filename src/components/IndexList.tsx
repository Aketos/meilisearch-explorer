'use client';

import { useState, useEffect } from 'react';
import { meilisearchClient, waitForTask } from '@/lib/meilisearch';
import Link from 'next/link';

interface IndexStats {
  numberOfDocuments: number;
  isIndexing: boolean;
}

interface IndexInfo {
  uid: string;
  primaryKey: string | null | undefined;
  createdAt: string | Date | undefined;
  updatedAt: string | Date | undefined;
  stats?: IndexStats;
  [key: string]: any; // Allow for additional properties from the Meilisearch client
}

export default function IndexList() {
  const [indexes, setIndexes] = useState<IndexInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newIndexName, setNewIndexName] = useState('');
  const [primaryKey, setPrimaryKey] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const fetchIndexes = async () => {
    try {
      setLoading(true);
      const indexesResponse = await meilisearchClient.getIndexes();
      
      // Fetch stats for each index
      const indexesWithStats = await Promise.all(
        indexesResponse.results.map(async (index) => {
          try {
            const stats = await meilisearchClient.index(index.uid).getStats();
            return { 
              uid: index.uid,
              primaryKey: index.primaryKey,
              createdAt: index.createdAt,
              updatedAt: index.updatedAt,
              stats 
            } as IndexInfo;
          } catch (e) {
            return { 
              uid: index.uid,
              primaryKey: index.primaryKey,
              createdAt: index.createdAt,
              updatedAt: index.updatedAt 
            } as IndexInfo;
          }
        })
      );
      
      setIndexes(indexesWithStats);
      setError(null);
    } catch (err) {
      setError('Failed to fetch indexes. Make sure Meilisearch server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndexes();
  }, []);

  const handleCreateIndex = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIndexName.trim()) return;
    
    try {
      setIsCreating(true);
      const options = primaryKey.trim() ? { primaryKey: primaryKey.trim() } : undefined;
      const task = await meilisearchClient.createIndex(newIndexName.trim(), options);
      await waitForTask(task.taskUid);
      setNewIndexName('');
      setPrimaryKey('');
      fetchIndexes();
    } catch (err: any) {
      setError(`Failed to create index: ${err.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteIndex = async (indexUid: string) => {
    if (!confirm(`Are you sure you want to delete the index "${indexUid}"?`)) return;
    
    try {
      const task = await meilisearchClient.deleteIndex(indexUid);
      await waitForTask(task.taskUid);
      fetchIndexes();
    } catch (err: any) {
      setError(`Failed to delete index: ${err.message}`);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Meilisearch Indexes</h2>
        <button
          onClick={fetchIndexes}
          className="px-3 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
          aria-label="Refresh indexes"
          disabled={loading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
          </svg>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p className="font-medium">{error}</p>
        </div>
      )}
      
      <div className="mb-8 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Create New Index</h2>
        <form onSubmit={handleCreateIndex} className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <div className="flex-grow">
            <label htmlFor="index-name" className="block text-sm font-medium text-gray-700 mb-1">
              Index Name
            </label>
            <input
              type="text"
              id="index-name"
              name="indexName"
              value={newIndexName}
              onChange={(e) => setNewIndexName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter index name"
              required
              aria-required="true"
            />
          </div>
          <div className="flex-grow">
            <label htmlFor="primary-key" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Primary Key (optional)
            </label>
            <input
              id="primary-key"
              type="text"
              value={primaryKey}
              onChange={(e) => setPrimaryKey(e.target.value)}
              placeholder="e.g., id"
              className="w-full p-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              aria-required="false"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={isCreating}
              aria-busy={isCreating}
            >
              {isCreating ? 'Creating...' : 'Create Index'}
            </button>
          </div>
        </form>
      </div>
      
      {loading ? (
        <div className="text-center py-8" role="status" aria-live="polite">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 font-medium text-gray-700">Loading indexes...</p>
        </div>
      ) : indexes.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-md border border-gray-200">
          <p className="text-gray-600">No indexes found. Create your first index above.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-gray-700">Name</th>
                <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-gray-700">Primary Key</th>
                <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-gray-700">Documents</th>
                <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-gray-700">Created</th>
                <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-gray-700">Updated</th>
                <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {indexes.map((index) => (
                <tr key={index.uid} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <Link 
                      href={`/indexes/${index.uid}`} 
                      className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                    >
                      {index.uid}
                    </Link>
                  </td>
                  <td className="py-3 px-4">{index.primaryKey || '—'}</td>
                  <td className="py-3 px-4">{index.stats?.numberOfDocuments ? index.stats.numberOfDocuments.toLocaleString() : '0'}</td>
                  <td className="py-3 px-4">{index.createdAt ? new Date(index.createdAt).toLocaleString() : '-'}</td>
                  <td className="py-3 px-4">{index.updatedAt ? new Date(index.updatedAt).toLocaleString() : '-'}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <Link 
                        href={`/indexes/${index.uid}`}
                        className="px-3 py-1 bg-primary text-primary-foreground rounded-md hover:bg-primary-hover transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                        aria-label={`View index ${index.uid}`}
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDeleteIndex(index.uid)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                        aria-label={`Delete index ${index.uid}`}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-6 flex justify-end">
        <button
          onClick={fetchIndexes}
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary-hover transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
          aria-label="Refresh index list"
        >
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </span>
        </button>
      </div>
    </div>
  );
}
