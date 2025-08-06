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
    <div className="py-8 animate-fade-in">
      <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">Management</h1>
      
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
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg mb-6 shadow-sm animate-fade-in">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {success}
          </div>
        </div>
      )}
      
      <div className="mb-8 animate-slide-up" style={{animationDelay: '0.1s'}}>
        <button
          onClick={fetchServerInfo}
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-lg shadow-sm hover:shadow transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 flex items-center space-x-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Loading...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Get Server Information</span>
            </>
          )}
        </button>
      </div>
      
      {serverInfo && (
        <div className="space-y-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
          <div className="glass rounded-xl shadow-sm border border-gray-200/30 overflow-hidden">
            <div className="px-6 py-5 sm:px-8">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
                <h3 className="text-xl leading-6 font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
                  Server Version
                </h3>
              </div>
            </div>
            <div className="border-t border-gray-200/30 px-6 py-6 sm:p-8 bg-white/50">
              <dl className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                <div className="p-4 rounded-lg hover:bg-blue-50/50 transition-colors duration-300">
                  <dt className="text-sm font-medium text-gray-600 mb-2">
                    Version
                  </dt>
                  <dd className="text-lg font-semibold text-gray-800">
                    {serverInfo.version?.pkgVersion || 'N/A'}
                  </dd>
                </div>
                <div className="p-4 rounded-lg hover:bg-blue-50/50 transition-colors duration-300">
                  <dt className="text-sm font-medium text-gray-600 mb-2">
                    Commit SHA
                  </dt>
                  <dd className="text-lg font-semibold text-gray-800">
                    {serverInfo.version?.commitSha || 'N/A'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          
          <div className="glass rounded-xl shadow-sm border border-gray-200/30 overflow-hidden" style={{animationDelay: '0.3s'}}>
            <div className="px-6 py-5 sm:px-8">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h3 className="text-xl leading-6 font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
                  Server Health
                </h3>
              </div>
            </div>
            <div className="border-t border-gray-200/30 px-6 py-6 sm:p-8 bg-white/50">
              <dl>
                <div className="p-4 rounded-lg hover:bg-blue-50/50 transition-colors duration-300">
                  <dt className="text-sm font-medium text-gray-600 mb-3">
                    Status
                  </dt>
                  <dd className="mt-1">
                    <span className={`px-4 py-2 inline-flex items-center text-sm leading-5 font-semibold rounded-full shadow-sm ${
                      serverInfo.health?.status === 'available' 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                        : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                    }`}>
                      <span className={`h-2 w-2 rounded-full mr-2 ${serverInfo.health?.status === 'available' ? 'bg-green-200 animate-pulse' : 'bg-red-200'}`}></span>
                      {serverInfo.health?.status || 'N/A'}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          
          <div className="glass rounded-xl shadow-sm border border-gray-200/30 overflow-hidden" style={{animationDelay: '0.4s'}}>
            <div className="px-6 py-5 sm:px-8">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="text-xl leading-6 font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
                  Server Statistics
                </h3>
              </div>
            </div>
            <div className="border-t border-gray-200/30 px-6 py-6 sm:p-8 bg-white/50">
              <dl className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                <div className="p-4 rounded-lg hover:bg-blue-50/50 transition-colors duration-300">
                  <dt className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                    </svg>
                    Database Size
                  </dt>
                  <dd className="text-lg font-semibold text-gray-800">
                    {serverInfo.stats?.databaseSize 
                      ? `${(serverInfo.stats.databaseSize / (1024 * 1024)).toFixed(2)} MB` 
                      : 'N/A'}
                  </dd>
                </div>
                <div className="p-4 rounded-lg hover:bg-blue-50/50 transition-colors duration-300">
                  <dt className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Last Update
                  </dt>
                  <dd className="text-lg font-semibold text-gray-800">
                    {serverInfo.stats?.lastUpdate 
                      ? new Date(serverInfo.stats.lastUpdate).toLocaleString() 
                      : 'N/A'}
                  </dd>
                </div>
                <div className="p-4 rounded-lg hover:bg-blue-50/50 transition-colors duration-300">
                  <dt className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Number of Indexes
                  </dt>
                  <dd className="text-lg font-semibold text-gray-800">
                    {serverInfo.stats?.indexes || 'N/A'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          
          <div className="glass rounded-xl shadow-sm border border-gray-200/30 overflow-hidden" style={{animationDelay: '0.5s'}}>
            <div className="px-6 py-5 sm:px-8">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
                <h3 className="text-xl leading-6 font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
                  Index Statistics
                </h3>
              </div>
            </div>
            <div className="border-t border-gray-200/30 bg-white/50">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200/70">
                  <thead className="bg-blue-50/70">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">
                        Index
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">
                        Documents
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">
                        Fields
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200/70">
                    {serverInfo.stats && Object.entries(serverInfo.stats.indexes).map(([indexUid, stats]: [string, any], index) => (
                      <tr key={indexUid} className="hover:bg-blue-50/30 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold mr-3 shadow-sm">
                              {indexUid.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-gray-800">{indexUid}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {stats.numberOfDocuments}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                            {stats.fieldDistribution ? Object.keys(stats.fieldDistribution).length : 0}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {serverInfo.stats && Object.keys(serverInfo.stats.indexes).length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-6 py-8 whitespace-nowrap text-sm text-gray-500 text-center">
                          <div className="flex flex-col items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">No indexes found</span>
                            <span className="text-gray-400 text-xs mt-1">Create an index to get started</span>
                          </div>
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
