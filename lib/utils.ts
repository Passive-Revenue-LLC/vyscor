import { EventStatus } from '@/types';

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateTime(dateString: string): string {
  return `${formatDate(dateString)} · ${formatTime(dateString)}`;
}

export function getRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = date.getTime() - now.getTime();
  const diffMins = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMs / 3600000);
  const diffDays = Math.round(diffMs / 86400000);

  if (diffMins < 0) {
    const absMins = Math.abs(diffMins);
    if (absMins < 60) return `Hace ${absMins} min`;
    if (absMins < 1440) return `Hace ${Math.abs(diffHours)} h`;
    return `Hace ${Math.abs(diffDays)} d`;
  }

  if (diffMins < 60) return `En ${diffMins} min`;
  if (diffHours < 24) return `En ${diffHours} h`;
  if (diffDays < 7) return `En ${diffDays} d`;
  return formatDate(dateString);
}

export function getStatusColor(status: EventStatus): string {
  switch (status) {
    case EventStatus.LIVE: return '#7C4CFF';
    case EventStatus.UPCOMING: return '#AAAAAA';
    case EventStatus.FINISHED: return '#6B6B6B';
    case EventStatus.CANCELLED: return '#6B6B6B';
  }
}

export function getStatusBorderColor(status: EventStatus): string {
  switch (status) {
    case EventStatus.LIVE: return 'border-l-[#6B00F0]';
    case EventStatus.UPCOMING: return 'border-l-transparent';
    case EventStatus.FINISHED: return 'border-l-transparent';
    case EventStatus.CANCELLED: return 'border-l-transparent';
  }
}

export function getStatusLabel(status: EventStatus): string {
  switch (status) {
    case EventStatus.LIVE: return 'EN VIVO';
    case EventStatus.UPCOMING: return 'PROXIMO';
    case EventStatus.FINISHED: return 'FINALIZADO';
    case EventStatus.CANCELLED: return 'CANCELADO';
  }
}

export function isEsport(sport: string): boolean {
  return ['CS2', 'LOL', 'DOTA2', 'VALORANT', 'ROCKETLEAGUE'].includes(sport);
}

export function meta(metadata: Record<string, unknown> | undefined | null, key: string): string | number | undefined {
  if (!metadata) return undefined;
  const val = metadata[key];
  if (typeof val === 'string' || typeof val === 'number') return val;
  return undefined;
}
