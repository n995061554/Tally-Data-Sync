
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ConnectionStatus, SyncStatus, LogLevel, PermissionMode, type TallyConfig, type LogEntry, type Ledger, type Voucher } from '../types';
import StatusCard from './StatusCard';
import ConfigPanel from './ConfigPanel';
import SyncControls from './SyncControls';
import LogViewer from './LogViewer';
import CacheViewer from './CacheViewer';
import { PowerIcon, WifiIcon, CloudIcon, ArrowPathIcon } from './icons/Icons';

const MOCK_LEDGERS: Ledger[] = [
    { guid: 'uuid-ledger-1', name: 'Sales Account', group: 'Sales Accounts', balance: 150000, lastUpdated: '2023-10-27T10:00:00Z' },
    { guid: 'uuid-ledger-2', name: 'Purchase Account', group: 'Purchase Accounts', balance: -75000, lastUpdated: '2023-10-27T10:05:00Z' },
    { guid: 'uuid-ledger-3', name: 'Cash', group: 'Cash-in-Hand', balance: 25000, lastUpdated: '2023-10-27T11:20:00Z' },
    { guid: 'uuid-ledger-4', name: 'Alpha Traders', group: 'Sundry Debtors', balance: 12500, lastUpdated: '2023-10-26T15:10:00Z' },
];

const MOCK_VOUCHERS: Voucher[] = [
    { guid: 'uuid-voucher-1', type: 'Sales', date: '2023-10-27', party: 'Alpha Traders', amount: 5000, syncStatus: 'Synced' },
    { guid: 'uuid-voucher-2', type: 'Purchase', date: '2023-10-27', party: 'Supplier Inc', amount: 2500, syncStatus: 'Synced' },
    { guid: 'uuid-voucher-3', type: 'Receipt', date: '2023-10-27', party: 'Alpha Traders', amount: 2500, syncStatus: 'Pending' },
];

const Dashboard: React.FC = () => {
  const [tallyStatus, setTallyStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  const [cloudStatus, setCloudStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(SyncStatus.IDLE);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [config, setConfig] = useState<TallyConfig>({
    port: '9000',
    companyId: 'COMP-001-XYZ',
    apiKey: 'ABC-123-DEF-456',
    syncInterval: 5,
    permissionMode: PermissionMode.READ_ONLY,
  });

  const [ledgers, setLedgers] = useState<Ledger[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);

  const intervalRef = useRef<number | null>(null);

  const addLog = useCallback((level: LogLevel, message: string) => {
    const newLog: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
    };
    setLogs(prevLogs => [...prevLogs, newLog].slice(-100));
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
    addLog(LogLevel.WARN, 'Logs cleared by user.');
  }, [addLog]);

  const runSync = useCallback(async (isFullSync: boolean) => {
    if (syncStatus === SyncStatus.SYNCING) {
      addLog(LogLevel.WARN, 'Sync already in progress.');
      return;
    }

    setSyncStatus(SyncStatus.SYNCING);
    addLog(LogLevel.INFO, `Starting ${isFullSync ? 'full' : 'incremental'} sync...`);

    try {
      setTallyStatus(ConnectionStatus.CONNECTING);
      await new Promise(res => setTimeout(res, 500));
      if (Math.random() < 0.1) throw new Error("Tally connection failed: Port not open.");
      setTallyStatus(ConnectionStatus.CONNECTED);
      addLog(LogLevel.INFO, 'Connected to Tally on port ' + config.port);

      setCloudStatus(ConnectionStatus.CONNECTING);
      await new Promise(res => setTimeout(res, 500));
      if (Math.random() < 0.1) throw new Error("Cloud API authentication failed.");
      setCloudStatus(ConnectionStatus.CONNECTED);
      addLog(LogLevel.INFO, 'Authenticated with Cloud API.');

      addLog(LogLevel.INFO, 'Fetching data from Tally...');
      await new Promise(res => setTimeout(res, 1000));
      
      if (isFullSync) {
        setLedgers(MOCK_LEDGERS);
        addLog(LogLevel.INFO, `Fetched ${MOCK_LEDGERS.length} ledgers.`);
        await new Promise(res => setTimeout(res, 500));
      }
      
      const newVouchers = isFullSync ? MOCK_VOUCHERS : MOCK_VOUCHERS.filter(v => v.syncStatus === 'Pending');
      setVouchers(prev => isFullSync ? MOCK_VOUCHERS : [...prev.filter(v => v.syncStatus !== 'Pending'), ...newVouchers]);
      addLog(LogLevel.INFO, `Fetched ${newVouchers.length} vouchers.`);

      addLog(LogLevel.INFO, 'Encrypting and uploading data to cloud...');
      await new Promise(res => setTimeout(res, 1500));
      addLog(LogLevel.SUCCESS, 'Data securely uploaded.');

      const now = new Date();
      setLastSyncTime(now.toLocaleString());
      setSyncStatus(SyncStatus.SUCCESS);
      addLog(LogLevel.SUCCESS, `Sync completed successfully at ${now.toLocaleTimeString()}`);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setSyncStatus(SyncStatus.ERROR);
      setTallyStatus(ConnectionStatus.ERROR);
      setCloudStatus(ConnectionStatus.ERROR);
      addLog(LogLevel.ERROR, `Sync failed: ${errorMessage}`);
    } finally {
        setTimeout(() => {
            if (tallyStatus !== ConnectionStatus.ERROR) setTallyStatus(ConnectionStatus.CONNECTED);
            if (cloudStatus !== ConnectionStatus.ERROR) setCloudStatus(ConnectionStatus.CONNECTED);
        }, 3000)
    }
  }, [syncStatus, addLog, config.port, tallyStatus, cloudStatus]);


  useEffect(() => {
    addLog(LogLevel.INFO, 'Sync application initialized.');
    // Initial connection simulation
    setTimeout(() => setTallyStatus(ConnectionStatus.CONNECTED), 1000);
    setTimeout(() => setCloudStatus(ConnectionStatus.CONNECTED), 1500);

    return () => {
        if(intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    }
  }, [addLog]);

  useEffect(() => {
    if (intervalRef.current) {
        clearInterval(intervalRef.current);
    }
    intervalRef.current = window.setInterval(() => {
        runSync(false);
    }, config.syncInterval * 60 * 1000);

    addLog(LogLevel.INFO, `Auto-sync interval set to ${config.syncInterval} minutes.`);

    return () => {
        if(intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    }
  }, [config.syncInterval, runSync, addLog]);


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatusCard title="Tally Connection" status={tallyStatus} icon={<PowerIcon />} />
        <StatusCard title="Cloud Connection" status={cloudStatus} icon={<CloudIcon />} />
        <StatusCard title="Sync Status" status={syncStatus} icon={<ArrowPathIcon animate={syncStatus === SyncStatus.SYNCING} />} />
        <StatusCard 
            title="Last Sync Time" 
            status={lastSyncTime ? lastSyncTime : 'Never'} 
            icon={<WifiIcon />}
            isTime={true}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <ConfigPanel config={config} setConfig={setConfig} />
          <SyncControls onSync={runSync} isSyncing={syncStatus === SyncStatus.SYNCING} />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <LogViewer logs={logs} onClearLogs={clearLogs} />
        </div>
      </div>
       <CacheViewer ledgers={ledgers} vouchers={vouchers} />
    </div>
  );
};

export default Dashboard;