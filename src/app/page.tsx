'use client';

import Link from 'next/link';
import { useI18n } from '@/components/I18nProvider';

export default function Home() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            {t('home.title')}
          </h1>
          <div className="max-w-2xl mx-auto">
            <p className="text-xl text-gray-600 leading-relaxed">
              {t('home.subtitle')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slide-up">
          <DashboardCard 
            title={t('home.cards.indexes.title')}
            description={t('home.cards.indexes.desc')}
            link="/indexes"
            exploreLabel={t('home.card.explore')}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>}
          />
          
          <DashboardCard 
            title={t('home.cards.search.title')}
            description={t('home.cards.search.desc')}
            link="/search"
            exploreLabel={t('home.card.explore')}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>}
          />
        </div>

        <div className="mt-16 glass rounded-xl p-8 border border-gray-200/30 shadow-sm animate-fade-in" style={{animationDelay: '0.3s'}}>
          <h2 className="text-2xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">{t('home.gettingStarted.title')}</h2>
          <div className="space-y-6">
            <div className="flex items-start group transition-all duration-300 hover:-translate-y-1 hover:shadow-md p-4 rounded-lg">
              <div className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full p-2 mr-4 shadow-md group-hover:shadow-blue-200 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-lg text-gray-800 group-hover:text-blue-700 transition-colors duration-300">{t('home.gettingStarted.viewIndexes.title')}</h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">{t('home.gettingStarted.viewIndexes.desc')}</p>
              </div>
            </div>
            
            <div className="flex items-start group transition-all duration-300 hover:-translate-y-1 hover:shadow-md p-4 rounded-lg">
              <div className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full p-2 mr-4 shadow-md group-hover:shadow-blue-200 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-lg text-gray-800 group-hover:text-blue-700 transition-colors duration-300">{t('home.gettingStarted.manageDocs.title')}</h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">{t('home.gettingStarted.manageDocs.desc')}</p>
              </div>
            </div>
            
            <div className="flex items-start group transition-all duration-300 hover:-translate-y-1 hover:shadow-md p-4 rounded-lg">
              <div className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full p-2 mr-4 shadow-md group-hover:shadow-blue-200 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-lg text-gray-800 group-hover:text-blue-700 transition-colors duration-300">{t('home.gettingStarted.configure.title')}</h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">{t('home.gettingStarted.configure.desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ title, description, link, icon, exploreLabel }: { 
  title: string; 
  description: string; 
  link: string;
  icon: React.ReactNode;
  exploreLabel?: string;
}) {
  return (
    <Link href={link} className="block group">
      <div className="card border border-gray-200/50 rounded-xl p-8 transition-all duration-300 hover:shadow-lg hover:border-blue-400/50 bg-white relative overflow-hidden group">
        {/* Background gradient that appears on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-indigo-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="relative z-10">
          <div className="flex items-center mb-5">
            <div className="mr-5 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg bg-blue-50/50 group-hover:bg-blue-50 transition-all duration-300">
              {icon}
            </div>
            <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 group-hover:from-blue-700 group-hover:to-indigo-700 transition-all duration-300">
              {title}
            </h2>
          </div>
          <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300 ml-1">{description}</p>
          
          {/* Arrow indicator that appears on hover */}
          <div className="mt-4 flex items-center text-blue-600 opacity-0 transform translate-x-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300">
            <span className="text-sm font-medium">{exploreLabel ?? 'Explore'}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
