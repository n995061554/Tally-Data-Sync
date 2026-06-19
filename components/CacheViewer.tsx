import React, { useState, useMemo } from 'react';
import { type Ledger, type Voucher, type StockItem } from '../types';
import { Archive, Search, SlidersHorizontal, X } from 'lucide-react';

interface CacheViewerProps {
  ledgers: Ledger[];
  vouchers: Voucher[];
  stockItems: StockItem[];
}

type ActiveTab = 'ledgers' | 'vouchers' | 'stock';

const CacheViewer: React.FC<CacheViewerProps> = ({ ledgers, vouchers, stockItems }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('vouchers');

  // Search and Filter specific states
  const [searchQuery, setSearchQuery] = useState('');
  
  // Voucher filters
  const [voucherType, setVoucherType] = useState('All');
  const [voucherSync, setVoucherSync] = useState('All');

  // Ledger filters
  const [ledgerGroup, setLedgerGroup] = useState('All');
  const [ledgerBalanceRange, setLedgerBalanceRange] = useState('All'); // 'All' | 'Positive' | 'Negative' | 'Zero'

  // Stock filters
  const [stockBrand, setStockBrand] = useState('All');
  const [stockGodown, setStockGodown] = useState('All');

  // Extract unique filter populations
  const uniqueGroups = useMemo(() => {
    return Array.from(new Set(ledgers.map(l => l.group).filter(Boolean))).sort();
  }, [ledgers]);

  const uniqueBrands = useMemo(() => {
    return Array.from(new Set(stockItems.map(s => s.brand).filter(Boolean))).sort();
  }, [stockItems]);

  const uniqueGodowns = useMemo(() => {
    return Array.from(new Set(stockItems.map(s => s.godown).filter(Boolean))).sort();
  }, [stockItems]);

  // Tab Toggle & State Reset Handling
  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    setSearchQuery('');
    setVoucherType('All');
    setVoucherSync('All');
    setLedgerGroup('All');
    setLedgerBalanceRange('All');
    setStockBrand('All');
    setStockGodown('All');
  };

  // Filter application algorithms
  const filteredVouchers = useMemo(() => {
    return vouchers.filter((voucher) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = query === '' || 
        voucher.party.toLowerCase().includes(query) ||
        voucher.guid.toLowerCase().includes(query) ||
        (voucher.narrations && voucher.narrations.toLowerCase().includes(query)) ||
        voucher.date.toLowerCase().includes(query);

      const matchesType = voucherType === 'All' || voucher.type === voucherType;
      const matchesSync = voucherSync === 'All' || voucher.syncStatus === voucherSync;

      return matchesSearch && matchesType && matchesSync;
    });
  }, [vouchers, searchQuery, voucherType, voucherSync]);

  const filteredLedgers = useMemo(() => {
    return ledgers.filter((ledger) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = query === '' ||
        ledger.name.toLowerCase().includes(query) ||
        ledger.guid.toLowerCase().includes(query) ||
        ledger.group.toLowerCase().includes(query) ||
        (ledger.mobile && ledger.mobile.includes(query)) ||
        (ledger.contactPerson && ledger.contactPerson.toLowerCase().includes(query));

      const matchesGroup = ledgerGroup === 'All' || ledger.group === ledgerGroup;

      let matchesBalance = true;
      if (ledgerBalanceRange === 'Positive') {
        matchesBalance = ledger.balance > 0;
      } else if (ledgerBalanceRange === 'Negative') {
        matchesBalance = ledger.balance < 0;
      } else if (ledgerBalanceRange === 'Zero') {
        matchesBalance = ledger.balance === 0;
      }

      return matchesSearch && matchesGroup && matchesBalance;
    });
  }, [ledgers, searchQuery, ledgerGroup, ledgerBalanceRange]);

  const filteredStockItems = useMemo(() => {
    return stockItems.filter((item) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = query === '' ||
        item.name.toLowerCase().includes(query) ||
        item.guid.toLowerCase().includes(query) ||
        (item.sku && item.sku.toLowerCase().includes(query)) ||
        (item.code && item.code.toLowerCase().includes(query)) ||
        (item.brand && item.brand.toLowerCase().includes(query)) ||
        (item.godown && item.godown.toLowerCase().includes(query));

      const matchesBrand = stockBrand === 'All' || item.brand === stockBrand;
      const matchesGodown = stockGodown === 'All' || item.godown === stockGodown;

      return matchesSearch && matchesBrand && matchesGodown;
    });
  }, [stockItems, searchQuery, stockBrand, stockGodown]);

  const hasActiveFilters = searchQuery !== '' || 
    voucherType !== 'All' || 
    voucherSync !== 'All' || 
    ledgerGroup !== 'All' || 
    ledgerBalanceRange !== 'All' || 
    stockBrand !== 'All' || 
    stockGodown !== 'All';

  const resetFilters = () => {
    setSearchQuery('');
    setVoucherType('All');
    setVoucherSync('All');
    setLedgerGroup('All');
    setLedgerBalanceRange('All');
    setStockBrand('All');
    setStockGodown('All');
  };

  const renderLedgers = () => (
    <div className="overflow-x-auto rounded-lg border border-slate-700/50">
      <table className="min-w-full divide-y divide-slate-700">
        <thead className="bg-slate-800">
          <tr>
            <th scope="col" className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Name & Context</th>
            <th scope="col" className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Group Category</th>
            <th scope="col" className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">Mobile / Contact</th>
            <th scope="col" className="px-5 py-3 text-right text-[11px] font-bold text-slate-400 uppercase tracking-wider">Credit Limit</th>
            <th scope="col" className="px-5 py-3 text-right text-[11px] font-bold text-slate-400 uppercase tracking-wider animate-pulse">Balance (INR)</th>
          </tr>
        </thead>
        <tbody className="bg-slate-900/40 divide-y divide-slate-800/80">
          {filteredLedgers.map((ledger) => (
            <tr key={ledger.guid} className="hover:bg-slate-800/35 transition-colors">
              <td className="px-5 py-3.5 whitespace-nowrap text-xs text-left">
                <span className="font-bold text-slate-100 block">{ledger.name}</span>
                <span className="text-[10px] text-slate-500 font-mono">GUID: {ledger.guid}</span>
              </td>
              <td className="px-5 py-3.5 whitespace-nowrap text-xs text-left">
                <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-300 font-semibold border border-slate-700">{ledger.group}</span>
              </td>
              <td className="px-5 py-3.5 whitespace-nowrap text-xs text-left font-mono">
                <span className="text-slate-200 block">{ledger.mobile || 'N/A'}</span>
                <span className="text-[10px] text-slate-500">{ledger.contactPerson || ''}</span>
              </td>
              <td className="px-5 py-3.5 whitespace-nowrap text-xs text-right text-slate-300">
                {ledger.creditLimit ? `₹${ledger.creditLimit.toLocaleString()}` : 'Unlimited'}
              </td>
              <td className={`px-5 py-3.5 whitespace-nowrap text-xs font-bold text-right font-mono ${ledger.balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                ₹{ledger.balance.toLocaleString()}
              </td>
            </tr>
          ))}
          {filteredLedgers.length === 0 && (
            <tr>
              <td colSpan={5} className="py-8 text-center text-xs text-slate-500">
                {ledgers.length === 0
                  ? "No cached ledgers in memory. Change company config to pull datasets."
                  : "No Ledger records match the search filter terms."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderVouchers = () => (
     <div className="overflow-x-auto rounded-lg border border-slate-700/50">
      <table className="min-w-full divide-y divide-slate-700">
        <thead className="bg-slate-800">
          <tr>
            <th scope="col" className="px-5 py-2.5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Date & GUID</th>
            <th scope="col" className="px-5 py-2.5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Form Type</th>
            <th scope="col" className="px-5 py-2.5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Party ledger</th>
            <th scope="col" className="px-5 py-2.5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Narrations String</th>
            <th scope="col" className="px-5 py-2.5 text-right text-[11px] font-bold text-slate-400 uppercase tracking-wider">Amount Paid</th>
            <th scope="col" className="px-5 py-2.5 text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sync state</th>
          </tr>
        </thead>
        <tbody className="bg-slate-900/40 divide-y divide-slate-800/80">
          {filteredVouchers.map((voucher) => (
            <tr key={voucher.guid} className="hover:bg-slate-800/35 transition-colors">
              <td className="px-5 py-3 whitespace-nowrap text-xs text-left font-mono text-slate-400">
                <span className="text-slate-300 block">{voucher.date}</span>
                <span className="text-[9px] text-slate-500">GUID: {voucher.guid.slice(0, 14)}...</span>
              </td>
              <td className="px-5 py-3 whitespace-nowrap text-xs text-left">
                <span className={`px-2.5 py-0.5 inline-flex text-[10px] leading-5 font-bold rounded-full ${
                  voucher.type === 'Sales' 
                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/25' 
                    : voucher.type === 'Receipt' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                      : 'bg-rose-500/10 text-rose-450 text-rose-400 border border-rose-500/25'
                }`}>
                  {voucher.type}
                </span>
              </td>
              <td className="px-5 py-3 whitespace-nowrap text-xs text-left text-slate-200 font-semibold">{voucher.party}</td>
              <td className="px-5 py-3 text-xs text-left text-slate-400 max-w-xs truncate">{voucher.narrations || 'N/A'}</td>
              <td className="px-5 py-3 whitespace-nowrap text-xs text-right text-slate-200 font-bold font-mono">₹{voucher.amount.toLocaleString()}</td>
              <td className="px-5 py-3 whitespace-nowrap text-xs text-center">
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${voucher.syncStatus === 'Synced' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400 animate-pulse'}`}>
                  {voucher.syncStatus}
                </span>
              </td>
            </tr>
          ))}
          {filteredVouchers.length === 0 && (
            <tr>
              <td colSpan={6} className="py-8 text-center text-xs text-slate-500">
                {vouchers.length === 0
                  ? "No cached transactions. Ready for Tally sync triggers."
                  : "No Voucher records match the search filter terms."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderStockItems = () => (
    <div className="overflow-x-auto rounded-lg border border-slate-700/50">
      <table className="min-w-full divide-y divide-slate-700">
        <thead className="bg-slate-800">
          <tr>
            <th scope="col" className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Item Details & SKU</th>
            <th scope="col" className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Brand Name</th>
            <th scope="col" className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">HSN & GST</th>
            <th scope="col" className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Warehouse Location</th>
            <th scope="col" className="px-5 py-3 text-right text-[11px] font-bold text-slate-400 uppercase tracking-wider">Rate</th>
            <th scope="col" className="px-5 py-3 text-right text-[11px] font-bold text-slate-400 uppercase tracking-wider">Closing Stock</th>
            <th scope="col" className="px-5 py-3 text-right text-[11px] font-bold text-slate-400 uppercase tracking-wider">Valuation</th>
          </tr>
        </thead>
        <tbody className="bg-slate-900/40 divide-y divide-slate-800/80">
          {filteredStockItems.map((item) => (
            <tr key={item.guid} className="hover:bg-slate-800/35 transition-colors">
              <td className="px-5 py-3.5 whitespace-nowrap text-xs text-left">
                <span className="font-bold text-slate-100 block">{item.name}</span>
                <span className="text-[10px] text-slate-500 font-mono">SKU: {item.sku} | code: {item.code}</span>
              </td>
              <td className="px-5 py-3.5 whitespace-nowrap text-xs text-left text-slate-300">{item.brand}</td>
              <td className="px-5 py-3.5 whitespace-nowrap text-xs text-left">
                <span className="text-slate-300 block font-mono">HSN: {item.hsnCode}</span>
                <span className="text-[10px] text-emerald-400 font-bold">GST {item.gstRate}%</span>
              </td>
              <td className="px-5 py-3.5 whitespace-nowrap text-xs text-left">
                <span className="text-slate-400 italic text-[11px]">{item.godown}</span>
              </td>
              <td className="px-5 py-3.5 whitespace-nowrap text-xs text-right font-mono text-slate-300">₹{item.rate ? item.rate.toLocaleString() : 0}</td>
              <td className="px-5 py-3.5 whitespace-nowrap text-xs text-right font-bold text-slate-100 font-mono">
                {item.closingStock} <span className="text-[10px] font-normal text-slate-400">{item.unit}</span>
              </td>
              <td className="px-5 py-3.5 whitespace-nowrap text-xs text-right font-bold text-emerald-400 font-mono">
                ₹{((item.closingStock || 0) * (item.rate || 0)).toLocaleString()}
              </td>
            </tr>
          ))}
          {filteredStockItems.length === 0 && (
            <tr>
              <td colSpan={7} className="py-8 text-center text-xs text-slate-500">
                {stockItems.length === 0
                  ? "No stock listing records cached in ODBC session."
                  : "No Inventory records match the search filter terms."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-700/50 shadow-lg space-y-5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center">
          <Archive className="h-5 w-5 mr-3 text-slate-400 animate-pulse" />
          <div>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">ODBC Sync Buffer Explorer (Local Cache)</h3>
            <p className="text-xs text-slate-400 text-[11px]">Inspect the raw tabular data pulled down via the local sync client</p>
          </div>
        </div>
        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700 font-mono">
          Memory Buffers Read
        </span>
      </div>

      <div>
        <div className="border-b border-slate-800">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            <button
              onClick={() => handleTabChange('vouchers')}
              className={`${activeTab === 'vouchers' ? 'border-emerald-500 text-emerald-400 font-bold' : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-500'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-xs uppercase tracking-wider cursor-pointer`}
            >
              Vouchers Cashbook ({vouchers.length})
            </button>
            <button
              onClick={() => handleTabChange('ledgers')}
              className={`${activeTab === 'ledgers' ? 'border-emerald-500 text-emerald-400 font-bold' : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-500'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-xs uppercase tracking-wider cursor-pointer`}
            >
              Ledgers Directory ({ledgers.length})
            </button>
            <button
              onClick={() => handleTabChange('stock')}
              className={`${activeTab === 'stock' ? 'border-emerald-500 text-emerald-400 font-bold' : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-500'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-xs uppercase tracking-wider cursor-pointer`}
            >
              Inventory Catalog ({stockItems.length})
            </button>
          </nav>
        </div>

        {/* Real-time search/filters console widget */}
        <div className="mt-4 flex flex-col md:flex-row gap-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder={`Search ${activeTab === 'vouchers' ? 'vouchers by party, narration, date...' : activeTab === 'ledgers' ? 'ledgers by name, group, GUID, contact...' : 'inventory by name, SKU, brand, godown...'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/60 border border-slate-800 focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/30 text-xs text-slate-200 placeholder-slate-500 rounded-lg pl-9 pr-8 py-2 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 hover:text-slate-200 text-slate-500 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {activeTab === 'vouchers' && (
              <>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] text-slate-500 font-mono font-semibold uppercase">Type:</span>
                  <select
                    value={voucherType}
                    onChange={(e) => setVoucherType(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-2 py-1.5 outline-none focus:border-emerald-500/50 cursor-pointer"
                  >
                    <option value="All">All Types</option>
                    <option value="Sales">Sales</option>
                    <option value="Receipt">Receipt</option>
                    <option value="Payment">Payment</option>
                    <option value="Journal">Journal</option>
                    <option value="Credit Note">Credit Note</option>
                    <option value="Debit Note">Debit Note</option>
                  </select>
                </div>

                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] text-slate-500 font-mono font-semibold uppercase">Sync:</span>
                  <select
                    value={voucherSync}
                    onChange={(e) => setVoucherSync(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-2 py-1.5 outline-none focus:border-emerald-500/50 cursor-pointer"
                  >
                    <option value="All">All States</option>
                    <option value="Synced">Synced</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </>
            )}

            {activeTab === 'ledgers' && (
              <>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] text-slate-500 font-mono font-semibold uppercase">Group:</span>
                  <select
                    value={ledgerGroup}
                    onChange={(e) => setLedgerGroup(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-2 py-1.5 outline-none focus:border-emerald-500/50 max-w-[130px] truncate cursor-pointer"
                  >
                    <option value="All">All Groups</option>
                    {uniqueGroups.map(grp => (
                      <option key={grp} value={grp}>{grp}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] text-slate-500 font-mono font-semibold uppercase">Balance:</span>
                  <select
                    value={ledgerBalanceRange}
                    onChange={(e) => setLedgerBalanceRange(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-2 py-1.5 outline-none focus:border-emerald-500/50 cursor-pointer"
                  >
                    <option value="All">All Balances</option>
                    <option value="Positive">Debtor (&gt; 0)</option>
                    <option value="Negative">Creditor (&lt; 0)</option>
                    <option value="Zero">Zero (= 0)</option>
                  </select>
                </div>
              </>
            )}

            {activeTab === 'stock' && (
              <>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] text-slate-500 font-mono font-semibold uppercase">Brand:</span>
                  <select
                    value={stockBrand}
                    onChange={(e) => setStockBrand(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-2 py-1.5 outline-none focus:border-emerald-500/50 max-w-[130px] truncate cursor-pointer"
                  >
                    <option value="All">All Brands</option>
                    {uniqueBrands.map(br => (
                      <option key={br} value={br}>{br}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] text-slate-500 font-mono font-semibold uppercase">Warehouse:</span>
                  <select
                    value={stockGodown}
                    onChange={(e) => setStockGodown(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-2 py-1.5 outline-none focus:border-emerald-500/50 max-w-[130px] truncate cursor-pointer"
                  >
                    <option value="All">All Godowns</option>
                    {uniqueGodowns.map(gd => (
                      <option key={gd} value={gd}>{gd}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded px-2 py-1 flex-shrink-0 font-bold hover:bg-emerald-500/15 cursor-pointer font-bold active:scale-95 transition-all"
              >
                <SlidersHorizontal className="h-3 w-3 mr-1" />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Filter matches stats feed */}
        {hasActiveFilters && (
          <div className="text-[10px] font-mono text-slate-400 mt-2 px-1 flex items-center justify-between">
            <span>
              Matches: <strong className="text-emerald-400">{
                activeTab === 'vouchers' ? filteredVouchers.length : activeTab === 'ledgers' ? filteredLedgers.length : filteredStockItems.length
              }</strong> of <strong className="text-slate-300">{
                activeTab === 'vouchers' ? vouchers.length : activeTab === 'ledgers' ? ledgers.length : stockItems.length
              }</strong> cached records.
            </span>
          </div>
        )}

        <div className="mt-4">
          {activeTab === 'ledgers' && renderLedgers()}
          {activeTab === 'vouchers' && renderVouchers()}
          {activeTab === 'stock' && renderStockItems()}
        </div>
      </div>
    </div>
  );
};

export default CacheViewer;
