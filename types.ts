
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
  host: string;
  port: string;
  username?: string;
  password?: string;
  companyId: string;
  apiKey: string;
  syncInterval: number;
  autoSyncEnabled: boolean;
  permissionMode: PermissionMode;
  companyName: string;         // e.g. "Patel Export Services"
  financialYear: string;       // e.g. "2026-2027"
  autoRetryOnDrop?: boolean;   // Auto-retry mechanism for connection drops
  useTallyCloud?: boolean;     // Enable Tally Cloud integration mode
  tallyCloudUrl?: string;      // Tally Cloud endpoint/API URL
  tallyCloudApiKey?: string;   // Secret key to authenticate with Tally Cloud instance
  tallyCloudCompany?: string;  // Active company name on Tally Cloud
}

export interface Ledger {
  guid: string;
  name: string;
  group: string;
  balance: number;
  lastUpdated: string;
  // Expanded fields for Customer Profile 360 & MobileCRM:
  mobile?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  gstin?: string;
  pan?: string;
  creditLimit?: number;
  creditDays?: number;
  openingBalance?: number;
  contactPerson?: string;
  parentGroup?: string;
}

export interface Voucher {
  guid: string;
  type: 'Sales' | 'Receipt' | 'Payment' | 'Journal' | 'Credit Note' | 'Debit Note';
  date: string;
  party: string;
  amount: number;
  syncStatus: 'Synced' | 'Pending';
  narrations?: string;
  instrumentMode?: string;
}

export interface StockItem {
  guid: string;
  name: string;
  code?: string;
  sku?: string;
  category?: string;
  brand?: string;
  unit?: string;
  gstRate?: number;
  hsnCode?: string;
  openingStock?: number;
  closingStock: number;
  godown?: string;
  rate?: number;
}

export interface OutstandingBill {
  guid: string;
  customerGuid: string;
  customerName: string;
  invoiceNo: string;
  invoiceDate: string;
  dueDate: string;
  billAmount: number;
  receivedAmount: number;
  balanceAmount: number;
  overdueDays: number;
}

export interface CollectionRecord {
  id: string;
  date: string;
  customerGuid: string;
  customerName: string;
  amount: number;
  mode: 'Cash' | 'Cheque' | 'UPI' | 'Bank Transfer';
  referenceNo?: string;
  status: 'Pending Sync' | 'Synced to Tally' | 'Rejected';
  salesman?: string;
}
