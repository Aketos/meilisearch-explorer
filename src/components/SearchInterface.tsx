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
                {typeof value === 'object' ? (value === null ? 'null' : JSON.stringify(value)) : String(value)}
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
      <InstantSearch searchClient={searchClient.searchClient as any} indexName={indexName}>
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
            className="p-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={hitsPerPage}
            onChange={(e) => setHitsPerPage(Number(e.target.value))}
          >
            <option key="5" value="5">5</option>
            <option key="10" value="10">10</option>
            <option key="20" value="20">20</option>
            <option key="50" value="50">50</option>
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
              item: 'px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 transition-all duration-300 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-400 hover:shadow-sm hover:-translate-y-0.5',
              selectedItem: 'px-3 py-2 border border-blue-500 rounded-md bg-blue-600 text-white shadow-sm transform scale-105',
            }}
          />
        </div>
      </InstantSearch>
    </div>
  );
}
