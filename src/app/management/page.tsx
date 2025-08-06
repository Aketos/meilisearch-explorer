'use client';

import { useState } from 'react';
import { meilisearchClient } from '@/lib/meilisearch';

export default function ManagementPage() {
  const [serverInfo, setServerInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchServerInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const stats = await meilisearchClient.getStats();
      const health = await meilisearchClient.health();
      const version = await meilisearchClient.getVersion();
      
      setServerInfo({
        stats,
        health,
        version
      });
      
      setSuccess('Server information retrieved successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(`Failed to fetch server information: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold mb-6">Management</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      <div className="mb-6">
        <button
          onClick={fetchServerInfo}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Get Server Information'}
        </button>
      </div>
      
      {serverInfo && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Server Version
              </h3>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Version
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {serverInfo.version?.pkgVersion || 'N/A'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Commit SHA
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {serverInfo.version?.commitSha || 'N/A'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Server Health
              </h3>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
              <dl>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Status
                  </dt>
                  <dd className="mt-1 text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      serverInfo.health?.status === 'available' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {serverInfo.health?.status || 'N/A'}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Server Statistics
              </h3>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Database Size
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {serverInfo.stats?.databaseSize 
                      ? `${(serverInfo.stats.databaseSize / (1024 * 1024)).toFixed(2)} MB` 
                      : 'N/A'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Last Update
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {serverInfo.stats?.lastUpdate 
                      ? new Date(serverInfo.stats.lastUpdate).toLocaleString() 
                      : 'N/A'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Number of Indexes
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {serverInfo.stats?.indexes || 'N/A'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Index Statistics
              </h3>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Index
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Documents
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Fields
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {serverInfo.stats && Object.entries(serverInfo.stats.indexes).map(([indexUid, stats]: [string, any]) => (
                      <tr key={indexUid}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {indexUid}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {stats.numberOfDocuments}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {stats.fieldDistribution ? Object.keys(stats.fieldDistribution).length : 0}
                        </td>
                      </tr>
                    ))}
                    {serverInfo.stats && Object.keys(serverInfo.stats.indexes).length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-center">
                          No indexes found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
