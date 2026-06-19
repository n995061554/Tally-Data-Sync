import React from 'react';
import { type Ledger, type Voucher, type StockItem, type OutstandingBill } from '../types';
import { 
  TrendingUp, 
  DollarSign, 
  AlertTriangle, 
  Clock, 
  ShoppingBag, 
  Users, 
  ArrowUpRight 
} from 'lucide-react';

interface SalesRecoveryDashboardProps {
  companyName: string;
  financialYear: string;
  ledgers: Ledger[];
  vouchers: Voucher[];
  stockItems: StockItem[];
  outstandings: OutstandingBill[];
}

const SalesRecoveryDashboard: React.FC<SalesRecoveryDashboardProps> = ({
  companyName,
  financialYear,
  ledgers,
  vouchers,
  stockItems,
  outstandings,
}) => {
  // 1. Calculations based on active company dataset
  const totalSalesThisMonth = vouchers
    .filter(v => v.type === 'Sales')
    .reduce((sum, v) => sum + v.amount, 0);

  const totalOutstanding = outstandings.reduce((sum, b) => sum + b.balanceAmount, 0);

  const collectionThisMonth = vouchers
    .filter(v => v.type === 'Receipt')
    .reduce((sum, v) => sum + v.amount, 0);

  const activeCustomersCount = ledgers.filter(l => l.group === 'Sundry Debtors').length;

  // 2. Aging Analysis buckets calculation
  let age0_30 = 0;
  let age31_60 = 0;
  let age61_90 = 0;
  let age90plus = 0;

  outstandings.forEach(bill => {
    if (bill.overdueDays <= 30) {
      age0_30 += bill.balanceAmount;
    } else if (bill.overdueDays <= 60) {
      age31_60 += bill.balanceAmount;
    } else if (bill.overdueDays <= 90) {
      age61_90 += bill.balanceAmount;
    } else {
      age90plus += bill.balanceAmount;
    }
  });

  const totalAgedAmount = age0_30 + age31_60 + age61_90 + age90plus;

  // Percentages for progress bar display
  const pct0_30 = totalAgedAmount ? (age0_30 / totalAgedAmount) * 100 : 0;
  const pct31_60 = totalAgedAmount ? (age31_60 / totalAgedAmount) * 100 : 0;
  const pct61_90 = totalAgedAmount ? (age61_90 / totalAgedAmount) * 100 : 0;
  const pct90plus = totalAgedAmount ? (age90plus / totalAgedAmount) * 100 : 0;

  // 3. Top Debtors (Recovery Priority)
  const topDebtors = [...outstandings]
    .slice()
    .sort((a, b) => b.balanceAmount - a.balanceAmount)
    .slice(0, 3);

  // 4. Top Stock Items by Valuation
  const topStockValuedValue = [...stockItems]
    .map(item => ({
      ...item,
      totalVal: (item.closingStock || 0) * (item.rate || 0),
    }))
    .sort((a, b) => b.totalVal - a.totalVal)
    .slice(0, 3);

  return (
    <div className="bg-slate-900/60 rounded-xl border border-slate-700/50 p-6 space-y-6 shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-700 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span className="p-1 px-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-sm tracking-wider font-mono uppercase">Live Tally Data Node</span>
            {companyName}
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">Financial Year Period: <span className="text-emerald-400">{financialYear}</span></p>
        </div>
        <div className="mt-2 sm:mt-0 px-3 py-1 bg-slate-800 text-slate-400 text-xs font-semibold rounded-full border border-slate-700 font-mono">
          Ready for Mobile App API sync
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div id="kpi-sales" className="bg-slate-800/40 p-4 border border-slate-700/40 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold">Today/Month Sales</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-xl font-bold text-slate-100">₹{totalSalesThisMonth.toLocaleString()}</p>
          <div className="text-[10px] text-emerald-400 font-medium">Synced Invoices</div>
        </div>

        <div id="kpi-outstanding" className="bg-slate-800/40 p-4 border border-slate-700/40 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold">Total Outstanding Book</span>
            <AlertTriangle className="h-4 w-4 text-rose-400" />
          </div>
          <p className="text-xl font-bold text-slate-100 text-rose-200">₹{totalOutstanding.toLocaleString()}</p>
          <div className="text-[10px] text-rose-400 font-medium font-mono">{activeCustomersCount} Sundry Debtors Accounts</div>
        </div>

        <div id="kpi-collections" className="bg-slate-800/40 p-4 border border-slate-700/40 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold">Collection This Month</span>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-xl font-bold text-slate-100">₹{collectionThisMonth.toLocaleString()}</p>
          <div className="text-[10px] text-emerald-500 font-medium">Receipt Vouchers Created</div>
        </div>

        <div id="kpi-accounts" className="bg-slate-800/40 p-4 border border-slate-700/40 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold">Active Customers</span>
            <Users className="h-4 w-4 text-cyan-400" />
          </div>
          <p className="text-xl font-bold text-slate-100">{activeCustomersCount}</p>
          <div className="text-[10px] text-cyan-400 font-medium">Mapped Ledger GUIDs</div>
        </div>
      </div>

      {/* Aging Analysis and Lists Stack */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Aging Panel */}
        <div className="bg-slate-800/20 p-5 rounded-xl border border-slate-700/35 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700/50 pb-2.5">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-400" /> Active Aging Analysis (Most Demanded)
            </h3>
            <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded font-mono">Real-time Clock</span>
          </div>

          <div className="space-y-3.5 pt-2">
            {/* 0-30 Days */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">0–30 Days (Standard Clearance)</span>
                <span className="font-bold text-emerald-400">₹{age0_30.toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div style={{ width: `${pct0_30}%` }} className="bg-emerald-500 h-full rounded-full transition-all" />
              </div>
            </div>

            {/* 31-60 Days */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">31–60 Days (Follow-up Stage)</span>
                <span className="font-bold text-teal-400">₹{age31_60.toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div style={{ width: `${pct31_60}%` }} className="bg-teal-500 h-full rounded-full transition-all" />
              </div>
            </div>

            {/* 61-90 Days */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">61–90 Days (Credit Lock Warning)</span>
                <span className="font-bold text-amber-400">₹{age61_90.toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div style={{ width: `${pct61_90}%` }} className="bg-amber-500 h-full rounded-full transition-all" />
              </div>
            </div>

            {/* 90+ Days */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">90+ Days (Legal & Recovery Pipeline)</span>
                <span className="font-bold text-rose-500">₹{age90plus.toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div style={{ width: `${pct90plus}%` }} className="bg-rose-500 h-full rounded-full transition-all animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Priority Recovery Panel */}
        <div className="bg-slate-800/20 p-5 rounded-xl border border-slate-700/35 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700/50 pb-2.5">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-400" /> Recovery & Collector Focus Lists
            </h3>
            <span className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-1.5 py-0.5 rounded font-mono">High Overdue</span>
          </div>

          <div className="space-y-3">
            {topDebtors.map(item => (
              <div key={item.guid} className="flex justify-between items-center p-2 bg-slate-900/30 rounded border border-slate-700/20 text-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-200">{item.customerName}</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Inv: <span className="text-slate-300">{item.invoiceNo}</span> | Overdue: <span className="text-rose-400 font-semibold">{item.overdueDays} Days</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-rose-300">₹{item.balanceAmount.toLocaleString()}</div>
                  <div className="text-[9px] text-slate-500">of ₹{item.billAmount.toLocaleString()}</div>
                </div>
              </div>
            ))}
            {topDebtors.length === 0 && (
              <p className="text-slate-500 text-xs py-3 text-center">No outstanding balance logged for this company.</p>
            )}
          </div>
        </div>
      </div>

      {/* Stock catalog visibility list */}
      <div className="bg-slate-800/15 p-4 rounded-xl border border-slate-700/20">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <ShoppingBag className="h-4 w-4 text-emerald-400" /> Stock Listing Value (Product Catalog for Mobile)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {topStockValuedValue.map(item => (
            <div key={item.guid} className="p-3 bg-slate-900/40 rounded-lg border border-slate-700/40 space-y-1.5">
              <div className="flex justify-between items-start">
                <span className="font-semibold text-slate-200 text-xs truncate max-w-[150px]">{item.name}</span>
                <span className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 text-slate-400 rounded">{item.unit}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-450 text-slate-400">Qty: <span className="text-slate-200 font-bold">{item.closingStock}</span></span>
                <span className="text-emerald-400 font-bold">₹{(item.rate || 0).toLocaleString()}/rate</span>
              </div>
              <div className="border-t border-slate-800 pt-1.5 text-right">
                <span className="text-[10px] text-slate-400">Valuation: </span>
                <span className="text-xs font-bold text-emerald-400 font-mono">₹{((item.closingStock || 0) * (item.rate || 0)).toLocaleString()}</span>
              </div>
            </div>
          ))}
          {topStockValuedValue.length === 0 && (
            <p className="text-slate-500 text-xs p-2 col-span-3 text-center">No catalog items synchronized.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesRecoveryDashboard;
