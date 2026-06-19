import React, { useState, useEffect } from 'react';
import { type Ledger, type Voucher, LogLevel } from '../types';
import { 
  PlusCircle, 
  Smartphone, 
  Database, 
  CheckSquare, 
  RotateCw, 
  Trash2,
  Receipt
} from 'lucide-react';

interface OfflineCollectionsProps {
  ledgers: Ledger[];
  addLog: (level: LogLevel, message: string) => void;
  onReceiptSyncedToTally: (newReceipt: Voucher) => void;
}

interface OfflineReceipt {
  id: string;
  customerName: string;
  amount: number;
  mode: string;
  date: string;
  comments: string;
}

const OfflineCollections: React.FC<OfflineCollectionsProps> = ({
  ledgers,
  addLog,
  onReceiptSyncedToTally,
}) => {
  const debtors = ledgers.filter(l => l.group === 'Sundry Debtors');
  
  const [customerName, setCustomerName] = useState('');
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState('UPI');
  const [comments, setComments] = useState('');
  const [queue, setQueue] = useState<OfflineReceipt[]>([]);
  const [syncing, setSyncing] = useState(false);

  // Load offline queue on mount
  useEffect(() => {
    const cached = localStorage.getItem('mobile_collections_queue');
    if (cached) {
      try {
        setQueue(JSON.parse(cached));
      } catch (err) {
        console.error('Failed to parse cached queue', err);
      }
    }
  }, []);

  const saveQueue = (newQueue: OfflineReceipt[]) => {
    setQueue(newQueue);
    localStorage.setItem('mobile_collections_queue', JSON.stringify(newQueue));
  };

  const handleAddReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName) {
      addLog(LogLevel.ERROR, 'Failed to add collection: Please choose a customer.');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      addLog(LogLevel.ERROR, 'Failed to add collection: Amount must be greater than 0.');
      return;
    }

    const newReceipt: OfflineReceipt = {
      id: `off-rec-${Date.now()}`,
      customerName,
      amount: parseFloat(amount),
      mode,
      date: new Date().toISOString().split('T')[0],
      comments: comments || 'Payment received on field visit by Salesman',
    };

    const updated = [newReceipt, ...queue];
    saveQueue(updated);
    addLog(LogLevel.INFO, `Saved Field Receipt in Mobile Storage. Customer: ${customerName} | ₹${newReceipt.amount}`);

    // Reset Form
    setCustomerName('');
    setAmount('');
    setComments('');
  };

  const handleDeleteReceipt = (id: string) => {
    const updated = queue.filter(r => r.id !== id);
    saveQueue(updated);
    addLog(LogLevel.WARN, 'Removed offline collection record from mobile sync queue.');
  };

  const handleSyncQueue = () => {
    if (queue.length === 0) {
      addLog(LogLevel.WARN, 'Tally sync queue is empty. Ready for new field measurements.');
      return;
    }

    setSyncing(true);
    addLog(LogLevel.INFO, `Starting Tally ERP Sync. Pushing ${queue.length} collection vouchers...`);

    setTimeout(() => {
      // Simulate pushing to Tally ODBC engine and converting them into official Voucher records
      queue.forEach((r, idx) => {
        const officialVoucher: Voucher = {
          guid: `v-rct-tally-${Date.now()}-${idx}`,
          type: 'Receipt',
          date: r.date,
          party: r.customerName,
          amount: r.amount,
          syncStatus: 'Synced',
          narrations: `${r.comments} [Synced to Tally ERP Gtw]`,
          instrumentMode: r.mode,
        };
        onReceiptSyncedToTally(officialVoucher);
        addLog(
          LogLevel.SUCCESS, 
          `[TallyPrime ODBC Engine] SUCCESSFULLY generated official Receipt Voucher No. RCT-2026-${1042 + idx} for '${r.customerName}' of ₹${r.amount.toLocaleString()}.`
        );
      });

      // Clear sync queue
      saveQueue([]);
      setSyncing(false);
      addLog(LogLevel.SUCCESS, `Bi-Directional Database push finished. Mobile apps data in perfect union with Tally ERP.`);
    }, 1800);
  };

  return (
    <div className="bg-slate-900/60 rounded-xl border border-slate-700/50 p-6 space-y-6 shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-700 pb-3 gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-emerald-400" /> Sales Representative Recovery Box
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Collect ledger payments in field, save offline, push to Tally as official Receipt Vouchers</p>
        </div>
        <span className="text-[10px] bg-slate-800 border border-slate-700 px-2 py-0.5 font-mono text-slate-400 rounded">
          Bi-Directional Sync Gate
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Create Field Receipt Form */}
        <form onSubmit={handleAddReceipt} className="lg:col-span-4 bg-slate-800/20 p-4 border border-slate-700/30 rounded-lg space-y-3.5">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest border-b border-slate-700/40 pb-2 flex items-center gap-1.5">
            <PlusCircle className="h-4 w-4 text-emerald-400" /> Field Receipt Entry
          </h4>

          <div>
            <label htmlFor="field-customer-select" className="block text-[11px] font-medium text-slate-400 mb-1">Customer / Ledger</label>
            <select
              id="field-customer-select"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="block w-full bg-slate-800 border border-slate-700 rounded-md py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs text-slate-200"
            >
              <option value="">-- Choose Debtor --</option>
              {debtors.map(d => (
                <option key={d.guid} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="field-amount-input" className="block text-[11px] font-medium text-slate-400 mb-1">Amount (INR)</label>
              <input
                id="field-amount-input"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="₹ Amount"
                className="block w-full bg-slate-800 border border-slate-700 rounded-md py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs text-slate-200"
              />
            </div>
            <div>
              <label htmlFor="field-mode-select" className="block text-[11px] font-medium text-slate-400 mb-1">Receipt Mode</label>
              <select
                id="field-mode-select"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="block w-full bg-slate-800 border border-slate-700 rounded-md py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs text-slate-200"
              >
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
                <option value="Cash">Cash-in-hand</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="field-comments-input" className="block text-[11px] font-medium text-slate-400 mb-1">Collector Comments</label>
            <textarea
              id="field-comments-input"
              rows={2}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="e.g. Received parts payout, check given..."
              className="block w-full bg-slate-800 border border-slate-700 rounded-md py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs text-slate-200 resize-none font-sans"
            />
          </div>

          <button
            id="btn-add-to-mobile-queue"
            type="submit"
            className="w-full flex justify-center items-center py-2 px-3 border border-transparent rounded-md text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 cursor-pointer uppercase tracking-wider transition-all"
          >
            Add To Sync Queue
          </button>
        </form>

        {/* View Mobile Queue */}
        <div className="lg:col-span-8 bg-slate-800/20 p-4 border border-slate-700/30 rounded-lg flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-slate-700/40 pb-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                <Database className="h-4 w-4 text-emerald-400" /> Pending Collection Queues ({queue.length})
              </h4>
              <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-mono font-bold animate-pulse">
                Offline Cache
              </span>
            </div>

            <div className="overflow-y-auto max-h-[175px] space-y-2 pr-1 custom-scrollbar">
              {queue.map(item => (
                <div key={item.id} className="p-3 bg-slate-900/60 rounded border border-slate-800 flex justify-between items-center text-xs">
                  <div className="space-y-0.5 text-left">
                    <span className="font-bold text-slate-200 block">{item.customerName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Mode: <span className="text-slate-300 font-semibold">{item.mode}</span> | Date: {item.date}
                    </span>
                    <p className="text-[10px] text-slate-500 italic max-w-[310px] truncate">"{item.comments}"</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="font-bold text-emerald-400 block">₹{item.amount.toLocaleString()}</span>
                      <span className="text-[9px] text-amber-400 font-bold font-mono">WAITING SYNC</span>
                    </div>
                    <button
                      id={`btn-del-off-${item.id}`}
                      type="button"
                      onClick={() => handleDeleteReceipt(item.id)}
                      className="p-1 px-1.5 bg-rose-500/10 text-rose-400 rounded hover:bg-rose-500/20 cursor-pointer"
                      title="Delete entry"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {queue.length === 0 && (
                <div className="text-center py-10 text-slate-500 space-y-1">
                  <Receipt className="h-10 w-10 text-slate-600 mx-auto" />
                  <p className="text-xs">No pending collections in queue. Field agents are idle.</p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700/40 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-[11px] text-slate-400 max-w-sm text-left">
              These payment sheets will be directly converted into official <strong className="text-emerald-400">Receipt Vouchers</strong> inside the Tally Prime company books, adjusting their Sundry Debtor balances instantaneously.
            </p>
            <button
              id="btn-sync-mobile-records-now"
              type="button"
              disabled={syncing || queue.length === 0}
              onClick={handleSyncQueue}
              className={`flex items-center gap-2 py-2 px-4 rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                queue.length === 0 
                  ? 'bg-slate-800 text-slate-500 border border-slate-700/40 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md transform hover:-translate-y-0.5'
              }`}
            >
              <RotateCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Generating Vouchers...' : 'POST to Tally Prime'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflineCollections;
