'use client';

import { useState, useEffect } from 'react';
import { getMeilisearchClient, waitForTask } from '@/lib/meilisearch';
import { JsonDisplay } from '@/components/JsonDisplay';

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
      const response = await getMeilisearchClient().index(indexUid).getDocuments({
        offset,
        limit,
      });
      setDocuments(response.results);
      
      // Get total documents count
      const stats = await getMeilisearchClient().index(indexUid).getStats();
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
      
      const task = await getMeilisearchClient().index(indexUid).addDocuments(documents);
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
      const task = await getMeilisearchClient().index(indexUid).deleteDocument(documentId);
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
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6 shadow-sm animate-fade-in">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}
      
      <div className="mb-8 glass p-6 rounded-xl">
        <h3 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Ajouter un nouveau document</h3>
        <form onSubmit={handleAddDocument}>
          <div className="mb-4">
            <textarea
              value={newDocument}
              onChange={(e) => setNewDocument(e.target.value)}
              placeholder='{"id": 1, "title": "Example Document", ...}'
              className="w-full p-4 border border-gray-200 rounded-lg font-mono text-sm h-40 shadow-inner bg-white/80 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-300"
              required
            />
            <div className="flex items-center mt-2 text-sm text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p>
                Entrez un objet JSON valide ou un tableau d'objets. Assurez-vous d'inclure la clé primaire si elle est définie.
              </p>
            </div>
          </div>
          <button
            type="submit"
            disabled={isAdding}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-md hover:scale-105 disabled:opacity-70 disabled:scale-100 disabled:shadow-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:outline-none transition-all duration-300 font-medium"
          >
            {isAdding ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Ajout en cours...
              </span>
            ) : 'Ajouter le document'}
          </button>
        </form>
      </div>
      
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Documents</h3>
      
      {loading ? (
        <div className="text-center py-12 glass rounded-xl animate-fade-in">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 mb-3"></div>
          <p className="text-gray-700 font-medium">Chargement des documents...</p>
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-12 glass rounded-xl animate-fade-in">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-700 font-medium">Aucun document trouvé dans cet index.</p>
          <p className="text-gray-500 text-sm mt-1">Utilisez le formulaire ci-dessus pour ajouter des documents.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4">
            {documents.map((doc, index) => {
              // Try to find the ID field
              const id = doc.id || doc._id || `document-${index}`;
              
              return (
                <div key={id} className="border rounded-md p-4 bg-white shadow-sm hover:shadow transition-all duration-300">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm font-medium text-gray-800 mb-2">
                      Document ID: <span className="text-blue-600">{id}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteDocument(id)}
                      className="ml-4 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100 flex-shrink-0 focus:ring-2 focus:ring-red-500 focus:outline-none transition-all duration-300 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="w-full">
                    <JsonDisplay data={doc} initialExpanded={true} maxHeight="300px" />
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
