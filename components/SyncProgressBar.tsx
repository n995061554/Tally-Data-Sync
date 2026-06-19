import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, CheckCircle2, AlertTriangle, Database, Wifi } from 'lucide-react';
import { SyncStatus } from '../types';

interface SyncProgressBarProps {
  progress: number;
  stepText: string;
  status: SyncStatus;
}

export const SyncProgressBar: React.FC<SyncProgressBarProps> = ({ progress, stepText, status }) => {
  const isSyncing = status === SyncStatus.SYNCING;
  const isSuccess = status === SyncStatus.SUCCESS;
  const isError = status === SyncStatus.ERROR;

  if (!isSyncing && !isSuccess && !isError) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -15, scale: 0.98 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full"
      >
        <div className={`relative overflow-hidden rounded-xl border p-5 backdrop-blur-md shadow-lg transition-all duration-300 ${
          isError 
            ? 'border-rose-500/30 bg-rose-950/10' 
            : isSuccess 
              ? 'border-emerald-500/25 bg-emerald-950/10' 
              : 'border-amber-500/20 bg-slate-800/40'
        }`}>
          {/* Decorative subtle background mesh */}
          <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
          
          {/* Top Row: Meta Status and Labels */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 relative z-10">
            <div className="flex items-center space-x-3">
              {isSyncing && (
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping" />
                  <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
              {isSuccess && (
                <div className="p-2 bg-emerald-500/15 text-emerald-400 rounded-lg shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              )}
              {isError && (
                <div className="p-2 bg-rose-500/15 text-rose-400 rounded-lg">
                  <AlertTriangle className="h-4 w-4" />
                </div>
              )}
              
              <div>
                <span className="text-[10px] uppercase tracking-widest font-mono font-bold text-slate-500">
                  Real-time pipeline synchronizer
                </span>
                <h4 className={`text-sm font-semibold tracking-tight ${
                  isError ? 'text-rose-400' : isSuccess ? 'text-emerald-400' : 'text-slate-200'
                }`}>
                  {isSyncing ? 'Synchronizing Datasets...' : isSuccess ? 'Database Synchronized Cleanly' : 'Sync Process Fault'}
                </h4>
              </div>
            </div>

            {/* Additional telemetry details during transmission */}
            {isSyncing && (
              <div className="flex items-center space-x-4 text-[11px] font-mono text-slate-400 self-start md:self-auto">
                <div className="flex items-center space-x-1">
                  <Database className="h-3 w-3 text-amber-500/70" />
                  <span>Format: XML Blocks</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Wifi className="h-3 w-3 text-emerald-500/70" />
                  <span>Pipeline: {progress < 90 ? '480 KB/s' : 'Compiling...'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Real-time description label */}
          <div className="flex justify-between items-end mb-2 relative z-10">
            <div className="flex flex-col">
              <span className="text-slate-400 text-xs font-medium font-mono min-h-[16px] transition-all">
                {stepText}
              </span>
            </div>
            <div className="flex items-baseline space-x-0.5">
              <span className={`text-lg font-black font-mono tracking-tighter ${
                isError ? 'text-rose-400' : isSuccess ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {progress}
              </span>
              <span className="text-xs font-semibold text-slate-500">%</span>
            </div>
          </div>

          {/* The Progress Bar Backing */}
          <div className="w-full h-3.5 bg-slate-900/80 rounded-full overflow-hidden p-[2px] border border-slate-800 relative z-10 shadow-inner">
            {/* Smooth animated active filling bar */}
            <motion.div
              className={`h-full rounded-full transition-all duration-150 ${
                isError 
                  ? 'bg-gradient-to-r from-rose-600 via-rose-500 to-red-400' 
                  : isSuccess 
                    ? 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400' 
                    : 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400'
              }`}
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut', duration: 0.15 }}
            />
          </div>

          {/* Inline close or retry indicators for finished states */}
          {!isSyncing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3.5 pt-3 border-t border-slate-800 flex justify-between items-center text-[11px] font-mono relative z-10"
            >
              <span className="text-slate-500">
                {isSuccess ? 'Dataset schema successfully merged with cloud buffer.' : 'Process aborted. Check error stack trace logs.'}
              </span>
              {isSuccess && (
                <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  UP-TO-DATE
                </span>
              )}
              {isError && (
                <span className="text-rose-400 font-semibold bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                  ABORTED
                </span>
              )}
            </motion.div>
          )}

        </div>
      </motion.div>
    </AnimatePresence>
  );
};
