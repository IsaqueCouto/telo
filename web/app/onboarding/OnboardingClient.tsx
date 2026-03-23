"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const S = {
  bg: "#F7F3EE",
  surface: "#EDE8DF",
  border: "#E2DBD0",
  muted: "#C8BEB2",
  gray: "#8C8279",
  ink: "#0D0D0B",
  blue: "#3B82C4",
  blueBg: "rgba(59, 130, 196, 0.10)",
  sans: "'Noto Sans', system-ui, sans-serif",
  serif: "'Vesper Libre', Georgia, serif",
};

const PACES = [
  { value: "3months",  label: "3 meses",  sub: "~10 capítulos por dia",  emoji: "⚡" },
  { value: "6months",  label: "6 meses",  sub: "~5 capítulos por dia",   emoji: "🔥" },
  { value: "9months",  label: "9 meses",  sub: "~3 capítulos por dia",   emoji: "✦",  recommended: true },
  { value: "1year",    label: "1 ano",    sub: "~2-3 capítulos por dia", emoji: "🌱" },
];

const TIMES = ["06:00", "07:00", "08:00", "09:00", "12:00", "18:00", "19:00", "20:00", "21:00"];

function timeLabel(t: string) {
  const [h] = t.split(":");
  const hour = parseInt(h);
  if (hour < 12) return `${hour}h manhã`;
  if (hour === 12) return "12h meio-dia";
  return `${hour}h noite`;
}

function ProgressDots({ step }: { step: number }) {
  return (
    <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 40 }}>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            width: i === step ? 20 : 6,
            height: 6,
            borderRadius: 3,
            background: i === step ? S.blue : S.muted,
            transition: "all 0.3s ease",
          }}
        />
      ))}
    </div>
  );
}

type Platform = "ios" | "android" | "desktop" | "installed";

function InstallSheet({ platform, onDone }: { platform: Platform; onDone: () => void }) {
  const isIos     = platform === "ios";
  const isAndroid = platform === "android";

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(0,0,0,0.45)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      backdropFilter: "blur(4px)",
    }}>
      <div style={{
        background: S.bg,
        borderRadius: "24px 24px 0 0",
        padding: "28px 24px calc(36px + env(safe-area-inset-bottom))",
        width: "100%",
        maxWidth: 480,
      }}>
        {/* Handle */}
        <div style={{ width: 36, height: 4, borderRadius: 2, background: S.muted, margin: "0 auto 24px" }} />

        <p style={{ fontSize: 10, color: S.blue, textTransform: "uppercase" as const, letterSpacing: "0.12em", fontWeight: 700, marginBottom: 6, fontFamily: S.sans }}>Dica importante</p>
        <h2 style={{ fontFamily: S.serif, fontSize: 24, fontWeight: 900, color: S.ink, lineHeight: 1.2, marginBottom: 10 }}>
          Adicione à tela inicial
        </h2>
        <p style={{ fontSize: 14, color: S.gray, lineHeight: 1.6, marginBottom: 24, fontFamily: S.sans }}>
          Para receber notificações e acessar o Telos como um app, adicione-o à sua tela inicial.
        </p>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 28 }}>
          {isIos && (
            <>
              <InstallStep n={1} text='Toque no botão de compartilhar no Safari' icon="⬆️" note='Ícone de caixa com seta, no centro da barra inferior' />
              <InstallStep n={2} text='Role para baixo e toque em "Adicionar à Tela de Início"' icon="📲" />
              <InstallStep n={3} text='Toque em "Adicionar" no canto superior direito' icon="✅" />
            </>
          )}
          {isAndroid && (
            <>
              <InstallStep n={1} text="Toque nos três pontos no canto superior direito do Chrome" icon="⋮" note="Menu ⋮" />
              <InstallStep n={2} text='"Adicionar à tela inicial"' icon="📲" />
              <InstallStep n={3} text='Toque em "Adicionar"' icon="✅" />
            </>
          )}
          {platform === "desktop" && (
            <div style={{ background: "#FFFFFF", borderRadius: 14, padding: "16px", border: `1px solid ${S.border}` }}>
              <p style={{ fontSize: 14, color: S.gray, lineHeight: 1.6, fontFamily: S.sans }}>
                No computador, você pode salvar nos favoritos para acessar rápido. No celular, adicione à tela inicial para receber notificações.
              </p>
            </div>
          )}
        </div>

        <button
          onClick={onDone}
          style={{
            width: "100%",
            background: S.blue,
            color: "#FFFFFF",
            borderRadius: 14,
            padding: "16px",
            fontSize: 16,
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
            fontFamily: S.sans,
          }}
        >
          Entendi, vamos lá!
        </button>
      </div>
    </div>
  );
}

function InstallStep({ n, text, icon, note }: { n: number; text: string; icon: string; note?: string }) {
  return (
    <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
      <div style={{
        width: 28, height: 28, borderRadius: "50%",
        background: S.blueBg, border: `1.5px solid ${S.blue}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, marginTop: 2,
      }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: S.blue, fontFamily: S.sans }}>{n}</span>
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 14, color: S.ink, fontFamily: S.sans, lineHeight: 1.5 }}>
          <span style={{ marginRight: 6 }}>{icon}</span>{text}
        </p>
        {note && <p style={{ fontSize: 12, color: S.muted, fontFamily: S.sans, marginTop: 2 }}>{note}</p>}
      </div>
    </div>
  );
}

export function OnboardingClient({ profile }: { profile: { id: string; full_name: string | null } }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [pace, setPace] = useState("9months");
  const [time, setTime] = useState("07:00");
  const [loading, setLoading] = useState(false);
  const [showInstall, setShowInstall] = useState(false);
  const [platform, setPlatform] = useState<Platform>("desktop");

  useEffect(() => {
    const ua = navigator.userAgent;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isInstalled = window.matchMedia("(display-mode: standalone)").matches || (navigator as any).standalone;
    if (isInstalled) { setPlatform("installed"); return; }
    if (/iPhone|iPad|iPod/.test(ua) && !/CriOS|FxiOS/.test(ua)) { setPlatform("ios"); return; }
    if (/Android/.test(ua)) { setPlatform("android"); return; }
    setPlatform("desktop");
  }, []);

  async function finish() {
    setLoading(true);
    const supabase = createClient();
    await supabase
      .from("profiles")
      .update({ pace, notification_time: time, onboarding_completed: true })
      .eq("id", profile.id);

    // Skip install sheet if already installed or on desktop
    if (platform === "installed" || platform === "desktop") {
      router.push("/hoje");
      router.refresh();
    } else {
      setLoading(false);
      setShowInstall(true);
    }
  }

  function goToApp() {
    router.push("/hoje");
    router.refresh();
  }

  const firstName = profile.full_name?.split(" ")[0] ?? "você";

  return (
    <div style={{
      minHeight: "100vh",
      background: S.bg,
      fontFamily: S.sans,
      display: "flex",
      flexDirection: "column",
      maxWidth: 480,
      margin: "0 auto",
    }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "60px 28px 40px" }}>

        {/* Logo */}
        <div style={{ marginBottom: 48 }}>
          <img src="/logo.png" alt="Telos" style={{ height: 36, objectFit: "contain" }} />
        </div>

        <ProgressDots step={step} />

        {/* Step 1 — Pace */}
        {step === 1 && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <h1 style={{ fontFamily: S.serif, fontSize: 30, fontWeight: 900, color: S.ink, lineHeight: 1.15, marginBottom: 8 }}>
              Qual é o seu ritmo<br />de leitura?
            </h1>
            <p style={{ fontSize: 14, color: S.gray, marginBottom: 32 }}>
              Você pode mudar isso depois no seu perfil.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
              {PACES.map((p) => {
                const selected = pace === p.value;
                return (
                  <button
                    key={p.value}
                    onClick={() => setPace(p.value)}
                    style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "16px 18px", borderRadius: 14,
                      border: `1.5px solid ${selected ? S.blue : S.border}`,
                      background: selected ? S.blueBg : "#FFFFFF",
                      cursor: "pointer", textAlign: "left", transition: "all 0.2s",
                    }}
                  >
                    <span style={{ fontSize: 22 }}>{p.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 16, fontWeight: 700, color: selected ? S.blue : S.ink }}>{p.label}</span>
                        {p.recommended && (
                          <span style={{ fontSize: 10, fontWeight: 700, color: S.blue, background: S.blueBg, borderRadius: 20, padding: "2px 8px", letterSpacing: "0.03em" }}>
                            RECOMENDADO
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: 13, color: S.gray }}>{p.sub}</span>
                    </div>
                    <div style={{
                      width: 20, height: 20, borderRadius: "50%",
                      border: `2px solid ${selected ? S.blue : S.muted}`,
                      background: selected ? S.blue : "transparent",
                      flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {selected && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setStep(2)}
              style={{ marginTop: 28, background: S.blue, color: "#FFFFFF", borderRadius: 14, padding: "16px", fontSize: 16, fontWeight: 700, border: "none", cursor: "pointer", fontFamily: S.sans }}
            >
              Continuar
            </button>
          </div>
        )}

        {/* Step 2 — Notification time */}
        {step === 2 && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <h1 style={{ fontFamily: S.serif, fontSize: 30, fontWeight: 900, color: S.ink, lineHeight: 1.15, marginBottom: 8 }}>
              Quando você quer<br />ser lembrado?
            </h1>
            <p style={{ fontSize: 14, color: S.gray, marginBottom: 32 }}>
              Vamos te enviar um lembrete diário nesse horário.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, flex: 1, alignContent: "start" }}>
              {TIMES.map((t) => {
                const selected = time === t;
                return (
                  <button
                    key={t}
                    onClick={() => setTime(t)}
                    style={{
                      padding: "14px 8px", borderRadius: 12,
                      border: `1.5px solid ${selected ? S.blue : S.border}`,
                      background: selected ? S.blueBg : "#FFFFFF",
                      color: selected ? S.blue : S.ink,
                      fontWeight: selected ? 700 : 500,
                      fontSize: 13, cursor: "pointer", fontFamily: S.sans,
                      transition: "all 0.2s", textAlign: "center", lineHeight: 1.3,
                    }}
                  >
                    {timeLabel(t)}
                  </button>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
              <button
                onClick={() => setStep(1)}
                style={{ flex: "0 0 52px", background: "#FFFFFF", color: S.gray, borderRadius: 14, padding: "16px", fontSize: 18, border: `1.5px solid ${S.border}`, cursor: "pointer" }}
              >
                ←
              </button>
              <button
                onClick={() => setStep(3)}
                style={{ flex: 1, background: S.blue, color: "#FFFFFF", borderRadius: 14, padding: "16px", fontSize: 16, fontWeight: 700, border: "none", cursor: "pointer", fontFamily: S.sans }}
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — All set */}
        {step === 3 && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <div style={{
              width: 88, height: 88, borderRadius: "50%",
              background: S.blueBg, border: `2px solid ${S.blue}`,
              display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 32,
            }}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M10 20l7 7 13-14" stroke={S.blue} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <h1 style={{ fontFamily: S.serif, fontSize: 30, fontWeight: 900, color: S.ink, lineHeight: 1.15, marginBottom: 12 }}>
              Tudo pronto,<br />{firstName}!
            </h1>
            <p style={{ fontSize: 15, color: S.gray, lineHeight: 1.6, maxWidth: 280, marginBottom: 40 }}>
              Sua jornada pela Bíblia começa hoje. Um capítulo de cada vez.
            </p>

            <div style={{
              width: "100%", background: "#FFFFFF", borderRadius: 16,
              border: `1px solid ${S.border}`, padding: "20px",
              display: "flex", flexDirection: "column", gap: 14,
              marginBottom: "auto", textAlign: "left",
            }}>
              <SummaryRow icon="📖" label="Ritmo de leitura" value={PACES.find((p) => p.value === pace)?.label ?? pace} />
              <div style={{ height: 1, background: S.border }} />
              <SummaryRow icon="🔔" label="Lembrete diário" value={timeLabel(time)} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", marginTop: 28 }}>
              <button
                onClick={finish}
                disabled={loading}
                style={{
                  background: loading ? S.muted : S.blue, color: "#FFFFFF",
                  borderRadius: 14, padding: "16px", fontSize: 16, fontWeight: 700,
                  border: "none", cursor: loading ? "default" : "pointer",
                  fontFamily: S.sans, transition: "background 0.2s",
                }}
              >
                {loading ? "Entrando..." : "Começar a ler"}
              </button>
              <button
                onClick={() => setStep(2)}
                style={{ background: "transparent", color: S.gray, border: "none", cursor: "pointer", fontFamily: S.sans, fontSize: 14, padding: "8px" }}
              >
                ← Voltar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Install to home screen sheet */}
      {showInstall && (
        <InstallSheet platform={platform} onDone={goToApp} />
      )}
    </div>
  );
}

function SummaryRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 12, color: "#8C8279" }}>{label}</div>
        <div style={{ fontSize: 15, fontWeight: 600, color: "#0D0D0B" }}>{value}</div>
      </div>
    </div>
  );
}
