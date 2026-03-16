
import React, { useState } from 'react';
import { type Ledger, type Voucher } from '../types';
import { ArchiveBoxIcon } from './icons/Icons';

interface CacheViewerProps {
  ledgers: Ledger[];
  vouchers: Voucher[];
}

type ActiveTab = 'ledgers' | 'vouchers';

const CacheViewer: React.FC<CacheViewerProps> = ({ ledgers, vouchers }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('vouchers');

  const renderLedgers = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-700">
        <thead className="bg-slate-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Group</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Balance</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Last Updated</th>
          </tr>
        </thead>
        <tbody className="bg-slate-800/50 divide-y divide-slate-700/50">
          {ledgers.map((ledger) => (
            <tr key={ledger.guid}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-200">{ledger.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{ledger.group}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${ledger.balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{ledger.balance.toLocaleString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{new Date(ledger.lastUpdated).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderVouchers = () => (
     <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-700">
        <thead className="bg-slate-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Type</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Party</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Amount</th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="bg-slate-800/50 divide-y divide-slate-700/50">
          {vouchers.map((voucher) => (
            <tr key={voucher.guid}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{voucher.date}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-200">{voucher.type}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{voucher.party}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-200">{voucher.amount.toLocaleString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${voucher.syncStatus === 'Synced' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    {voucher.syncStatus}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700/50 shadow-md">
       <div className="flex items-center mb-4">
        <ArchiveBoxIcon className="h-6 w-6 mr-3 text-slate-400" />
        <h3 className="text-lg font-semibold text-slate-200">Local Cache Data</h3>
      </div>
      <div>
        <div className="border-b border-slate-700">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('vouchers')}
              className={`${activeTab === 'vouchers' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Vouchers
            </button>
            <button
              onClick={() => setActiveTab('ledgers')}
              className={`${activeTab === 'ledgers' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Ledgers
            </button>
          </nav>
        </div>
        <div className="mt-4">
          {activeTab === 'ledgers' ? renderLedgers() : renderVouchers()}
        </div>
      </div>
    </div>
  );
};

export default CacheViewer;
