'use client';

import IndexList from '@/components/IndexList';

export default function IndexesPage() {
  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold mb-6">Meilisearch Indexes</h1>
      <IndexList />
    </div>
  );
}
