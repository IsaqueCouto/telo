"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/hoje",          label: "Início",    icon: "⬡" },
  { href: "/leitura",       label: "Ler",       icon: "◻" },
  { href: "/progresso",     label: "Progresso", icon: "◎" },
  { href: "/configuracoes", label: "Perfil",    icon: "◯" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", maxWidth: 480, margin: "0 auto", background: "#010101" }}>
      <main style={{ flex: 1, paddingBottom: 72 }}>{children}</main>

      {/* Bottom nav */}
      <nav
        style={{
          position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: "100%", maxWidth: 480,
          background: "rgba(10,10,10,0.95)",
          borderTop: "1px solid #1C1C1C",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          zIndex: 50,
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <div style={{ display: "flex" }}>
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  flex: 1, display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  paddingTop: 10, paddingBottom: 10, gap: 3,
                  textDecoration: "none",
                  color: active ? "#EB8530" : "#3A3A3A",
                  transition: "color 0.15s",
                }}
              >
                <span style={{ fontSize: 18, lineHeight: 1 }}>{item.icon}</span>
                <span style={{
                  fontSize: 10, fontWeight: active ? 700 : 500,
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  letterSpacing: "0.02em",
                }}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
