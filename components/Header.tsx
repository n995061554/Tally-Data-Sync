
import React from 'react';
import { DatabaseIcon } from './icons/Icons';

const isElectron = typeof window !== 'undefined' && navigator.userAgent.toLowerCase().indexOf(' electron/') > -1;

const Header: React.FC = () => {
  return (
    <header className="bg-slate-800/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <DatabaseIcon className="h-8 w-8 text-emerald-400" />
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-100">
                Tally Data Sync
              </h1>
              {isElectron ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Desktop Client (Live)
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
                  Cloud Preview (Simulation)
                </span>
              )}
            </div>
          </div>
          <div className="text-sm font-medium text-slate-400">
            {isElectron ? "Connected Mode" : "Demo Mode"}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
