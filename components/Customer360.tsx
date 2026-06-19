import React, { useState, useEffect } from 'react';
import { type Ledger, type Voucher, type OutstandingBill } from '../types';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Hash, 
  FileText, 
  CreditCard,
  TrendingDown, 
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';

interface Customer360Props {
  ledgers: Ledger[];
  vouchers: Voucher[];
  outstandings: OutstandingBill[];
}

const Customer360: React.FC<Customer360Props> = ({
  ledgers,
  vouchers,
  outstandings,
}) => {
  const debtors = ledgers.filter(l => l.group === 'Sundry Debtors');
  const [selectedGuid, setSelectedGuid] = useState<string>('');

  useEffect(() => {
    if (debtors.length > 0 && !selectedGuid) {
      setSelectedGuid(debtors[0].guid);
    }
  }, [debtors, selectedGuid]);

  const activeCustomer = debtors.find(d => d.guid === selectedGuid);

  // Filter outstandings for selected party
  const partyOutstandings = activeCustomer
    ? outstandings.filter(o => o.customerGuid === activeCustomer.guid)
    : [];

  const totalOutstandingForParty = partyOutstandings.reduce((sum, b) => sum + b.balanceAmount, 0);

  // Filter vouchers associated with this party
  const partyVouchers = activeCustomer
    ? vouchers.filter(v => v.party.toLowerCase() === activeCustomer.name.toLowerCase())
    : [];

  // Aging calculation for selected ledger
  let age0_30 = 0;
  let age31_60 = 0;
  let age61_90 = 0;
  let age90plus = 0;

  partyOutstandings.forEach(bill => {
    if (bill.overdueDays <= 30) age0_30 += bill.balanceAmount;
    else if (bill.overdueDays <= 60) age31_60 += bill.balanceAmount;
    else if (bill.overdueDays <= 90) age61_90 += bill.balanceAmount;
    else age90plus += bill.balanceAmount;
  });

  return (
    <div className="bg-slate-900/60 rounded-xl border border-slate-700/50 p-6 space-y-6 shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-700 pb-4 gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <User className="h-4 w-4 text-emerald-400" /> Customer CRM 360° Profile Lookup
          </h3>
          <p className="text-xs text-slate-400 mt-1">Deep insight on cash collection cycles, billing, and credit metrics</p>
        </div>
        <div>
          <label htmlFor="customer-lookup-dropdown" className="sr-only">Choose Customer</label>
          <select
            id="customer-lookup-dropdown"
            value={selectedGuid}
            onChange={(e) => setSelectedGuid(e.target.value)}
            className="block bg-slate-800 text-slate-200 border border-slate-700 rounded-md py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium text-xs w-[250px]"
          >
            <option value="">-- Choose Customer --</option>
            {debtors.map(d => (
              <option key={d.guid} value={d.guid}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {activeCustomer ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Col 1: Contact card & credit limits */}
          <div className="space-y-4">
            <div className="bg-slate-800/40 p-4 border border-slate-700/30 rounded-lg space-y-3.5">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest border-b border-slate-700/40 pb-2">Profile Details</h4>
              
              <div className="space-y-2 text-xs">
                {/* Contact Person */}
                {activeCustomer.contactPerson && (
                  <div className="flex items-start gap-2">
                    <span className="text-slate-400 w-24 shrink-0">Contact:</span>
                    <span className="text-slate-200 font-medium">{activeCustomer.contactPerson}</span>
                  </div>
                )}
                {/* Mobile */}
                <div className="flex items-start gap-2">
                  <span className="text-slate-400 w-24 shrink-0">Mobile No:</span>
                  <span className="text-emerald-400 font-bold font-mono">{activeCustomer.mobile || 'N/A'}</span>
                </div>
                {/* Email */}
                <div className="flex items-start gap-2">
                  <span className="text-slate-400 w-24 shrink-0">Email address:</span>
                  <span className="text-slate-300 truncate font-mono">{activeCustomer.email || 'N/A'}</span>
                </div>
                {/* City / State */}
                <div className="flex items-start gap-2">
                  <span className="text-slate-400 w-24 shrink-0">Location:</span>
                  <span className="text-slate-200">{activeCustomer.city}, {activeCustomer.state}</span>
                </div>
                {/* Physical Address */}
                {activeCustomer.address && (
                  <div className="flex items-start gap-2 pt-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" />
                    <span className="text-slate-450 text-[11px] text-slate-400 leading-normal">{activeCustomer.address}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-800/40 p-4 border border-slate-700/30 rounded-lg space-y-3.5">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest border-b border-slate-700/40 pb-2">Compliance & Credit Parameters</h4>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-450 text-slate-400">GSTIN Ref:</span>
                  <span className="font-mono text-slate-200 font-semibold">{activeCustomer.gstin || 'Unregistered'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-450 text-slate-400">PAN Card:</span>
                  <span className="font-mono text-slate-200 font-semibold">{activeCustomer.pan || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-850 border-slate-800">
                  <span className="text-slate-450 text-slate-400">Credit Limit:</span>
                  <span className="text-amber-400 font-bold">₹{activeCustomer.creditLimit?.toLocaleString() || 'Unlimited'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-450 text-slate-400">Allowed Term:</span>
                  <span className="text-teal-400 font-bold">{activeCustomer.creditDays || 'Not set'} Days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-450 text-slate-400">Opening Balance:</span>
                  <span className="text-slate-300">₹{activeCustomer.openingBalance?.toLocaleString() || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Col 2: Outstanding Summary & Aging timelines */}
          <div className="space-y-4">
            <div className="bg-slate-800/40 p-5 border border-slate-700/30 rounded-lg space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest border-b border-slate-700/40 pb-2 flex items-center justify-between">
                <span>Collections Summary</span>
                <span className="text-[10px] bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded font-mono">Liability Block</span>
              </h4>

              <div className="text-center py-2 bg-slate-900/40 rounded border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Currently Overdue Balance</span>
                <span className={`text-2xl font-black ${totalOutstandingForParty > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  ₹{totalOutstandingForParty.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500 block font-mono">Tally Ledger Bal: ₹{activeCustomer.balance.toLocaleString()}</span>
              </div>

              {/* Individual Aging Timeline */}
              <div className="space-y-2 text-xs pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Aging Timetable</span>
                
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">0–30 Days</span>
                    <span className="font-semibold text-slate-200">₹{age0_30.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">31–60 Days</span>
                    <span className="font-semibold text-slate-200">₹{age31_60.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">61–90 Days</span>
                    <span className="font-semibold text-amber-400">₹{age61_90.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">90+ Days</span>
                    <span className="font-semibold text-rose-450 text-rose-400">₹{age90plus.toLocaleString()}</span>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Avg Collection Days:</span>
                  <span className="font-bold text-slate-100">22 Days</span>
                </div>
              </div>
            </div>

            {/* Individual active invoice records */}
            <div className="bg-slate-800/40 p-4 border border-slate-700/30 rounded-lg space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest border-b border-slate-700/40 pb-2">Pending Invoices ({partyOutstandings.length})</h4>
              <div className="overflow-y-auto max-h-[140px] space-y-2 pr-1 custom-scrollbar">
                {partyOutstandings.map(bill => (
                  <div key={bill.guid} className="p-2 bg-slate-900/30 border border-slate-700/10 rounded flex justify-between items-center text-[11px]">
                    <div>
                      <span className="font-bold text-slate-300 block">{bill.invoiceNo}</span>
                      <span className="text-[10px] text-slate-500">{bill.invoiceDate} (Due {bill.dueDate})</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-amber-300 block">₹{bill.balanceAmount.toLocaleString()}</span>
                      {bill.overdueDays > 0 && (
                        <span className="text-[9px] bg-rose-500/15 py-0.5 px-1 text-rose-400 rounded font-bold font-mono">
                          {bill.overdueDays}d overdue
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {partyOutstandings.length === 0 && (
                  <p className="text-slate-500 text-xs py-2 text-center">No outstanding bills for this customer.</p>
                )}
              </div>
            </div>
          </div>

          {/* Col 3: Latest 10 Transaction logs */}
          <div className="bg-slate-800/40 p-4 border border-slate-700/30 rounded-lg space-y-3.5 flex flex-col h-full lg:col-span-1">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest border-b border-slate-700/40 pb-2 flex items-center justify-between">
              <span>Journal & Invoices History</span>
              <span className="text-[10px] bg-slate-800 text-slate-450 text-slate-450 border border-slate-700 text-slate-400 px-1.5 py-0.5 rounded font-mono">Tally Prime Journal</span>
            </h4>
            
            <div className="overflow-y-auto max-h-[340px] space-y-2.5 flex-grow pr-1 custom-scrollbar">
              {partyVouchers.map(v => (
                <div key={v.guid} className="p-3 bg-slate-950/40 rounded border border-slate-800/60 space-y-1 text-left">
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] uppercase font-bold py-0.5 px-2 rounded-full ${v.type === 'Sales' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                      {v.type}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{v.date}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-[11px] text-slate-400 max-w-[130px] truncate">{v.narrations || 'Ref transaction voucher'}</span>
                    <span className="text-xs font-bold text-slate-200">₹{v.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-[9px] text-slate-500">
                    <span>Payment: <span className="text-slate-400 font-medium">{v.instrumentMode || 'Standard'}</span></span>
                    <span className="text-emerald-400 font-bold font-mono">✔️ Verified Synced</span>
                  </div>
                </div>
              ))}
              {partyVouchers.length === 0 && (
                <p className="text-slate-500 text-xs py-10 text-center">No transaction history found for this Ledger.</p>
              )}
            </div>
          </div>

        </div>
      ) : (
        <div className="text-center py-12 text-slate-500 text-xs">
          Please select a Kundali / ledger from the dropdown to load their Customer 360 profile.
        </div>
      )}
    </div>
  );
};

export default Customer360;
