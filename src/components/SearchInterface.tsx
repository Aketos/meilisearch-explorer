'use client';

import { useState } from 'react';
import { InstantSearch, SearchBox, Hits, Configure, Pagination } from 'react-instantsearch';
import { searchClient } from '@/lib/meilisearch';

interface SearchInterfaceProps {
  indexName: string;
}

interface HitProps {
  hit: Record<string, any>;
}

const Hit = ({ hit }: HitProps) => {
  return (
    <div className="p-4 border rounded-md mb-2 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col">
        {Object.entries(hit).map(([key, value]) => {
          // Skip internal properties that start with _
          if (key.startsWith('_')) return null;
          
          return (
            <div key={key} className="mb-1">
              <span className="font-semibold">{key}: </span>
              <span className="text-gray-700">
                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function SearchInterface({ indexName }: SearchInterfaceProps) {
  const [hitsPerPage, setHitsPerPage] = useState(10);

  return (
    <div className="w-full">
      <InstantSearch searchClient={searchClient} indexName={indexName}>
        <div className="mb-4">
          <SearchBox
            placeholder="Search..."
            classNames={{
              root: 'w-full',
              form: 'relative',
              input: 'w-full p-3 pl-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              submit: 'absolute left-3 top-1/2 -translate-y-1/2',
              reset: 'absolute right-3 top-1/2 -translate-y-1/2',
            }}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Results per page</label>
          <select 
            className="p-2 border border-gray-300 rounded-md"
            value={hitsPerPage}
            onChange={(e) => setHitsPerPage(Number(e.target.value))}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
        
        <Configure hitsPerPage={hitsPerPage} />
        
        <div className="mb-4">
          <Hits hitComponent={Hit} />
        </div>
        
        <div className="flex justify-center">
          <Pagination 
            classNames={{
              root: 'flex space-x-1',
              item: 'px-3 py-2 border rounded-md hover:bg-gray-100',
              selectedItem: 'px-3 py-2 border rounded-md bg-blue-500 text-white',
            }}
          />
        </div>
      </InstantSearch>
    </div>
  );
}
