import React, { useState } from 'react';
import { BookOpenIcon, QuestionMarkCircleIcon } from './icons/Icons';

const TallyGuidePanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-slate-800/40 rounded-lg border border-slate-700/50 shadow-md overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left bg-slate-800/60 hover:bg-slate-800/80 transition-colors focus:outline-none"
      >
        <div className="flex items-center space-x-3">
          <BookOpenIcon className="h-6 w-6 text-emerald-400" />
          <div>
            <h3 className="text-lg font-semibold text-slate-200">Tally Prime Connection Guide</h3>
            <p className="text-xs text-slate-400">Step-by-step instructions to configure Tally Prime for real-time synchronization.</p>
          </div>
        </div>
        <span className="text-slate-400 text-sm font-semibold select-none">
          {isOpen ? 'Collapse ▴' : 'Expand ▾'}
        </span>
      </button>

      {isOpen && (
        <div className="p-6 border-t border-slate-700/40 bg-slate-900/10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold shrink-0 mt-0.5">1</span>
                <div>
                  <h4 className="font-semibold text-slate-100 text-sm">Enable ODBC & Server Mode</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Open <strong className="text-slate-200">Tally Prime</strong>, click <strong className="text-slate-200">F1: Help</strong> from top menu &gt; <strong className="text-slate-200">Settings</strong> &gt; <strong className="text-slate-200">Startup</strong>.
                  </p>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Under <strong className="text-slate-200">TallyPrime acts as</strong> choose <strong className="text-slate-300">"Both"</strong> or <strong className="text-slate-200">"Server"</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold shrink-0 mt-0.5">2</span>
                <div>
                  <h4 className="font-semibold text-slate-100 text-sm">Set Port & Restart Tally</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Set <strong className="text-slate-200">Enable ODBC</strong> to <strong className="text-emerald-400">"Yes"</strong> and specify <strong className="text-slate-200">Port (Default: 9000)</strong>.
                  </p>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Press <strong className="text-slate-300">Ctrl+A</strong> to save. <strong className="text-red-400 font-semibold">Restart Tally Prime</strong> to activate the port!
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold shrink-0 mt-0.5">3</span>
                <div>
                  <h4 className="font-semibold text-slate-100 text-sm">Keep Company Open</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Tally Prime only processes external XML queries if a company is loaded and active. Make sure your target company is open.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold shrink-0 mt-0.5">4</span>
                <div>
                  <h4 className="font-semibold text-slate-100 text-sm">Match App Configuration</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Enter the port (<code className="text-emerald-300 bg-slate-800 px-1 rounded">9000</code>) and the exact Company Name/ID in the configuration panel of this app.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700/30 flex items-center space-x-3 text-xs bg-emerald-950/10 p-3.5 rounded border border-emerald-900/20">
            <QuestionMarkCircleIcon className="h-5 w-5 text-emerald-400 shrink-0" />
            <div className="text-slate-300 leading-relaxed">
              <span className="font-semibold text-emerald-300">Connection Checklist:</span> Ensure that your Windows Defender Firewall has port <code className="text-emerald-300 bg-emerald-950/40 px-1 py-0.5 rounded font-mono">9000</code> whitelisted if interfacing from multiple machines, and keep Tally running in the background.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TallyGuidePanel;
