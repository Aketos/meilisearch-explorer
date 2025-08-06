'use client';

import IndexList from '@/components/IndexList';

export default function IndexesPage() {
  return (
    <div className="py-8 animate-fade-in">
      <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
        Meilisearch Indexes
      </h1>
      <div className="glass rounded-xl p-1 shadow-sm border border-gray-200/30 animate-slide-up" style={{animationDelay: '0.2s'}}>
        <IndexList />
      </div>
    </div>
  );
}
