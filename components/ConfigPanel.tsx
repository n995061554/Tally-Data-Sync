
import React from 'react';
import { type TallyConfig, PermissionMode } from '../types';
import { CogIcon } from './icons/Icons';

interface ConfigPanelProps {
  config: TallyConfig;
  setConfig: React.Dispatch<React.SetStateAction<TallyConfig>>;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, setConfig }) => {
  const handleChange = <K extends keyof TallyConfig>(key: K, value: TallyConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700/50 shadow-md">
      <div className="flex items-center mb-4">
        <CogIcon className="h-6 w-6 mr-3 text-slate-400" />
        <h3 className="text-lg font-semibold text-slate-200">Configuration</h3>
      </div>
      <div className="space-y-4">
        <div>
          <label htmlFor="tally-port" className="block text-sm font-medium text-slate-400">Tally Port</label>
          <input
            id="tally-port"
            type="text"
            value={config.port}
            onChange={(e) => handleChange('port', e.target.value)}
            className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm text-slate-200"
          />
        </div>
        <div>
          <label htmlFor="company-id" className="block text-sm font-medium text-slate-400">Company ID</label>
          <input
            id="company-id"
            type="text"
            value={config.companyId}
            onChange={(e) => handleChange('companyId', e.target.value)}
            className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm text-slate-200"
          />
        </div>
         <div>
          <label htmlFor="api-key" className="block text-sm font-medium text-slate-400">API Key</label>
          <input
            id="api-key"
            type="password"
            value={config.apiKey}
            onChange={(e) => handleChange('apiKey', e.target.value)}
            className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm text-slate-200"
          />
        </div>
        <div>
          <label htmlFor="sync-interval" className="block text-sm font-medium text-slate-400">Sync Interval (minutes)</label>
          <input
            id="sync-interval"
            type="number"
            min="1"
            value={config.syncInterval}
            onChange={(e) => handleChange('syncInterval', parseInt(e.target.value, 10))}
            className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm text-slate-200"
          />
        </div>
         <div>
          <label htmlFor="permission-mode" className="block text-sm font-medium text-slate-400">Permission Mode</label>
            <select
                id="permission-mode"
                value={config.permissionMode}
                onChange={(e) => handleChange('permissionMode', e.target.value as PermissionMode)}
                className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm text-slate-200"
            >
                <option>{PermissionMode.READ_ONLY}</option>
                <option>{PermissionMode.READ_WRITE}</option>
            </select>
        </div>
      </div>
    </div>
  );
};

export default ConfigPanel;
