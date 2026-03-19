// Telos icon system — thin line-art SVG icons matching the app's warm aesthetic

type P = { size?: number; color?: string; strokeWidth?: number };
const sw = 1.5; // default strokeWidth

export function FireIcon({ size = 20, color = "#A0855C", strokeWidth = sw }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 3C10 7 7 9 7 13a5 5 0 0010 0c0-4-3-6-5-10z"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10.5 14.5c0-1.5 1-2.5 1-2.5s.5 1.5.5 2.5a1.2 1.2 0 01-1.5 1"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    </svg>
  );
}

export function BookOpenIcon({ size = 20, color = "#A0855C", strokeWidth = sw }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function MusicIcon({ size = 20, color = "#A0855C", strokeWidth = sw }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="8" cy="18" r="2.5" stroke={color} strokeWidth={strokeWidth}/>
      <circle cx="18" cy="16" r="2.5" stroke={color} strokeWidth={strokeWidth}/>
      <path d="M10.5 18V8.5l10-2V14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function LockIcon({ size = 20, color = "#A0855C", strokeWidth = sw }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="5" y="11" width="14" height="10" rx="2.5"
        stroke={color} strokeWidth={strokeWidth}/>
      <path d="M8 11V7a4 4 0 018 0v4"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <circle cx="12" cy="16" r="1.2" fill={color}/>
    </svg>
  );
}

export function PencilIcon({ size = 20, color = "#A0855C", strokeWidth = sw }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 3 21l.5-4.5L17 3z"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function TempleIcon({ size = 20, color = "#A0855C", strokeWidth = sw }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <line x1="3" y1="21" x2="21" y2="21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <line x1="3" y1="8"  x2="21" y2="8"  stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <path d="M4 8L12 4l8 4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="7"  y1="8" x2="7"  y2="21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <line x1="12" y1="8" x2="12" y2="21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <line x1="17" y1="8" x2="17" y2="21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    </svg>
  );
}

export function PlayCircleIcon({ size = 20, color = "#A0855C", strokeWidth = sw }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth={strokeWidth}/>
      <path d="M10 8.5l6 3.5-6 3.5V8.5z"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function MessageIcon({ size = 20, color = "#A0855C", strokeWidth = sw }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="9"  y1="10" x2="9"  y2="10.01" stroke={color} strokeWidth={2.2} strokeLinecap="round"/>
      <line x1="12" y1="10" x2="12" y2="10.01" stroke={color} strokeWidth={2.2} strokeLinecap="round"/>
      <line x1="15" y1="10" x2="15" y2="10.01" stroke={color} strokeWidth={2.2} strokeLinecap="round"/>
    </svg>
  );
}

export function MicIcon({ size = 20, color = "#A0855C", strokeWidth = sw }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="9" y="2" width="6" height="11" rx="3"
        stroke={color} strokeWidth={strokeWidth}/>
      <path d="M19 10v2a7 7 0 01-14 0v-2"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <line x1="12" y1="19" x2="12" y2="22" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <line x1="9"  y1="22" x2="15" y2="22" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    </svg>
  );
}

export function TrophyIcon({ size = 20, color = "#A0855C", strokeWidth = sw }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M6 9H4.5a2.5 2.5 0 010-5H6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <path d="M18 9h1.5a2.5 2.5 0 000-5H18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <path d="M4 5h16v5a8 8 0 01-16 0V5z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="12" y1="18" x2="12" y2="22" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <line x1="8"  y1="22" x2="16" y2="22" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    </svg>
  );
}

export function CrownIcon({ size = 20, color = "#A0855C", strokeWidth = sw }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 18h18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <path d="M3 9l4 4 5-7 5 7 4-4v9H3V9z"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function ZapIcon({ size = 20, color = "#A0855C", strokeWidth = sw }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function ShieldIcon({ size = 20, color = "#A0855C", strokeWidth = sw }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function PrayIcon({ size = 20, color = "#A0855C", strokeWidth = sw }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L9 9l-5 2 4 4-1 6 5-3 5 3-1-6 4-4-5-2-3-7z"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function SpeakerIcon({ size = 20, color = "#A0855C", strokeWidth = sw }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M11 5L6 9H2v6h4l5 4V5z"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19.07 4.93a10 10 0 010 14.14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <path d="M15.54 8.46a5 5 0 010 7.07"   stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    </svg>
  );
}

export function CheckCircleIcon({ size = 20, color = "#2E7D32", strokeWidth = sw }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth={strokeWidth}/>
      <path d="M8 12l3 3 5-5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function StarIcon({ size = 20, color = "#A0855C", strokeWidth = sw }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
