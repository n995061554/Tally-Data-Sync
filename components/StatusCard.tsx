
import React, { ReactElement } from 'react';
import { ConnectionStatus, SyncStatus } from '../types';

interface StatusCardProps {
  title: string;
  status: ConnectionStatus | SyncStatus | string;
  icon: ReactElement;
  isTime?: boolean;
  onClick?: () => void;
  isButton?: boolean;
  clickLabel?: string;
}

const getStatusColorClasses = (status: ConnectionStatus | SyncStatus | string, isTime: boolean): string => {
  if (isTime) {
    return 'bg-sky-500/10 text-sky-400 border border-sky-500/20';
  }
  switch (status) {
    case ConnectionStatus.CONNECTED:
    case SyncStatus.SUCCESS:
      return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    case ConnectionStatus.CONNECTING:
    case SyncStatus.SYNCING:
      return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    case ConnectionStatus.DISCONNECTED:
    case SyncStatus.IDLE:
      return 'bg-slate-500/10 text-slate-400 border border-slate-700/50';
    case ConnectionStatus.ERROR:
    case SyncStatus.ERROR:
      return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
    default:
      return 'bg-slate-500/10 text-slate-400 border border-slate-700/50';
  }
};

const StatusCard: React.FC<StatusCardProps> = ({ title, status, icon, isTime = false, onClick, isButton = false, clickLabel }) => {
  const colorClasses = getStatusColorClasses(status, isTime);
  const isSyncing = status === SyncStatus.SYNCING;
  
  const Container = onClick ? 'button' : 'div';

  return (
    <Container
      onClick={onClick}
      {...(onClick ? { type: 'button' } : {})}
      className={`relative text-left w-full bg-slate-800/50 rounded-lg p-5 border shadow-md transition-all group ${
        onClick 
          ? 'cursor-pointer hover:bg-slate-800/80 active:scale-[0.98] focus:outline-none focus:ring-1 focus:ring-emerald-500/40' 
          : ''
      } ${
        isSyncing 
          ? 'border-amber-500/45 ring-2 ring-amber-500/15 shadow-[0_0_15px_rgba(245,158,11,0.12)] bg-slate-800/70' 
          : onClick 
            ? 'border-slate-705/10 border-slate-700/50 hover:border-emerald-500/40 hover:shadow-[0_0_12px_rgba(16,185,129,0.08)] bg-slate-800/50' 
            : 'border-slate-700/50'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          {isSyncing && (
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
          )}
          {status === SyncStatus.SUCCESS && (
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          )}
        </div>
        
        {/* Dynamic Glowing Round Icon wrapper */}
        <div className={`p-2.5 rounded-full transition-all duration-300 ${colorClasses} ${
          isSyncing 
            ? 'ring-4 ring-amber-500/30 animate-pulse scale-105' 
            : onClick 
              ? 'group-hover:scale-110 group-hover:bg-emerald-500/20 group-hover:text-emerald-300' 
              : ''
        }`}>
          {icon}
        </div>
      </div>
      
      <div className="mt-3 flex flex-col">
        <span className={`text-2xl font-bold tracking-tight font-mono whitespace-nowrap overflow-hidden text-ellipsis ${
          isTime 
            ? 'text-slate-100' 
            : colorClasses.split(' ')[1]
        }`}>
          {status}
        </span>
        
        {onClick && (
          <span className="text-[10px] font-mono mt-1 flex items-center transition-all duration-200">
            {isSyncing ? (
              <span className="text-amber-400/90 animate-pulse flex items-center">
                <span className="inline-block animate-spin mr-1">⚙️</span> Sync thread busy...
              </span>
            ) : (
              <span className="text-slate-400/80 group-hover:text-emerald-400 flex items-center">
                <span className="inline-block mr-1">⚡</span> {clickLabel || 'Click here to Sync'}
              </span>
            )}
          </span>
        )}
      </div>
    </Container>
  );
};

export default StatusCard;
