import React, { useState } from 'react';
import { type Ledger, type Voucher, type StockItem, type OutstandingBill } from '../types';
import { Code2, Copy, Check, FileJson, Server } from 'lucide-react';

interface MobilePayloadExplorerProps {
  ledgers: Ledger[];
  vouchers: Voucher[];
  stockItems: StockItem[];
  outstandings: OutstandingBill[];
  companyName: string;
}

const MobilePayloadExplorer: React.FC<MobilePayloadExplorerProps> = ({
  ledgers,
  vouchers,
  stockItems,
  outstandings,
  companyName,
}) => {
  const [activeTab, setActiveTab] = useState<'ledgers' | 'aging' | 'stock' | 'vouchers'>('ledgers');
  const [copied, setCopied] = useState(false);

  // Generate clean mobile developer payloads
  const payloads = {
    ledgers: {
      status: 'success',
      endpoint: '/api/v1/masters/ledgers',
      timestamp: new Date().toISOString(),
      company: companyName,
      recordsCount: ledgers.length,
      data: ledgers.map(l => ({
        guid: l.guid,
        ledgerName: l.name,
        contactName: l.contactPerson || 'N/A',
        mobilePhone: l.mobile || '',
        emailAddress: l.email || '',
        postalAddress: {
          street: l.address || '',
          city: l.city || '',
          state: l.state || '',
        },
        taxCompliance: {
          gstin: l.gstin || '',
          pan: l.pan || '',
        },
        creditControl: {
          daysAllowed: l.creditDays || 30,
          limitRupees: l.creditLimit || 0,
        },
        balanceRupees: l.balance,
      })),
    },
    aging: {
      status: 'success',
      endpoint: '/api/v1/reports/outstanding-aging',
      timestamp: new Date().toISOString(),
      company: companyName,
      totalBillsCount: outstandings.length,
      data: outstandings.map(o => ({
        billId: o.guid,
        associatedCustomerGuid: o.customerGuid,
        associatedCustomerName: o.customerName,
        invoiceNumber: o.invoiceNo,
        invoiceDateStr: o.invoiceDate,
        paymentDueDateStr: o.dueDate,
        grandTotalRupees: o.billAmount,
        collectedRupees: o.receivedAmount,
        netReceivableRupees: o.balanceAmount,
        overdueCountDays: o.overdueDays,
        urgencyColor: o.overdueDays > 60 ? 'CRITICAL_RED' : o.overdueDays > 0 ? 'WARNING_AMBER' : 'STANDARD_CLEAR',
      })),
    },
    stock: {
      status: 'success',
      endpoint: '/api/v1/inventory/stock-summary',
      timestamp: new Date().toISOString(),
      company: companyName,
      itemsCount: stockItems.length,
      data: stockItems.map(s => ({
        itemId: s.guid,
        itemNameString: s.name,
        aliasCode: s.code,
        barcodeSku: s.sku,
        classificationGroup: s.category,
        manufacturerBrand: s.brand,
        unitOfMeasure: s.unit,
        taxPercentGst: s.gstRate,
        hsnTariffCode: s.hsnCode,
        currentInStock: s.closingStock,
        unitPriceRateRupees: s.rate,
        allocatedGodown: s.godown,
      })),
    },
    vouchers: {
      status: 'success',
      endpoint: '/api/v1/transactions/vouchers',
      timestamp: new Date().toISOString(),
      company: companyName,
      totalVouchersSynced: vouchers.length,
      data: vouchers.map(v => ({
        transactionId: v.guid,
        formType: v.type, // 'Sales' | 'Receipt' | 'Payment'
        journalDate: v.date,
        partyAllocationName: v.party,
        amountTransactedRupees: v.amount,
        narrationsText: v.narrations || '',
        instrumentOrMode: v.instrumentMode || '',
        syncVerified: v.syncStatus === 'Synced',
      })),
    },
  };

  const activePayload = payloads[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(activePayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/60 rounded-xl border border-slate-700/50 p-6 space-y-5 shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-700 pb-3.5 gap-2">
        <div className="text-left">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Code2 className="h-4 w-4 text-cyan-400" /> Customer 360 & Mobile REST JSON Payload Inspector
          </h3>
          <p className="text-xs text-slate-400 mt-1">Simulates live REST responses utilized by Flutter, Kotlin, and React Native mobile frameworks</p>
        </div>
        <button
          id="btn-copy-active-payload"
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs rounded font-bold cursor-pointer transition-all uppercase tracking-wider"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" /> Copied Payload!
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-slate-400" /> Copy JSON Output
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Endpoint Selector side rail */}
        <div className="lg:col-span-3 space-y-2">
          {/* Endpoint header */}
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1.5 block text-left">SELECT SERVICE OUTLET</span>

          <button
            type="button"
            onClick={() => setActiveTab('ledgers')}
            className={`w-full text-left p-3 rounded-lg text-xs font-semibold flex items-center gap-2.5 border transition-all cursor-pointer ${
              activeTab === 'ledgers'
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/40 shadow'
                : 'bg-slate-850 bg-slate-800/20 text-slate-400 border-slate-700/20 hover:bg-slate-800/40 hover:text-slate-200'
            }`}
          >
            <Server className="h-4 w-4 shrink-0" />
            <div className="truncate">
              <span className="block font-mono font-bold text-[10px] opacity-75">/masters/ledgers</span>
              <span className="text-[9px] text-slate-500 font-normal">Customer 360 master sheet</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('aging')}
            className={`w-full text-left p-3 rounded-lg text-xs font-semibold flex items-center gap-2.5 border transition-all cursor-pointer ${
              activeTab === 'aging'
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/40 shadow'
                : 'bg-slate-850 bg-slate-800/20 text-slate-400 border-slate-700/20 hover:bg-slate-800/40 hover:text-slate-200'
            }`}
          >
            <Server className="h-4 w-4 shrink-0" />
            <div className="truncate">
              <span className="block font-mono font-bold text-[10px] opacity-75">/reports/aging</span>
              <span className="text-[9px] text-slate-500 font-normal">Bill-wise collections bucket</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stock')}
            className={`w-full text-left p-3 rounded-lg text-xs font-semibold flex items-center gap-2.5 border transition-all cursor-pointer ${
              activeTab === 'stock'
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/40 shadow'
                : 'bg-slate-850 bg-slate-800/20 text-slate-400 border-slate-700/20 hover:bg-slate-800/40 hover:text-slate-200'
            }`}
          >
            <Server className="h-4 w-4 shrink-0" />
            <div className="truncate">
              <span className="block font-mono font-bold text-[10px] opacity-75">/inventory/stock-summary</span>
              <span className="text-[9px] text-slate-500 font-normal">Salesman Stock Catalog</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('vouchers')}
            className={`w-full text-left p-3 rounded-lg text-xs font-semibold flex items-center gap-2.5 border transition-all cursor-pointer ${
              activeTab === 'vouchers'
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/40 shadow'
                : 'bg-slate-850 bg-slate-800/20 text-slate-400 border-slate-700/20 hover:bg-slate-800/40 hover:text-slate-200'
            }`}
          >
            <Server className="h-4 w-4 shrink-0" />
            <div className="truncate">
              <span className="block font-mono font-bold text-[10px] opacity-75">/transactions/vouchers</span>
              <span className="text-[9px] text-slate-500 font-normal">Voucher journals data pool</span>
            </div>
          </button>
        </div>

        {/* JSON Live Frame */}
        <div className="lg:col-span-9 flex flex-col space-y-2">
          {/* Endpoint signature header */}
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850 border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-emerald-400 font-bold uppercase py-0.5 px-1.5 bg-emerald-500/10 rounded">GET</span>
              <span className="text-slate-350 text-slate-300 font-semibold">{activePayload.endpoint}</span>
            </div>
            <div className="flex gap-1.5 items-center">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[10px] font-mono text-slate-500 uppercase">200 OK</span>
            </div>
          </div>

          <div className="relative bg-slate-950/80 rounded-xl p-4 border border-slate-850 border-slate-800 h-[260px] overflow-auto text-left">
            <pre className="font-mono text-[11px] text-cyan-300 leading-relaxed max-w-full overflow-hidden select-text whitespace-pre-wrap">
              {JSON.stringify(activePayload, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobilePayloadExplorer;
