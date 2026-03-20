export default function Loading() {
  const S = { bg: "#F7F3EE", surface: "#EDE8DF", border: "#E2DBD0", muted: "#C8BEB2" };
  return (
    <div style={{ background: S.bg, minHeight: "100vh" }}>
      <div style={{ background: "rgba(247,243,238,0.82)", borderBottom: `1px solid ${S.border}`, padding: "calc(env(safe-area-inset-top) + 10px) 20px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ width: 60, height: 16, background: S.surface, borderRadius: 6 }} />
        <div style={{ width: 120, height: 16, background: S.surface, borderRadius: 6 }} />
        <div style={{ width: 80, height: 28, background: S.surface, borderRadius: 10 }} />
      </div>
      <div style={{ padding: "28px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} style={{ height: 24, background: S.surface, borderRadius: 6, opacity: 1 - i * 0.04 }} />
        ))}
      </div>
    </div>
  );
}
