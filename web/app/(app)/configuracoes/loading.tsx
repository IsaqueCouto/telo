export default function Loading() {
  return (
    <div style={{ background: "#F7F3EE", minHeight: "100vh", fontFamily: "'Noto Sans', system-ui, sans-serif" }}>
      <div style={{ padding: "52px 24px 8px" }}>
        <div style={{ height: 11, width: 60, background: "#EDE8DF", borderRadius: 6, marginBottom: 12 }} />
        <div style={{ height: 36, width: 160, background: "#EDE8DF", borderRadius: 8 }} />
      </div>

      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
        {/* profile card */}
        <div style={{ background: "#FFFFFF", borderRadius: 20, padding: 20, border: "1px solid #E2DBD0" }}>
          <div style={{ height: 14, width: 100, background: "#EDE8DF", borderRadius: 6, marginBottom: 16 }} />
          {[140, 120, 100].map((w, i) => (
            <div key={i} style={{ height: 14, width: w, background: "#EDE8DF", borderRadius: 6, marginBottom: 12 }} />
          ))}
        </div>

        {/* settings rows */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ background: "#FFFFFF", borderRadius: 16, padding: "18px 20px", border: "1px solid #E2DBD0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ height: 14, width: 120, background: "#EDE8DF", borderRadius: 6 }} />
            <div style={{ height: 14, width: 60, background: "#EDE8DF", borderRadius: 6 }} />
          </div>
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
