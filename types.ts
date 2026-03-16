
export enum ConnectionStatus {
  CONNECTED = 'Connected',
  DISCONNECTED = 'Disconnected',
  CONNECTING = 'Connecting',
  ERROR = 'Error',
}

export enum SyncStatus {
  IDLE = 'Idle',
  SYNCING = 'Syncing',
  SUCCESS = 'Success',
  ERROR = 'Error',
}

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
}

export enum PermissionMode {
  READ_ONLY = 'Read Only',
  READ_WRITE = 'Read + Write',
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
}

export interface TallyConfig {
  port: string;
  companyId: string;
  apiKey: string;
  syncInterval: number;
  permissionMode: PermissionMode;
}

export interface Ledger {
  guid: string;
  name: string;
  group: string;
  balance: number;
  lastUpdated: string;
}

export interface Voucher {
  guid: string;
  type: string;
  date: string;
  party: string;
  amount: number;
  syncStatus: 'Synced' | 'Pending';
}
