export default function Loading() {
  return (
    <div style={{ background: "#F7F3EE", minHeight: "100vh", fontFamily: "'Noto Sans', system-ui, sans-serif" }}>
      <div style={{ padding: "52px 24px 16px" }}>
        <div style={{ height: 11, width: 60, background: "#EDE8DF", borderRadius: 6, marginBottom: 12 }} />
        <div style={{ height: 32, width: 220, background: "#EDE8DF", borderRadius: 8, marginBottom: 6 }} />
        <div style={{ height: 14, width: 120, background: "#EDE8DF", borderRadius: 6 }} />
      </div>

      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* chapter text skeleton */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={{ height: 16, width: `${70 + Math.random() * 28}%`, background: "#EDE8DF", borderRadius: 6 }} />
        ))}
        <div style={{ height: 16, width: "40%", background: "#EDE8DF", borderRadius: 6 }} />
        <div style={{ marginTop: 8 }} />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{ height: 16, width: `${60 + Math.random() * 35}%`, background: "#EDE8DF", borderRadius: 6 }} />
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        div { animation: pulse 1.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
