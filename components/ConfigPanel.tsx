import React, { useState, useEffect } from 'react';
import { type TallyConfig, PermissionMode, LogLevel } from '../types';
import { CogIcon } from './icons/Icons';

interface ConfigPanelProps {
  config: TallyConfig;
  setConfig: (config: TallyConfig) => void;
  addLog: (level: LogLevel, message: string) => void;
}

const PRESET_COMPANIES = [
  'Patel Export Services',
  'A2Z Diagnostics Corp',
  'Universal Steel Traders',
];

const PRESET_YEARS = [
  '1-Apr-2026 to 31-Mar-2027',
  '1-Apr-2025 to 31-Mar-2026',
  '1-Apr-2024 to 31-Mar-2025',
];

const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, setConfig, addLog }) => {
  const [draft, setDraft] = useState<TallyConfig>({ ...config });
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);

  useEffect(() => {
    setDraft({ ...config });
  }, [config]);

  const handleChange = <K extends keyof TallyConfig>(key: K, value: TallyConfig[K]) => {
    setDraft(prev => ({ ...prev, [key]: value }));
  };

  const isCompanyChanged = 
    draft.companyName !== config.companyName || 
    draft.financialYear !== config.financialYear;

  const handleSaveAttempt = (e: React.FormEvent) => {
    e.preventDefault();

    if (!draft.host.trim()) {
      addLog(LogLevel.ERROR, 'Failed to save: Tally host address cannot be empty.');
      return;
    }
    if (!draft.port.trim()) {
      addLog(LogLevel.ERROR, 'Failed to save: Port cannot be empty.');
      return;
    }
    if (draft.autoSyncEnabled && (isNaN(draft.syncInterval) || draft.syncInterval < 1)) {
      addLog(LogLevel.ERROR, 'Failed to save: Sync interval must be at least 1 minute.');
      return;
    }

    if (isCompanyChanged && config.companyName && config.financialYear) {
      // Show company switch warning modal
      setShowWarningModal(true);
    } else {
      executeSave();
    }
  };

  const executeSave = () => {
    setConfig(draft);
    localStorage.setItem('tally_config', JSON.stringify(draft));
    setShowSavedFeedback(true);
    setShowWarningModal(false);
    
    addLog(LogLevel.SUCCESS, `Saved Tally Endpoint config. Active target: ${draft.companyName} (${draft.financialYear})`);
    
    setTimeout(() => {
      setShowSavedFeedback(false);
    }, 4500);
  };

  return (
    <div id="tally-config-panel-container" className="space-y-4">
      <div id="tally-config-panel" className="bg-slate-800/55 rounded-xl p-5 border border-slate-700/60 shadow-lg space-y-5 transition-all">
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
          <div className="flex items-center">
            <div className="p-2 bg-emerald-500/10 rounded-lg mr-3 text-emerald-400">
              <CogIcon className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Tally Sync Settings</h3>
              <p className="text-xs text-slate-400 font-mono text-[10px]">Active Session: {config.companyName || 'None'}</p>
            </div>
          </div>
          {showSavedFeedback && (
            <span className="text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/35 px-2.5 py-1 rounded-full animate-bounce">
              Config Saved!
            </span>
          )}
        </div>

        <form id="config-form" onSubmit={handleSaveAttempt} className="space-y-4">
          
          {/* Company Selection Panel (Critical Warning Trigger) */}
          <div className="space-y-3 bg-slate-900/40 p-3.5 rounded-lg border border-slate-700/30">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Active Tally Company Context</h4>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700 font-mono">1 Active Slot</span>
            </div>
            
            <div className="space-y-3">
              <div>
                <label htmlFor="tally-company-select" className="block text-xs font-medium text-slate-400 mb-1">Company Name</label>
                <select
                  id="tally-company-select"
                  value={draft.companyName || ''}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                  className="block w-full bg-slate-800 border border-slate-700/80 rounded-md py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-xs text-slate-200"
                >
                  <option value="">-- Choose Tally Profile --</option>
                  {PRESET_COMPANIES.map(comp => (
                    <option key={comp} value={comp}>{comp}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="tally-financial-year-select" className="block text-xs font-medium text-slate-400 mb-1">Financial Year Period</label>
                <select
                  id="tally-financial-year-select"
                  value={draft.financialYear || ''}
                  onChange={(e) => handleChange('financialYear', e.target.value)}
                  className="block w-full bg-slate-800 border border-slate-700/80 rounded-md py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-xs text-slate-200 font-mono"
                >
                  <option value="">-- Choose Period --</option>
                  {PRESET_YEARS.map(yr => (
                    <option key={yr} value={yr}>{yr}</option>
                  ))}
                </select>
              </div>
            </div>

            {isCompanyChanged && (
              <div className="bg-amber-950/30 border border-amber-500/20 p-2.5 rounded text-[11px] text-amber-300 space-y-1">
                <span className="font-bold">⚠️ Company Context Mismatch:</span>
                <p className="text-slate-300 leading-relaxed">
                  Saving will change the sync target from <span className="font-semibold text-white">{config.companyName || 'None'}</span> to <span className="font-semibold text-white">{draft.companyName}</span>. A cold re-sync will trigger to prevent mixed ledger entries.
                </p>
              </div>
            )}
          </div>

          {/* Tally Connectivity Frame */}
          <div className="space-y-3 bg-slate-900/40 p-3.5 rounded-lg border border-slate-700/30">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">ODBC Connection Endpoint</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label htmlFor="tally-host" className="block text-xs font-medium text-slate-400 mb-1">Server IP Address</label>
                <input
                  id="tally-host"
                  type="text"
                  value={draft.host || ''}
                  onChange={(e) => handleChange('host', e.target.value)}
                  placeholder="localhost"
                  className="block w-full bg-slate-800 border border-slate-700/80 rounded-md py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-xs text-slate-200 font-mono"
                />
              </div>
              <div>
                <label htmlFor="tally-port" className="block text-xs font-medium text-slate-400 mb-1">ODBC Port</label>
                <input
                  id="tally-port"
                  type="text"
                  value={draft.port || ''}
                  onChange={(e) => handleChange('port', e.target.value)}
                  placeholder="9000"
                  className="block w-full bg-slate-800 border border-slate-700/80 rounded-md py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-xs text-slate-200 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Sync Authentication */}
          <div className="space-y-3 bg-slate-900/40 p-3.5 rounded-lg border border-slate-700/30">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Gateway Authorization</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="tally-username" className="block text-xs font-medium text-slate-400 mb-1">Tally User ID</label>
                <input
                  id="tally-username"
                  type="text"
                  value={draft.username || ''}
                  onChange={(e) => handleChange('username', e.target.value)}
                  placeholder="No Credentials"
                  className="block w-full bg-slate-800 border border-slate-700/80 rounded-md py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-xs text-slate-200"
                />
              </div>
              <div>
                <label htmlFor="tally-password" className="block text-xs font-medium text-slate-400 mb-1">Tally Password</label>
                <div className="relative">
                  <input
                    id="tally-password"
                    type={showPassword ? "text" : "password"}
                    value={draft.password || ''}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="••••••••"
                    className="block w-full bg-slate-800 border border-slate-700/80 rounded-md py-1.5 pl-3 pr-10 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-xs text-slate-200"
                  />
                  <button
                    id="btn-toggle-password"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 text-[10px] font-bold"
                  >
                    {showPassword ? "HIDE" : "SHOW"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Cloud API Frame */}
          <div className="space-y-3 bg-slate-900/40 p-3.5 rounded-lg border border-slate-700/30">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Cloud Server Parameters</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="company-id" className="block text-xs font-medium text-slate-400 mb-1">Mobile Sync Key</label>
                <input
                  id="company-id"
                  type="text"
                  value={draft.companyId || ''}
                  onChange={(e) => handleChange('companyId', e.target.value)}
                  className="block w-full bg-slate-800 border border-slate-700/80 rounded-md py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-xs text-slate-200 font-mono"
                />
              </div>
              <div>
                <label htmlFor="sync-interval" className="block text-xs font-medium text-slate-400 mb-1">Auto Sync (Min)</label>
                <input
                  id="sync-interval"
                  type="number"
                  min="1"
                  disabled={!draft.autoSyncEnabled}
                  value={draft.syncInterval || ''}
                  onChange={(e) => handleChange('syncInterval', parseInt(e.target.value, 10) || 1)}
                  className={`block w-full bg-slate-800 border border-slate-700/80 rounded-md py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-xs font-mono transition-all ${
                    draft.autoSyncEnabled ? 'text-slate-200 opacity-100' : 'text-slate-500 opacity-40 cursor-not-allowed'
                  }`}
                />
              </div>
            </div>

            {/* Auto-Sync Toggle Switch */}
            <div className="flex items-center justify-between bg-slate-800/40 p-2.5 rounded border border-slate-700/50 mt-1">
              <div className="space-y-0.5 pr-2">
                <span className="block text-xs font-bold text-slate-200">Automatic Background Sync</span>
                <span className="block text-[10px] text-slate-400 leading-normal">
                  Periodically poll datasets in the background. Disabling this saves machine CPU/network usage.
                </span>
              </div>
              <button
                id="btn-toggle-auto-sync"
                type="button"
                role="switch"
                aria-checked={draft.autoSyncEnabled}
                onClick={() => handleChange('autoSyncEnabled', !draft.autoSyncEnabled)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                  draft.autoSyncEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    draft.autoSyncEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div>
              <label htmlFor="api-key" className="block text-xs font-medium text-slate-400 mb-1">Remote Access Token</label>
              <input
                id="api-key"
                type="password"
                value={draft.apiKey || ''}
                onChange={(e) => handleChange('apiKey', e.target.value)}
                className="block w-full bg-slate-800 border border-slate-700/80 rounded-md py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-xs text-slate-200 font-mono"
              />
            </div>
          </div>

          <button
            id="btn-save-sync-config"
            type="submit"
            className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-md text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 focus:outline-none cursor-pointer transition-all active:scale-[0.99] uppercase tracking-wider"
          >
            Apply & Save Parameters
          </button>
        </form>
      </div>

      {/* Warning Confirmation modal */}
      {showWarningModal && (
        <div id="co-change-warning-modal" className="bg-amber-950/40 border border-amber-600/40 p-4 rounded-xl text-xs text-amber-200 space-y-3 shadow-xl animate-fade-in animate-pulse duration-1000">
          <div className="flex items-center space-x-2 text-amber-400">
            <span className="text-base">⚠️</span>
            <span className="font-bold uppercase tracking-wider">CRITICAL: Sync Targets Mismatch Danger</span>
          </div>
          <p className="leading-relaxed">
            Your remote client target database is currently holding ledger masters synced for company: <strong className="text-white">"{config.companyName}"</strong>.
          </p>
          <p className="leading-relaxed">
            Changing sync context to <strong className="text-white">"{draft.companyName}"</strong> for financial year <strong className="text-white">"{draft.financialYear}"</strong> will cause data overlap or duplicate invoice listings in the mobile database cluster if active datasets are not completely overridden.
          </p>
          <div className="bg-slate-900/50 p-2.5 rounded font-medium border border-amber-600/20 text-slate-300">
            Clicking <strong className="text-emerald-400">"Confirm Reset and Sync Other Company"</strong> will wipe current local cache buffers, change active company target in sync node, and prepare the gateway loop for clean synchronization.
          </div>
          <div className="flex space-x-2 justify-end pt-2">
            <button
              type="button"
              onClick={() => setShowWarningModal(false)}
              className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded border border-slate-700 font-bold uppercase text-[10px] cursor-pointer hover:bg-slate-700"
            >
              Cancel Change
            </button>
            <button
              type="button"
              onClick={() => executeSave()}
              className="px-3 py-1.5 bg-amber-600 text-black hover:bg-amber-500 rounded font-bold uppercase text-[10px] cursor-pointer transition-all"
            >
              Confirm Reset & Sync Other Company
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigPanel;
