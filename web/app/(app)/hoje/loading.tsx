export default function Loading() {
  return (
    <div style={{ background: "#F7F3EE", minHeight: "100vh", fontFamily: "'Noto Sans', system-ui, sans-serif" }}>
      <div style={{ padding: "52px 24px 8px" }}>
        <div style={{ height: 11, width: 60, background: "#EDE8DF", borderRadius: 6, marginBottom: 12, animation: "pulse 1.5s ease-in-out infinite" }} />
        <div style={{ height: 36, width: 200, background: "#EDE8DF", borderRadius: 8, marginBottom: 6 }} />
        <div style={{ height: 16, width: 140, background: "#EDE8DF", borderRadius: 6 }} />
      </div>

      <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
        {/* streak badge */}
        <div style={{ height: 36, width: 120, background: "#EDE8DF", borderRadius: 99 }} />

        {/* calendar */}
        <div style={{ background: "#FFFFFF", borderRadius: 20, padding: 20, border: "1px solid #E2DBD0" }}>
          <div style={{ height: 14, width: 80, background: "#EDE8DF", borderRadius: 6, marginBottom: 14 }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} style={{ height: 32, background: "#EDE8DF", borderRadius: 6 }} />
            ))}
          </div>
        </div>

        {/* reading card */}
        <div style={{ background: "#FFFFFF", borderRadius: 20, padding: 20, border: "1px solid #E2DBD0" }}>
          <div style={{ height: 12, width: 100, background: "#EDE8DF", borderRadius: 6, marginBottom: 12 }} />
          <div style={{ height: 22, width: "80%", background: "#EDE8DF", borderRadius: 6, marginBottom: 8 }} />
          <div style={{ height: 16, width: "60%", background: "#EDE8DF", borderRadius: 6, marginBottom: 16 }} />
          <div style={{ height: 48, background: "#EDE8DF", borderRadius: 12 }} />
        </div>

        {/* key verse */}
        <div style={{ background: "#FFFFFF", borderRadius: 20, padding: 20, border: "1px solid #E2DBD0" }}>
          <div style={{ height: 12, width: 80, background: "#EDE8DF", borderRadius: 6, marginBottom: 12 }} />
          <div style={{ height: 60, background: "#EDE8DF", borderRadius: 8 }} />
        </div>
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
