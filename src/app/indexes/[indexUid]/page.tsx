'use client';

import { useState } from 'react';
import DocumentManager from '@/components/DocumentManager';
import IndexSettings from '@/components/IndexSettings';

export default function IndexDetailPage({ params }: { params: { indexUid: string } }) {
  const [activeTab, setActiveTab] = useState<'documents' | 'settings'>('documents');
  const { indexUid } = params;
  
  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold mb-2">Index: {indexUid}</h1>
      
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('documents')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'documents'
                  ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Documents
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Settings
            </button>
          </nav>
        </div>
      </div>
      
      {activeTab === 'documents' && <DocumentManager indexUid={indexUid} />}
      {activeTab === 'settings' && <IndexSettings indexUid={indexUid} />}
    </div>
  );
}
