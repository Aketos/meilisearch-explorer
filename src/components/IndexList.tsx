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
  primaryKey: string | null;
  createdAt: string;
  updatedAt: string;
  stats?: IndexStats;
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
            return { ...index, stats };
          } catch (e) {
            return index;
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
      <h2 className="text-2xl font-bold mb-6">Meilisearch Indexes</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Create New Index</h3>
        <form onSubmit={handleCreateIndex} className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <div className="flex-grow">
            <input
              type="text"
              value={newIndexName}
              onChange={(e) => setNewIndexName(e.target.value)}
              placeholder="Index name"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="flex-grow">
            <input
              type="text"
              value={primaryKey}
              onChange={(e) => setPrimaryKey(e.target.value)}
              placeholder="Primary key (optional)"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            disabled={isCreating}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isCreating ? 'Creating...' : 'Create Index'}
          </button>
        </form>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2">Loading indexes...</p>
        </div>
      ) : indexes.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-md">
          <p className="text-gray-500">No indexes found. Create your first index above.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 text-left">Index UID</th>
                <th className="py-3 px-4 text-left">Primary Key</th>
                <th className="py-3 px-4 text-left">Documents</th>
                <th className="py-3 px-4 text-left">Created At</th>
                <th className="py-3 px-4 text-left">Updated At</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {indexes.map((index) => (
                <tr key={index.uid} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <Link href={`/indexes/${index.uid}`} className="text-blue-500 hover:underline">
                      {index.uid}
                    </Link>
                  </td>
                  <td className="py-3 px-4">{index.primaryKey || '-'}</td>
                  <td className="py-3 px-4">{index.stats?.numberOfDocuments || 0}</td>
                  <td className="py-3 px-4">{new Date(index.createdAt).toLocaleString()}</td>
                  <td className="py-3 px-4">{new Date(index.updatedAt).toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <Link 
                        href={`/indexes/${index.uid}`}
                        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDeleteIndex(index.uid)}
                        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
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
      
      <div className="mt-4 flex justify-end">
        <button
          onClick={fetchIndexes}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
