import React, { useState, useEffect } from 'react';
import { type TallyConfig, PermissionMode, LogLevel } from '../types';
import { CogIcon } from './icons/Icons';

interface ConfigPanelProps {
  config: TallyConfig;
  setConfig: (config: TallyConfig) => void;
  addLog: (level: LogLevel, message: string) => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, setConfig, addLog }) => {
  // Use a local draft state so we don't spam parent/restart intervals on every keystroke
  const [draft, setDraft] = useState<TallyConfig>({ ...config });
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setDraft({ ...config });
  }, [config]);

  const handleChange = <K extends keyof TallyConfig>(key: K, value: TallyConfig[K]) => {
    setDraft(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!draft.host.trim()) {
      addLog(LogLevel.ERROR, 'Failed to save: Server address cannot be empty.');
      return;
    }
    if (!draft.port.trim()) {
      addLog(LogLevel.ERROR, 'Failed to save: Port cannot be empty.');
      return;
    }
    if (isNaN(draft.syncInterval) || draft.syncInterval < 1) {
      addLog(LogLevel.ERROR, 'Failed to save: Sync interval must be a positive number.');
      return;
    }

    // Pass up to parent
    setConfig(draft);

    // Persist to local storage
    localStorage.setItem('tally_config', JSON.stringify(draft));

    // Show visual confirmation
    setShowSavedFeedback(true);
    addLog(LogLevel.SUCCESS, `Configuration updated. Saved Tally ERP address http://${draft.host}:${draft.port}.`);

    setTimeout(() => {
      setShowSavedFeedback(false);
    }, 4000);
  };

  return (
    <div id="tally-config-panel" className="bg-slate-800/55 rounded-xl p-5 border border-slate-700/60 shadow-lg space-y-5 transition-all">
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
        <div className="flex items-center">
          <div className="p-2 bg-emerald-500/10 rounded-lg mr-3 text-emerald-400">
            <CogIcon className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Sync Settings</h3>
            <p className="text-xs text-slate-400">Configure Tally ERP & Cloud details</p>
          </div>
        </div>
        {showSavedFeedback && (
          <span className="text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2.5 py-1 rounded-full animate-bounce">
            Saved Successfully!
          </span>
        )}
      </div>

      <form id="config-form" onSubmit={handleSave} className="space-y-4">
        {/* Tally Connectivity Frame */}
        <div className="space-y-3 bg-slate-900/40 p-3.5 rounded-lg border border-slate-700/30">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Tally ODBC Server</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label htmlFor="tally-host" className="block text-xs font-medium text-slate-400 mb-1">Server Host / IP</label>
              <input
                id="tally-host"
                type="text"
                value={draft.host || ''}
                onChange={(e) => handleChange('host', e.target.value)}
                placeholder="e.g. localhost or 192.168.1.100"
                className="block w-full bg-slate-800 border border-slate-700/80 rounded-md py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-xs text-slate-200"
              />
            </div>
            <div>
              <label htmlFor="tally-port" className="block text-xs font-medium text-slate-400 mb-1">Port</label>
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
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">ODBC Authentication</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="tally-username" className="block text-xs font-medium text-slate-400 mb-1">Username (Optional)</label>
              <input
                id="tally-username"
                type="text"
                value={draft.username || ''}
                onChange={(e) => handleChange('username', e.target.value)}
                placeholder="No Auth"
                className="block w-full bg-slate-800 border border-slate-700/80 rounded-md py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-xs text-slate-200"
              />
            </div>
            <div>
              <label htmlFor="tally-password" className="block text-xs font-medium text-slate-400 mb-1">Password (Optional)</label>
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
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 text-xs"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Cloud Integration Frame */}
        <div className="space-y-3 bg-slate-900/40 p-3.5 rounded-lg border border-slate-700/30">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Cloud Synchronization</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="company-id" className="block text-xs font-medium text-slate-400 mb-1">Company Tag / ID</label>
              <input
                id="company-id"
                type="text"
                value={draft.companyId || ''}
                onChange={(e) => handleChange('companyId', e.target.value)}
                className="block w-full bg-slate-800 border border-slate-700/80 rounded-md py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-xs text-slate-200 font-mono"
              />
            </div>
            <div>
              <label htmlFor="sync-interval" className="block text-xs font-medium text-slate-400 mb-1">Interval (Minutes)</label>
              <input
                id="sync-interval"
                type="number"
                min="1"
                value={draft.syncInterval || ''}
                onChange={(e) => handleChange('syncInterval', parseInt(e.target.value, 10) || 1)}
                className="block w-full bg-slate-800 border border-slate-700/80 rounded-md py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-xs text-slate-200"
              />
            </div>
          </div>

          <div>
            <label htmlFor="api-key" className="block text-xs font-medium text-slate-400 mb-1">Cloud Sync Token / API Key</label>
            <input
              id="api-key"
              type="password"
              value={draft.apiKey || ''}
              onChange={(e) => handleChange('apiKey', e.target.value)}
              className="block w-full bg-slate-800 border border-slate-700/80 rounded-md py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-xs text-slate-200 font-mono"
            />
          </div>

          <div>
            <label htmlFor="permission-mode" className="block text-xs font-medium text-slate-400 mb-1">Permission Policy</label>
            <select
              id="permission-mode"
              value={draft.permissionMode}
              onChange={(e) => handleChange('permissionMode', e.target.value as PermissionMode)}
              className="block w-full bg-slate-800 border border-slate-700/80 rounded-md py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-xs text-slate-200"
            >
              <option value={PermissionMode.READ_ONLY}>{PermissionMode.READ_ONLY}</option>
              <option value={PermissionMode.READ_WRITE}>{PermissionMode.READ_WRITE}</option>
            </select>
          </div>
        </div>

        <button
          id="btn-save-sync-config"
          type="submit"
          className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-md text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 cursor-pointer transition-all active:scale-[0.99]"
        >
          Save Configuration
        </button>
      </form>
    </div>
  );
};

export default ConfigPanel;
