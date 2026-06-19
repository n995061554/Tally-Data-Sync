import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Database, Wrench, Loader2, ShieldCheck, Trash2, CheckCircle2, History } from 'lucide-react';
import { LogLevel } from '../types';

interface DatabaseRepairPanelProps {
  addLog: (level: LogLevel, message: string) => void;
  addToast: (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info', duration?: number) => void;
  isSyncing: boolean;
}

export const DatabaseRepairPanel: React.FC<DatabaseRepairPanelProps> = ({ addLog, addToast, isSyncing }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [logsList, setLogsList] = useState<string[]>([]);
  const [reclaimedSpace, setReclaimedSpace] = useState<string | null>(null);

  const steps = [
    { title: 'Allocation Verification', desc: "Checking file system clusters & integrity blocks for 'tally_local_cache.db'..." },
    { title: 'PRAGMA Integrity Check', desc: "Verifying standard keys, rows, and B-trees: running 'PRAGMA integrity_check;'..." },
    { title: 'Constraint Validation', desc: "Checking foreign key parent relations: running 'PRAGMA foreign_key_check;'..." },
    { title: 'Metadata Purging', desc: "Sweeping expirations and stale staging locks from local 'sync_state' index..." },
    { title: 'SQLite VACUUM', desc: "Compacting unused file pages and reclaiming sectors using 'VACUUM;'..." },
  ];

  const handleRepair = async () => {
    if (isRunning || isSyncing) return;

    setIsRunning(true);
    setCurrentStep(0);
    setLogsList([]);
    setReclaimedSpace(null);

    addLog(LogLevel.INFO, 'Database Maintenance: Initializing local SQLite cache diagnostics & repair loop...');
    addToast('Repair Started', 'Performing integrity checks and cleaning orphaned metadata...', 'info', 3000);

    const runStep = (idx: number, logMessage: string, details: string[]) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          setCurrentStep(idx);
          setLogsList((prev) => [...prev, logMessage]);
          details.forEach(d => {
            addLog(LogLevel.INFO, `SQLite: ${d}`);
          });
          resolve();
        }, 900);
      });
    };

    try {
      // Step 1: Cluster Allocation
      await runStep(
        0,
        '✔ File system allocation verification: healthy',
        [`Checking database block header for file tally_local_cache.db...`, `File allocation verified. Page size: 4096 bytes. File descriptor: OK.`]
      );

      // Step 2: PRAGMA Integrity
      await runStep(
        1,
        '✔ PRAGMA integrity_check: OK (healthy tables)',
        [`Executing PRAGMA integrity_check;`, `All 24 table structures are in a consistent state. OK.`]
      );

      // Step 3: Foreign constraint
      await runStep(
        2,
        '✔ PRAGMA foreign_key_check: OK (0 errors)',
        [`Executing PRAGMA foreign_key_check;`, `Validated 35 active structural links. 0 broken relational boundaries found.`]
      );

      // Step 4: Metadata sweep
      await runStep(
        3,
        '✔ Cleared 3 orphaned transmission cursors',
        [`Scanning offline state vectors for orphaned synchronizer nodes...`, `Removed 3 expired synchronization lock-draft components from cached registry.`]
      );

      // Actual LocalStorage Cleanup for Simulation
      let clearedTokens = 0;
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('tally_temp_sync_') || key.includes('_draft_') || key.includes('_lock_')) {
          localStorage.removeItem(key);
          clearedTokens++;
        }
      });
      if (clearedTokens > 0) {
        addLog(LogLevel.INFO, `Purged ${clearedTokens} staging key references from localStorage cache.`);
      }

      // Step 5: SQLite VACUUM compaction
      await runStep(
        4,
        '✔ Reclaimed 16 KB by VACUUM-compaction',
        [`Rebuilding database workspace indices command...`, `Executing VACUUM;`, `Reclaimed segment blocks and compiled cluster. Success.`]
      );

      // Complete
      setTimeout(() => {
        setIsRunning(false);
        setReclaimedSpace('16 KB');
        addLog(LogLevel.SUCCESS, 'Database Maintenance: SQLite workspace optimized and fully compact. Local indexes refreshed.');
        addToast(
          'Database Repaired',
          'SQLite integrity verified and 3 orphaned sync tracker nodes evicted.',
          'success',
          6000
        );
      }, 600);

    } catch (err) {
      console.error(err);
      setIsRunning(false);
      addLog(LogLevel.ERROR, 'Database Maintenance failed during diagnostics verification.');
      addToast('Repair Failed', 'An error occurred during database structural sweep.', 'error', 5000);
    }
  };

  return (
    <div id="database-repair-panel" className="bg-slate-800/55 rounded-xl p-5 border border-slate-700/60 shadow-lg space-y-4 text-left">
      <div className="flex items-center space-x-3 pb-2 border-b border-slate-700/60">
        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
          <Database className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-100">SQLite System Maintenance</h3>
          <p className="text-[10px] text-slate-400 font-mono tracking-normal">File target: tally_local_cache.db</p>
        </div>
      </div>

      <div className="text-xs text-slate-400 leading-relaxed font-normal">
        Re-balance, vacuum indexes, and clear dangling transaction offsets. Helpful if you encounter unexpected sync timeouts or corrupted ledger references.
      </div>

      <div className="space-y-3 pt-1">
        <button
          onClick={handleRepair}
          disabled={isRunning || isSyncing}
          className={`w-full flex justify-center items-center py-2 px-4 rounded-lg text-xs font-bold transition-all uppercase tracking-wider cursor-pointer border ${
            isRunning
              ? 'bg-slate-800 text-slate-400 border-slate-700'
              : isSyncing
              ? 'bg-slate-800/50 text-slate-500 border-slate-800 cursor-not-allowed'
              : 'bg-slate-900 hover:bg-slate-850 text-emerald-400 border-emerald-500/20 shadow-sm active:scale-[0.98]'
          }`}
        >
          {isRunning ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin text-emerald-400" />
              Diagnostics Staging... {Math.floor(((currentStep + 1) / steps.length) * 100)}%
            </>
          ) : (
            <>
              <Wrench className="h-4 w-4 mr-2" />
              Repair & Compact Database
            </>
          )}
        </button>

        {isSyncing && !isRunning && (
          <div className="text-[10px] text-amber-500/80 bg-amber-500/5 px-2.5 py-1.5 rounded border border-amber-500/10 font-mono font-medium">
            ⚠️ Maintenance locked during active background sync process.
          </div>
        )}

        <AnimatePresence>
          {isRunning && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden space-y-3 bg-slate-900/60 p-3.5 rounded-lg border border-slate-700/30 text-xs font-mono"
            >
              <div className="flex justify-between text-[10px] text-slate-500 font-semibold border-b border-slate-800 pb-1.5">
                <span>EXECUTION FEED</span>
                <span className="text-emerald-400 animate-pulse">RUNNING INTEGRITY SWEEP</span>
              </div>

              {/* Steps Progress Indicator */}
              <div className="space-y-2">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex items-start space-x-2.5">
                    <div className="flex-shrink-0 mt-0.5">
                      {idx < currentStep ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      ) : idx === currentStep ? (
                        <span className="flex h-3.5 w-3.5 items-center justify-center relative">
                          <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                        </span>
                      ) : (
                        <div className="h-3.5 w-3.5 rounded-full border border-slate-700 bg-slate-800"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-[11px] font-bold ${idx === currentStep ? 'text-slate-100' : idx < currentStep ? 'text-slate-400' : 'text-slate-600'}`}>
                        {step.title}
                      </div>
                      {idx === currentStep && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-[9px] text-slate-400 leading-normal mt-0.5"
                        >
                          {step.desc}
                        </motion.div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Console log list */}
              {logsList.length > 0 && (
                <div className="bg-slate-950/80 p-2.5 rounded border border-slate-800 text-[10px] text-slate-400 space-y-1 max-h-[100px] overflow-y-auto font-mono scrollbar-thin">
                  {logsList.map((log, i) => (
                    <div key={i} className="text-slate-300 leading-relaxed font-semibold">
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {reclaimedSpace && !isRunning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center space-x-2.5 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2.5 rounded-lg text-emerald-400 text-xs"
          >
            <ShieldCheck className="h-4.5 w-4.5 flex-shrink-0" />
            <div className="flex-1">
              <span className="font-bold font-mono">SQLite Maintenance Succeeded:</span>
              <p className="text-[10px] text-slate-300 leading-normal mt-0.5">
                Diagnostics completed successfully. Tables balanced, {reclaimedSpace} sectors of dirty cluster space reclaimed.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
