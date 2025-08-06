'use client';

import { useState, useEffect } from 'react';
import { getMeilisearchClient, waitForTask } from '@/lib/meilisearch';
import Link from 'next/link';

interface IndexStats {
  numberOfDocuments: number;
  isIndexing: boolean;
}

interface IndexInfo {
  uid: string;
  primaryKey: string | null | undefined;
  createdAt: string | Date | undefined;
  updatedAt: string | Date | undefined;
  stats?: IndexStats;
  [key: string]: any; // Allow for additional properties from the Meilisearch client
}

export default function IndexList() {
  const [indexes, setIndexes] = useState<IndexInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newIndexName, setNewIndexName] = useState('');
  const [primaryKey, setPrimaryKey] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const fetchIndexes = async () => {
    try {
      setLoading(true);
      const client = getMeilisearchClient();
      const indexesResponse = await client.getIndexes();
      
      // Fetch stats for each index
      const indexesWithStats = await Promise.all(
        indexesResponse.results.map(async (index) => {
          try {
            const stats = await getMeilisearchClient().index(index.uid).getStats();
            return { 
              uid: index.uid,
              primaryKey: index.primaryKey,
              createdAt: index.createdAt,
              updatedAt: index.updatedAt,
              stats 
            } as IndexInfo;
          } catch (e) {
            return { 
              uid: index.uid,
              primaryKey: index.primaryKey,
              createdAt: index.createdAt,
              updatedAt: index.updatedAt 
            } as IndexInfo;
          }
        })
      );
      
      setIndexes(indexesWithStats);
      setError(null);
    } catch (err) {
      setError('Failed to fetch indexes. Make sure Meilisearch server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndexes();
  }, []);

  const handleCreateIndex = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIndexName.trim()) return;
    
    try {
      setIsCreating(true);
      const options = primaryKey.trim() ? { primaryKey: primaryKey.trim() } : undefined;
      const task = await getMeilisearchClient().createIndex(newIndexName.trim(), options);
      await waitForTask(task.taskUid);
      setNewIndexName('');
      setPrimaryKey('');
      fetchIndexes();
    } catch (err: any) {
      setError(`Failed to create index: ${err.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteIndex = async (indexUid: string) => {
    if (!confirm(`Are you sure you want to delete the index "${indexUid}"?`)) return;
    
    try {
      const task = await getMeilisearchClient().deleteIndex(indexUid);
      await waitForTask(task.taskUid);
      fetchIndexes();
    } catch (err: any) {
      setError(`Failed to delete index: ${err.message}`);
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Compact Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
              Vos Index
            </h2>
            <p className="text-xs text-gray-500">Gérez vos données</p>
          </div>
        </div>
        <button
          onClick={fetchIndexes}
          className="group relative px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
          aria-label="Actualiser les index"
          disabled={loading}
        >
          <svg 
            className={`w-4 h-4 transition-transform duration-300 ${loading ? 'animate-spin' : 'group-hover:rotate-180'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="text-sm font-medium">{loading ? 'Actualisation...' : 'Actualiser'}</span>
        </button>
      </div>
      
      {error && (
        <div className="bg-red-50/80 backdrop-blur-xl border border-red-200/50 text-red-700 px-6 py-4 rounded-2xl shadow-lg animate-fade-in" role="alert">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Erreur</h3>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Create New Index Card */}
      <div className="bg-gradient-to-br from-white/90 to-blue-50/50 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Créer un Nouvel Index</h3>
            <p className="text-gray-600">Ajoutez un nouvel index à votre instance Meilisearch</p>
          </div>
        </div>
        
        <form onSubmit={handleCreateIndex} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="index-name" className="block text-sm font-semibold text-gray-700">
                Nom de l'Index *
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="index-name"
                  name="indexName"
                  value={newIndexName}
                  onChange={(e) => setNewIndexName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 border-2 border-gray-200/50 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-gray-800 transition-all duration-300 hover:border-blue-400 backdrop-blur-sm"
                  placeholder="ex: produits, articles, utilisateurs"
                  required
                  aria-required="true"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="primary-key" className="block text-sm font-semibold text-gray-700">
                Clé Primaire (optionnel)
              </label>
              <div className="relative">
                <input
                  id="primary-key"
                  type="text"
                  value={primaryKey}
                  onChange={(e) => setPrimaryKey(e.target.value)}
                  placeholder="ex: id, uuid, product_id"
                  className="w-full px-4 py-3 bg-white/80 border-2 border-gray-200/50 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-gray-800 transition-all duration-300 hover:border-blue-400 backdrop-blur-sm"
                  aria-required="false"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2m0 0V7a2 2 0 012-2m3 0a2 2 0 012 2v1M9 7h6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-3 font-semibold"
              disabled={isCreating}
              aria-busy={isCreating}
            >
              {isCreating ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Création en cours...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Créer l'Index</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      {loading ? (
        <div className="text-center py-16" role="status" aria-live="polite">
          <div className="relative">
            <div className="w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
            </div>
            <p className="text-lg font-medium text-gray-700">Chargement des index...</p>
            <p className="text-sm text-gray-500 mt-2">Veuillez patienter</p>
          </div>
        </div>
      ) : indexes.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50/80 to-blue-50/50 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Aucun index trouvé</h3>
          <p className="text-gray-600 max-w-md mx-auto">Commencez par créer votre premier index en utilisant le formulaire ci-dessus.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Index Existants ({indexes.length})</h3>
            <div className="text-xs text-gray-500">Cliquez pour gérer</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {indexes.map((index, i) => (
              <div key={index.uid} className="group bg-gradient-to-br from-white/90 to-gray-50/50 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{animationDelay: `${i * 0.1}s`}}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-bold text-lg">{index.uid.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <Link 
                        href={`/indexes/${index.uid}`} 
                        className="text-lg font-bold text-gray-800 hover:text-blue-600 transition-colors duration-300 group-hover:text-blue-600"
                      >
                        {index.uid}
                      </Link>
                      {index.primaryKey && (
                        <p className="text-sm text-gray-500 mt-1">
                          Clé: <span className="font-medium">{index.primaryKey}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDeleteIndex(index.uid)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
                    aria-label={`Supprimer l'index ${index.uid}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Documents</span>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      <span className="font-semibold text-gray-800">
                        {index.stats?.numberOfDocuments?.toLocaleString() || '0'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Statut</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      index.stats?.isIndexing 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {index.stats?.isIndexing ? 'Indexation...' : 'Prêt'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Mis à jour</span>
                    <span className="text-xs text-gray-500">
                      {index.updatedAt ? new Date(index.updatedAt).toLocaleDateString('fr-FR') : 'N/A'}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200/50">
                  <Link 
                    href={`/indexes/${index.uid}`}
                    className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 font-medium group-hover:shadow-lg"
                  >
                    <span>Gérer l'Index</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
