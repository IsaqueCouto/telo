"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/hoje",          label: "Início",    icon: HomeIcon },
  { href: "/leitura",       label: "Ler",       icon: BookIcon },
  { href: "/progresso",     label: "Progresso", icon: ChartIcon },
  { href: "/configuracoes", label: "Perfil",    icon: UserIcon },
];

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#3B82C4" : "#B0A89F"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
      <path d="M9 21V12h6v9"/>
    </svg>
  );
}
function BookIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#3B82C4" : "#B0A89F"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
    </svg>
  );
}
function ChartIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#3B82C4" : "#B0A89F"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6"  y1="20" x2="6"  y2="14"/>
    </svg>
  );
}
function UserIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#3B82C4" : "#B0A89F"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", maxWidth: 480, margin: "0 auto", background: "#F7F3EE" }}>
      <main style={{ flex: 1, paddingBottom: 110 }}>{children}</main>

      <nav style={{
        position: "fixed",
        bottom: "calc(16px + env(safe-area-inset-bottom))",
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100% - 40px)",
        maxWidth: 440,
        background: "rgba(255, 255, 255, 0.78)",
        borderRadius: 30,
        border: "1px solid rgba(226, 219, 208, 0.55)",
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6)",
        zIndex: 50,
        padding: "8px 6px",
      }}>
        <div style={{ display: "flex" }}>
          {NAV.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="nav-item"
                style={{
                  flex: 1, display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  padding: "9px 4px 8px",
                  gap: 4,
                  textDecoration: "none",
                  position: "relative",
                  borderRadius: 22,
                  background: active ? "rgba(59, 130, 196, 0.10)" : "transparent",
                  transition: "background 0.2s",
                }}
              >
                <span className="nav-icon" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon active={active} />
                </span>
                <span style={{
                  fontSize: 10, fontWeight: active ? 700 : 500,
                  fontFamily: "'Noto Sans', system-ui, sans-serif",
                  color: active ? "#3B82C4" : "#B0A89F",
                  letterSpacing: "0.01em",
                }}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      <style>{`
        @keyframes navBounce {
          0%   { transform: scale(1); }
          35%  { transform: scale(0.82); }
          65%  { transform: scale(1.14); }
          82%  { transform: scale(0.96); }
          100% { transform: scale(1); }
        }
        .nav-item:active .nav-icon {
          animation: navBounce 0.35s cubic-bezier(0.36, 0.07, 0.19, 0.97);
        }
        .nav-item:active {
          opacity: 0.85;
        }
      `}</style>
    </div>
  );
}
