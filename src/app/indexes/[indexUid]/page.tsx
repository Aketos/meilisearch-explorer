'use client';

import { useState, use } from 'react';
import DocumentManager from '@/components/DocumentManager';
import IndexSettings from '@/components/IndexSettings';

export default function IndexDetailPage({ params }: { params: Promise<{ indexUid: string }> }) {
  const [activeTab, setActiveTab] = useState<'documents' | 'settings'>('documents');
  const { indexUid } = use(params as Promise<{ indexUid: string }>);
  
  return (
    <div className="py-8 animate-fade-in">
      <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">Index: <span className="text-gray-800">{indexUid}</span></h1>
      
      <div className="mb-8 animate-slide-up" style={{animationDelay: '0.1s'}}>
        <div className="border-b border-gray-200/50 rounded-t-lg">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('documents')}
              className={`py-4 px-6 border-b-2 font-medium text-base transition-all duration-300 ${
                activeTab === 'documents'
                  ? 'border-b-2 border-blue-500 text-blue-700 bg-gradient-to-r from-blue-50 to-indigo-50/50 shadow-sm rounded-t-lg'
                  : 'border-transparent text-gray-600 hover:text-blue-700 hover:border-blue-300 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-indigo-50/30 hover:shadow-sm hover:rounded-t-lg'
              }`}
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Documents
              </div>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-6 border-b-2 font-medium text-base transition-all duration-300 ${
                activeTab === 'settings'
                  ? 'border-b-2 border-blue-500 text-blue-700 bg-gradient-to-r from-blue-50 to-indigo-50/50 shadow-sm rounded-t-lg'
                  : 'border-transparent text-gray-600 hover:text-blue-700 hover:border-blue-300 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-indigo-50/30 hover:shadow-sm hover:rounded-t-lg'
              }`}
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </div>
            </button>
          </nav>
        </div>
      </div>
      
      <div className="glass rounded-xl p-6 shadow-sm border border-gray-200/30 animate-slide-up" style={{animationDelay: '0.2s'}}>
        {activeTab === 'documents' && <DocumentManager indexUid={indexUid} />}
        {activeTab === 'settings' && <IndexSettings indexUid={indexUid} />}
      </div>
    </div>
  );
}
