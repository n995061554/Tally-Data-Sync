
import React, { useState, useRef, useEffect } from 'react';
import { type LogEntry, LogLevel } from '../types';
import { DocumentTextIcon, TrashIcon, ArrowDownIcon, ArrowUpIcon, ArrowDownTrayIcon, MagnifyingGlassIcon } from './icons/Icons';

interface LogViewerProps {
  logs: LogEntry[];
  onClearLogs: () => void;
}

const getLogLevelColor = (level: LogLevel): string => {
  switch (level) {
    case LogLevel.INFO:
      return 'text-sky-400';
    case LogLevel.WARN:
      return 'text-amber-400';
    case LogLevel.ERROR:
      return 'text-red-400';
    case LogLevel.SUCCESS:
        return 'text-emerald-400';
    default:
      return 'text-slate-400';
  }
};

const getLogLevelBgColor = (level: LogLevel): string => {
    switch (level) {
      case LogLevel.INFO:
        return 'bg-sky-500';
      case LogLevel.WARN:
        return 'bg-amber-500';
      case LogLevel.ERROR:
        return 'bg-red-500';
      case LogLevel.SUCCESS:
          return 'bg-emerald-500';
      default:
        return 'bg-slate-500';
    }
}

// Helper component to render log messages with highlighted search terms
const HighlightedMessage: React.FC<{ text: string; highlight: string }> = ({ text, highlight }) => {
  if (!highlight.trim()) {
    return <>{text}</>;
  }

  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <mark key={index} className="bg-amber-400 text-slate-900 font-bold rounded-sm px-0.5">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
};


const LogViewer: React.FC<LogViewerProps> = ({ logs, onClearLogs }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const atBottomRef = useRef(true);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [filterLevel, setFilterLevel] = useState<LogLevel | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const scrollToBottom = (behavior: 'smooth' | 'auto' = 'smooth') => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior,
      });
    }
  };
  
  const scrollToTop = (behavior: 'smooth' | 'auto' = 'smooth') => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior,
      });
    }
  };

  useEffect(() => {
    if (atBottomRef.current) {
      scrollToBottom('auto');
    }
  }, [logs, filterLevel, searchTerm]); // also scroll to bottom when filter changes

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 10;
      atBottomRef.current = isAtBottom;
      setShowScrollBottom(!isAtBottom);
      setShowScrollTop(container.scrollTop > 50);
    }
  };

  const handleConfirmClear = () => {
    onClearLogs();
    setShowClearConfirm(false);
  };
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowClearConfirm(false);
      }
    };

    if (showClearConfirm) {
      document.addEventListener('keydown', handleKeyDown);
      // Focus the cancel button for accessibility
      cancelButtonRef.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showClearConfirm]);
  
  const filteredLogs = logs
    .filter(log => !filterLevel || log.level === filterLevel)
    .filter(log => log.message.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleExportLogs = () => {
    const logContent = filteredLogs
      .map(log => `${new Date(log.timestamp).toISOString()} [${log.level}] ${log.message}`)
      .join('\n');

    const blob = new Blob([logContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    link.download = `tally-sync-logs-${timestamp}.txt`;
    
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const FilterButton: React.FC<{level: LogLevel | null}> = ({level}) => {
    const isActive = filterLevel === level;
    const text = level === null ? 'All' : level;
    return (
        <button
            onClick={() => setFilterLevel(level)}
            className={`flex items-center px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                isActive 
                ? 'bg-slate-600 text-slate-100' 
                : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
            }`}
        >
            {level && <span className={`w-2 h-2 rounded-full mr-2 ${getLogLevelBgColor(level)}`}></span>}
            {text}
        </button>
    )
  }

  return (
    <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700/50 shadow-md h-96 flex flex-col">
      <div className="flex items-center justify-between mb-4 gap-4">
        <div className="flex items-center flex-shrink-0">
          <DocumentTextIcon className="h-6 w-6 mr-3 text-slate-400" />
          <h3 className="text-lg font-semibold text-slate-200">Sync Logs</h3>
        </div>
        <div className="flex-grow flex items-center justify-end space-x-4">
            <div className="relative w-full max-w-xs">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full bg-slate-700 border border-slate-600 rounded-md py-1.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-slate-200"
              />
            </div>
            <div className="flex items-center p-1 bg-slate-800/50 rounded-lg space-x-1">
                <FilterButton level={null} />
                <FilterButton level={LogLevel.INFO} />
                <FilterButton level={LogLevel.WARN} />
                <FilterButton level={LogLevel.ERROR} />
                <FilterButton level={LogLevel.SUCCESS} />
            </div>
            <div className="flex items-center space-x-2">
                <button
                    onClick={handleExportLogs}
                    className="inline-flex items-center px-3 py-1 border border-slate-600 text-xs font-medium rounded-md text-slate-300 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 transition-colors"
                    aria-label="Export logs"
                    >
                    <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                    Export
                </button>
                <button
                    onClick={() => setShowClearConfirm(true)}
                    className="inline-flex items-center px-3 py-1 border border-slate-600 text-xs font-medium rounded-md text-slate-300 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-red-500 transition-colors"
                    aria-label="Clear logs"
                    >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Clear
                </button>
            </div>
        </div>
      </div>
      <div className="relative flex-grow">
        <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="absolute inset-0 bg-slate-900/70 rounded-md p-3 overflow-y-auto font-mono text-xs"
        >
            {filteredLogs.map((log, index) => (
            <div key={index} className="flex">
                <span className="text-slate-500 mr-3">
                {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span className={`font-bold mr-3 ${getLogLevelColor(log.level)}`}>
                [{log.level}]
                </span>
                <span className="flex-1 text-slate-300 whitespace-pre-wrap">
                  <HighlightedMessage text={log.message} highlight={searchTerm} />
                </span>
            </div>
            ))}
        </div>
        {showClearConfirm && (
            <div 
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-20 rounded-md p-4"
              role="dialog"
              aria-modal="true"
              aria-labelledby="clear-logs-title"
            >
                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 shadow-xl max-w-sm w-full text-center">
                    <h4 id="clear-logs-title" className="text-lg font-semibold text-slate-100">Clear All Logs?</h4>
                    <p className="mt-2 text-sm text-slate-400">
                        This action is irreversible and will permanently delete all log entries.
                    </p>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            ref={cancelButtonRef}
                            onClick={() => setShowClearConfirm(false)}
                            className="px-4 py-2 border border-slate-600 text-sm font-medium rounded-md text-slate-300 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-500 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmClear}
                            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-red-500 transition-colors"
                        >
                            Confirm Clear
                        </button>
                    </div>
                </div>
            </div>
        )}
        <div className="absolute bottom-4 right-4 flex flex-col items-center space-y-2">
            {showScrollTop && (
                <button
                onClick={() => scrollToTop('smooth')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-full p-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-emerald-500 transition-opacity"
                aria-label="Scroll to top"
                >
                <ArrowUpIcon className="h-5 w-5" />
                </button>
            )}
            {showScrollBottom && (
                <button
                onClick={() => scrollToBottom('smooth')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-full p-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-emerald-500 transition-opacity"
                aria-label="Scroll to bottom"
                >
                <ArrowDownIcon className="h-5 w-5" />
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default LogViewer;
