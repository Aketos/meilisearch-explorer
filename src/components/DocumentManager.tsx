'use client';

import { useState, useEffect } from 'react';
import { meilisearchClient, waitForTask } from '@/lib/meilisearch';

interface DocumentManagerProps {
  indexUid: string;
}

export default function DocumentManager({ indexUid }: DocumentManagerProps) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newDocument, setNewDocument] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [page, setPage] = useState(1);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const limit = 10;

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const offset = (page - 1) * limit;
      const response = await meilisearchClient.index(indexUid).getDocuments({
        offset,
        limit,
      });
      setDocuments(response.results);
      
      // Get total documents count
      const stats = await meilisearchClient.index(indexUid).getStats();
      setTotalDocuments(stats.numberOfDocuments);
      
      setError(null);
    } catch (err: any) {
      setError(`Failed to fetch documents: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [indexUid, page]);

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocument.trim()) return;
    
    try {
      setIsAdding(true);
      let documentToAdd;
      
      try {
        documentToAdd = JSON.parse(newDocument);
      } catch (err) {
        setError('Invalid JSON format. Please check your document structure.');
        setIsAdding(false);
        return;
      }
      
      // Handle single document or array of documents
      const documents = Array.isArray(documentToAdd) ? documentToAdd : [documentToAdd];
      
      const task = await meilisearchClient.index(indexUid).addDocuments(documents);
      await waitForTask(task.taskUid);
      
      setNewDocument('');
      fetchDocuments();
      setError(null);
    } catch (err: any) {
      setError(`Failed to add document: ${err.message}`);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteDocument = async (documentId: string | number) => {
    if (!confirm(`Are you sure you want to delete this document?`)) return;
    
    try {
      const task = await meilisearchClient.index(indexUid).deleteDocument(documentId);
      await waitForTask(task.taskUid);
      fetchDocuments();
    } catch (err: any) {
      setError(`Failed to delete document: ${err.message}`);
    }
  };

  const totalPages = Math.ceil(totalDocuments / limit);

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Documents in {indexUid}</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Add New Document</h3>
        <form onSubmit={handleAddDocument}>
          <div className="mb-4">
            <textarea
              value={newDocument}
              onChange={(e) => setNewDocument(e.target.value)}
              placeholder='{"id": 1, "title": "Example Document", ...}'
              className="w-full p-3 border border-gray-300 rounded-md font-mono text-sm h-40"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter a valid JSON object or array of objects. Make sure to include the primary key if one is defined.
            </p>
          </div>
          <button
            type="submit"
            disabled={isAdding}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:outline-none"
          >
            {isAdding ? 'Adding...' : 'Add Document'}
          </button>
        </form>
      </div>
      
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Documents</h3>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2">Loading documents...</p>
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-md">
          <p className="text-gray-500">No documents found in this index.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4">
            {documents.map((doc, index) => {
              // Try to find the ID field
              const id = doc.id || doc._id || `document-${index}`;
              
              return (
                <div key={id} className="border rounded-md p-4 bg-white shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-mono text-sm overflow-x-auto max-w-full">
                      <pre className="whitespace-pre-wrap">{JSON.stringify(doc, null, 2)}</pre>
                    </div>
                    <button
                      onClick={() => handleDeleteDocument(id)}
                      className="ml-4 px-2 py-1 bg-red-100 text-red-700 border border-red-200 rounded-md hover:bg-red-200 flex-shrink-0 focus:ring-2 focus:ring-red-500 focus:outline-none"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 transition-all duration-300 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-400 hover:shadow-sm hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:transform-none disabled:shadow-none"
                >
                  Previous
                </button>
                
                <span className="px-3 py-1">
                  Page {page} of {totalPages}
                </span>
                
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 transition-all duration-300 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-400 hover:shadow-sm hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:transform-none disabled:shadow-none"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
      
      <div className="mt-4 flex justify-end">
        <button
          onClick={fetchDocuments}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
