
import React from 'react';
import { ArrowPathIcon, PlayIcon } from './icons/Icons';

interface SyncControlsProps {
  onSync: (isFullSync: boolean) => void;
  isSyncing: boolean;
}

const SyncControls: React.FC<SyncControlsProps> = ({ onSync, isSyncing }) => {
  return (
    <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700/50 shadow-md">
       <div className="flex items-center mb-4">
        <PlayIcon className="h-6 w-6 mr-3 text-slate-400" />
        <h3 className="text-lg font-semibold text-slate-200">Sync Controls</h3>
      </div>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <button
          onClick={() => onSync(true)}
          disabled={isSyncing}
          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-emerald-500 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors"
        >
           <ArrowPathIcon animate={isSyncing} className="-ml-1 mr-2 h-5 w-5" />
          Initial Full Sync
        </button>
        <button
          onClick={() => onSync(false)}
          disabled={isSyncing}
          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-slate-600 text-sm font-medium rounded-md shadow-sm text-slate-200 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-500 disabled:bg-slate-500 disabled:text-white disabled:cursor-not-allowed transition-colors"
        >
          Incremental Sync
        </button>
      </div>
    </div>
  );
};

export default SyncControls;
