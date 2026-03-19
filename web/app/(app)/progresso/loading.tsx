export default function Loading() {
  return (
    <div style={{ background: "#F7F3EE", minHeight: "100vh", fontFamily: "'Noto Sans', system-ui, sans-serif" }}>
      <div style={{ padding: "52px 24px 8px" }}>
        <div style={{ height: 11, width: 60, background: "#EDE8DF", borderRadius: 6, marginBottom: 12 }} />
        <div style={{ height: 36, width: 200, background: "#EDE8DF", borderRadius: 8 }} />
      </div>

      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
        {/* big progress card */}
        <div style={{ background: "#FFFFFF", borderRadius: 24, padding: 28, border: "1px solid #E2DBD0" }}>
          <div style={{ height: 64, width: 120, background: "#EDE8DF", borderRadius: 8, marginBottom: 20 }} />
          <div style={{ height: 5, background: "#EDE8DF", borderRadius: 99 }} />
        </div>

        {/* stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[0, 1].map((i) => (
            <div key={i} style={{ background: "#FFFFFF", borderRadius: 20, padding: 22, border: "1px solid #E2DBD0" }}>
              <div style={{ height: 26, width: 26, background: "#EDE8DF", borderRadius: 6, margin: "0 auto 10px" }} />
              <div style={{ height: 40, width: 60, background: "#EDE8DF", borderRadius: 6, margin: "0 auto 8px" }} />
              <div style={{ height: 11, width: 80, background: "#EDE8DF", borderRadius: 6, margin: "0 auto" }} />
            </div>
          ))}
        </div>

        {/* remaining */}
        <div style={{ background: "#FFFFFF", borderRadius: 20, padding: 24, border: "1px solid #E2DBD0", textAlign: "center" as const }}>
          <div style={{ height: 52, width: 80, background: "#EDE8DF", borderRadius: 8, margin: "0 auto 8px" }} />
          <div style={{ height: 14, width: 160, background: "#EDE8DF", borderRadius: 6, margin: "0 auto" }} />
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
