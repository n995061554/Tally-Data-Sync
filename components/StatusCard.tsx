
import React, { ReactElement } from 'react';
import { ConnectionStatus, SyncStatus } from '../types';

interface StatusCardProps {
  title: string;
  status: ConnectionStatus | SyncStatus | string;
  icon: ReactElement;
  isTime?: boolean;
}

const getStatusColorClasses = (status: ConnectionStatus | SyncStatus | string, isTime: boolean): string => {
  if (isTime) {
    return 'bg-sky-500/10 text-sky-400';
  }
  switch (status) {
    case ConnectionStatus.CONNECTED:
    case SyncStatus.SUCCESS:
      return 'bg-emerald-500/10 text-emerald-400';
    case ConnectionStatus.CONNECTING:
    case SyncStatus.SYNCING:
      return 'bg-amber-500/10 text-amber-400';
    case ConnectionStatus.DISCONNECTED:
    case SyncStatus.IDLE:
      return 'bg-slate-500/10 text-slate-400';
    case ConnectionStatus.ERROR:
    case SyncStatus.ERROR:
      return 'bg-red-500/10 text-red-400';
    default:
      return 'bg-slate-500/10 text-slate-400';
  }
};

const StatusCard: React.FC<StatusCardProps> = ({ title, status, icon, isTime = false }) => {
  const colorClasses = getStatusColorClasses(status, isTime);

  return (
    <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700/50 shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-400">{title}</p>
        <div className={`p-2 rounded-full ${colorClasses}`}>
          {icon}
        </div>
      </div>
      <div className="mt-2">
        <p className={`text-2xl font-semibold ${isTime ? 'text-slate-200' : colorClasses.split(' ')[1]}`}>
          {status}
        </p>
      </div>
    </div>
  );
};

export default StatusCard;
