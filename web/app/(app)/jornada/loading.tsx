export default function Loading() {
  return (
    <div style={{ background: "#F7F3EE", minHeight: "100vh" }}>
      <div style={{ padding: "calc(env(safe-area-inset-top) + 44px) 24px 18px" }}>
        <div style={{ height: 10, width: 50, background: "#EDE8DF", borderRadius: 6, marginBottom: 8 }} />
        <div style={{ height: 34, width: 180, background: "#EDE8DF", borderRadius: 8 }} />
      </div>
      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ background: "#FFFFFF", borderRadius: 24, padding: 28, border: "1px solid #E2DBD0", display: "flex", gap: 28, alignItems: "center" }}>
          <div style={{ width: 130, height: 130, borderRadius: "50%", background: "#EDE8DF", flexShrink: 0 }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ height: 28, width: 60, background: "#EDE8DF", borderRadius: 6 }} />
            <div style={{ height: 28, width: 80, background: "#EDE8DF", borderRadius: 6 }} />
          </div>
        </div>
        <div style={{ background: "#FFFFFF", borderRadius: 20, padding: 20, border: "1px solid #E2DBD0" }}>
          <div style={{ height: 5, background: "#EDE8DF", borderRadius: 99 }} />
        </div>
        {[0, 1].map(i => (
          <div key={i} style={{ background: "#FFFFFF", borderRadius: 20, padding: 20, border: "1px solid #E2DBD0" }}>
            <div style={{ height: 10, width: 120, background: "#EDE8DF", borderRadius: 6, marginBottom: 16 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
              {Array.from({ length: i === 0 ? 39 : 27 }).map((_, j) => (
                <div key={j} style={{ aspectRatio: "1", borderRadius: 8, background: "#EDE8DF" }} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}} div{animation:pulse 1.5s ease-in-out infinite}`}</style>
    </div>
  );
}
