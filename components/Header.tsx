
import React from 'react';
import { DatabaseIcon } from './icons/Icons';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-800/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <DatabaseIcon className="h-8 w-8 text-emerald-400" />
            <h1 className="text-xl font-bold tracking-tight text-slate-100">
              Tally Data Sync
            </h1>
          </div>
          <div className="text-sm font-medium text-slate-400">
            Desktop Client
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
