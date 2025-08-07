'use client';

import { useState, useEffect } from 'react';
import { getMeilisearchClient, waitForTask } from '@/lib/meilisearch';
import { useI18n } from '@/components/I18nProvider';

interface IndexSettingsProps {
  indexUid: string;
}

export default function IndexSettings({ indexUid }: IndexSettingsProps) {
  const { t } = useI18n();
  const [settings, setSettings] = useState<any>({
    displayedAttributes: [],
    searchableAttributes: [],
    filterableAttributes: [],
    sortableAttributes: [],
    rankingRules: [],
    stopWords: [],
    synonyms: {},
    distinctAttribute: null,
    typoTolerance: {
      enabled: true,
      minWordSizeForTypos: {
        oneTypo: 5,
        twoTypos: 9,
      },
      disableOnWords: [],
      disableOnAttributes: [],
    },
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('displayed');
  const [newAttribute, setNewAttribute] = useState('');
  const [newRankingRule, setNewRankingRule] = useState('');
  const [newStopWord, setNewStopWord] = useState('');
  const [newSynonymKey, setNewSynonymKey] = useState('');
  const [newSynonymValue, setNewSynonymValue] = useState('');

  const errorToMessage = (e: unknown) => {
    if (e instanceof Error) return e.message;
    try { return JSON.stringify(e); } catch { return String(e); }
  };

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const allSettings = await getMeilisearchClient().index(indexUid).getSettings();
      setSettings(allSettings);
      setError(null);
    } catch (err: unknown) {
      setError(t('settings.fetch_failed', { message: errorToMessage(err) }));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [indexUid]);

  const updateSettings = async (settingType: string, newValue: any) => {
    try {
      setLoading(true);
      const updateData = { [settingType]: newValue };
      const task = await getMeilisearchClient().index(indexUid).updateSettings(updateData);
      await waitForTask(task.taskUid);
      
      setSuccess(t('settings.success', { setting: settingType }));
      setTimeout(() => setSuccess(null), 3000);
      
      fetchSettings();
    } catch (err: unknown) {
      setError(t('settings.update_failed', { message: errorToMessage(err) }));
    } finally {
      setLoading(false);
    }
  };

  const handleAddAttribute = (settingType: string) => {
    if (!newAttribute.trim()) return;
    
    const currentAttributes = [...settings[settingType]];
    if (!currentAttributes.includes(newAttribute)) {
      const updatedAttributes = [...currentAttributes, newAttribute];
      updateSettings(settingType, updatedAttributes);
      setNewAttribute('');
    }
  };

  const handleRemoveAttribute = (settingType: string, attribute: string) => {
    const updatedAttributes = settings[settingType].filter((attr: string) => attr !== attribute);
    updateSettings(settingType, updatedAttributes);
  };

  const handleAddRankingRule = () => {
    if (!newRankingRule.trim()) return;
    
    const currentRules = [...settings.rankingRules];
    if (!currentRules.includes(newRankingRule)) {
      const updatedRules = [...currentRules, newRankingRule];
      updateSettings('rankingRules', updatedRules);
      setNewRankingRule('');
    }
  };

  const handleRemoveRankingRule = (rule: string) => {
    const updatedRules = settings.rankingRules.filter((r: string) => r !== rule);
    updateSettings('rankingRules', updatedRules);
  };

  const handleAddStopWord = () => {
    if (!newStopWord.trim()) return;
    
    const currentStopWords = [...settings.stopWords];
    if (!currentStopWords.includes(newStopWord)) {
      const updatedStopWords = [...currentStopWords, newStopWord];
      updateSettings('stopWords', updatedStopWords);
      setNewStopWord('');
    }
  };

  const handleRemoveStopWord = (word: string) => {
    const updatedStopWords = settings.stopWords.filter((w: string) => w !== word);
    updateSettings('stopWords', updatedStopWords);
  };

  const handleAddSynonym = () => {
    if (!newSynonymKey.trim() || !newSynonymValue.trim()) return;
    
    const synonymValues = newSynonymValue.split(',').map(s => s.trim()).filter(Boolean);
    if (synonymValues.length === 0) return;
    
    const updatedSynonyms = { ...settings.synonyms };
    updatedSynonyms[newSynonymKey] = synonymValues;
    
    updateSettings('synonyms', updatedSynonyms);
    setNewSynonymKey('');
    setNewSynonymValue('');
  };

  const handleRemoveSynonym = (key: string) => {
    const updatedSynonyms = { ...settings.synonyms };
    delete updatedSynonyms[key];
    updateSettings('synonyms', updatedSynonyms);
  };

  const handleSetDistinctAttribute = () => {
    updateSettings('distinctAttribute', newAttribute || null);
    setNewAttribute('');
  };

  const renderAttributeList = (settingType: string, title: string) => {
    return (
      <div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <div className="flex mb-4">
          <input
            type="text"
            value={newAttribute}
            onChange={(e) => setNewAttribute(e.target.value)}
            placeholder={t('settings.attribute_placeholder')}
            className="flex-grow p-2 border border-gray-300 rounded-l-md"
          />
          <button
            onClick={() => handleAddAttribute(settingType)}
            className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
          >
            {t('settings.add')}
          </button>
        </div>
        
        <div className="space-y-2">
          {settings[settingType].length === 0 ? (
            <p className="text-gray-500">{t('settings.no_attributes')}</p>
          ) : (
            settings[settingType].map((attr: string) => (
              <div key={attr} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <span>{attr}</span>
                <button
                  onClick={() => handleRemoveAttribute(settingType, attr)}
                  className="text-red-500 hover:text-red-700"
                >
                  {t('settings.remove')}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderRankingRules = () => {
    return (
      <div>
        <h3 className="text-lg font-semibold mb-2">{t('settings.tabs.ranking')}</h3>
        <div className="flex mb-4">
          <input
            type="text"
            value={newRankingRule}
            onChange={(e) => setNewRankingRule(e.target.value)}
            placeholder={t('settings.ranking_placeholder')}
            className="flex-grow p-2 border border-gray-300 rounded-l-md"
          />
          <button
            onClick={handleAddRankingRule}
            className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
          >
            {t('settings.add')}
          </button>
        </div>
        
        <div className="space-y-2">
          {settings.rankingRules.length === 0 ? (
            <p className="text-gray-500">{t('settings.no_ranking')}</p>
          ) : (
            settings.rankingRules.map((rule: string, index: number) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <span>{rule}</span>
                <button
                  onClick={() => handleRemoveRankingRule(rule)}
                  className="text-red-500 hover:text-red-700"
                >
                  {t('settings.remove')}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderStopWords = () => {
    return (
      <div>
        <h3 className="text-lg font-semibold mb-2">{t('settings.tabs.stopWords')}</h3>
        <div className="flex mb-4">
          <input
            type="text"
            value={newStopWord}
            onChange={(e) => setNewStopWord(e.target.value)}
            placeholder={t('settings.stopword_placeholder')}
            className="flex-grow p-2 border border-gray-300 rounded-l-md"
          />
          <button
            onClick={handleAddStopWord}
            className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
          >
            {t('settings.add')}
          </button>
        </div>
        
        <div className="space-y-2">
          {settings.stopWords.length === 0 ? (
            <p className="text-gray-500">{t('settings.no_stopwords')}</p>
          ) : (
            settings.stopWords.map((word: string, index: number) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <span>{word}</span>
                <button
                  onClick={() => handleRemoveStopWord(word)}
                  className="text-red-500 hover:text-red-700"
                >
                  {t('settings.remove')}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderSynonyms = () => {
    return (
      <div>
        <h3 className="text-lg font-semibold mb-2">{t('settings.tabs.synonyms')}</h3>
        <div className="space-y-2 mb-4">
          <input
            type="text"
            value={newSynonymKey}
            onChange={(e) => setNewSynonymKey(e.target.value)}
            placeholder={t('settings.synonym_word')}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            value={newSynonymValue}
            onChange={(e) => setNewSynonymValue(e.target.value)}
            placeholder={t('settings.synonym_values')}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={handleAddSynonym}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {t('settings.add_synonym')}
          </button>
        </div>
        
        <div className="space-y-2">
          {Object.keys(settings.synonyms).length === 0 ? (
            <p className="text-gray-500">{t('settings.no_synonyms')}</p>
          ) : (
            Object.entries(settings.synonyms).map(([key, values]: [string, unknown]) => (
              <div key={key} className="p-2 bg-gray-50 rounded-md">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold">{key}</span>
                  <button
                    onClick={() => handleRemoveSynonym(key)}
                    className="text-red-500 hover:text-red-700"
                  >
                    {t('settings.remove')}
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  {t('settings.synonyms_label', { values: Array.isArray(values) ? (values as string[]).join(', ') : JSON.stringify(values) })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderDistinctAttribute = () => {
    return (
      <div>
        <h3 className="text-lg font-semibold mb-2">{t('settings.tabs.distinct')}</h3>
        <div className="flex mb-4">
          <input
            type="text"
            value={newAttribute}
            onChange={(e) => setNewAttribute(e.target.value)}
            placeholder={t('settings.attribute_placeholder')}
            className="flex-grow p-2 border border-gray-300 rounded-l-md"
          />
          <button
            onClick={handleSetDistinctAttribute}
            className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
          >
            {t('settings.set')}
          </button>
        </div>
        
        <div>
          {settings.distinctAttribute ? (
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
              <span>{settings.distinctAttribute}</span>
              <button
                onClick={() => updateSettings('distinctAttribute', null)}
                className="text-red-500 hover:text-red-700"
              >
                {t('settings.remove_distinct')}
              </button>
            </div>
          ) : (
            <p className="text-gray-500">{t('settings.no_distinct')}</p>
          )}
        </div>
      </div>
    );
  };

  const renderTypoTolerance = () => {
    return (
      <div>
        <h3 className="text-lg font-semibold mb-2">{t('settings.tabs.typo')}</h3>
        
        <div className="mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.typoTolerance.enabled}
              onChange={(e) => {
                const updatedTypoTolerance = {
                  ...settings.typoTolerance,
                  enabled: e.target.checked
                };
                updateSettings('typoTolerance', updatedTypoTolerance);
              }}
              className="rounded"
            />
            <span>{t('settings.enable_typo')}</span>
          </label>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('settings.min_word_one')}
            </label>
            <input
              type="number"
              value={settings.typoTolerance.minWordSizeForTypos.oneTypo}
              onChange={(e) => {
                const updatedTypoTolerance = {
                  ...settings.typoTolerance,
                  minWordSizeForTypos: {
                    ...settings.typoTolerance.minWordSizeForTypos,
                    oneTypo: parseInt(e.target.value)
                  }
                };
                updateSettings('typoTolerance', updatedTypoTolerance);
              }}
              min="1"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('settings.min_word_two')}
            </label>
            <input
              type="number"
              value={settings.typoTolerance.minWordSizeForTypos.twoTypos}
              onChange={(e) => {
                const updatedTypoTolerance = {
                  ...settings.typoTolerance,
                  minWordSizeForTypos: {
                    ...settings.typoTolerance.minWordSizeForTypos,
                    twoTypos: parseInt(e.target.value)
                  }
                };
                updateSettings('typoTolerance', updatedTypoTolerance);
              }}
              min="1"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{t('settings.title', { index: indexUid })}</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-700">{t('settings.loading')}</p>
        </div>
      ) : (
        <div>
          <div className="mb-6 border-b">
            <nav className="flex flex-wrap -mb-px">
              <button
                onClick={() => setActiveTab('displayed')}
                className={`mr-4 py-2 px-4 border-b-2 font-medium text-sm transition-all duration-300 ${
                  activeTab === 'displayed'
                    ? 'border-blue-500 text-blue-700 bg-blue-50 shadow-sm'
                    : 'border-transparent text-gray-600 hover:text-blue-700 hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-sm'
                }`}
              >
                {t('settings.tabs.displayed')}
              </button>
              <button
                onClick={() => setActiveTab('searchable')}
                className={`mr-4 py-2 px-4 border-b-2 font-medium text-sm transition-all duration-300 ${
                  activeTab === 'searchable'
                    ? 'border-blue-500 text-blue-700 bg-blue-50 shadow-sm'
                    : 'border-transparent text-gray-600 hover:text-blue-700 hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-sm'
                }`}
              >
                {t('settings.tabs.searchable')}
              </button>
              <button
                onClick={() => setActiveTab('filterable')}
                className={`mr-4 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'filterable'
                    ? 'border-blue-500 text-blue-700 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {t('settings.tabs.filterable')}
              </button>
              <button
                onClick={() => setActiveTab('sortable')}
                className={`mr-4 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'sortable'
                    ? 'border-blue-500 text-blue-700 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {t('settings.tabs.sortable')}
              </button>
              <button
                onClick={() => setActiveTab('ranking')}
                className={`mr-4 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'ranking'
                    ? 'border-blue-500 text-blue-700 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {t('settings.tabs.ranking')}
              </button>
              <button
                onClick={() => setActiveTab('stopWords')}
                className={`mr-4 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'stopWords'
                    ? 'border-blue-500 text-blue-700 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {t('settings.tabs.stopWords')}
              </button>
              <button
                onClick={() => setActiveTab('synonyms')}
                className={`mr-4 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'synonyms'
                    ? 'border-blue-500 text-blue-700 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {t('settings.tabs.synonyms')}
              </button>
              <button
                onClick={() => setActiveTab('distinct')}
                className={`mr-4 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'distinct'
                    ? 'border-blue-500 text-blue-700 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {t('settings.tabs.distinct')}
              </button>
              <button
                onClick={() => setActiveTab('typo')}
                className={`mr-4 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'typo'
                    ? 'border-blue-500 text-blue-700 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {t('settings.tabs.typo')}
              </button>
            </nav>
          </div>
          
          <div className="mt-6">
            {activeTab === 'displayed' && renderAttributeList('displayedAttributes', t('settings.tabs.displayed'))}
            {activeTab === 'searchable' && renderAttributeList('searchableAttributes', t('settings.tabs.searchable'))}
            {activeTab === 'filterable' && renderAttributeList('filterableAttributes', t('settings.tabs.filterable'))}
            {activeTab === 'sortable' && renderAttributeList('sortableAttributes', t('settings.tabs.sortable'))}
            {activeTab === 'ranking' && renderRankingRules()}
            {activeTab === 'stopWords' && renderStopWords()}
            {activeTab === 'synonyms' && renderSynonyms()}
            {activeTab === 'distinct' && renderDistinctAttribute()}
            {activeTab === 'typo' && renderTypoTolerance()}
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              onClick={fetchSettings}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {t('settings.refresh')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
