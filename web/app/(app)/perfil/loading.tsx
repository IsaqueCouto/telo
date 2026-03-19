export default function Loading() {
  return (
    <div style={{ background: "#F7F3EE", minHeight: "100vh" }}>
      <div style={{ padding: "calc(env(safe-area-inset-top) + 44px) 24px 18px" }}>
        <div style={{ height: 10, width: 50, background: "#EDE8DF", borderRadius: 6, marginBottom: 8 }} />
        <div style={{ height: 34, width: 120, background: "#EDE8DF", borderRadius: 8 }} />
      </div>
      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ background: "#FFFFFF", borderRadius: 20, padding: 22, border: "1px solid #E2DBD0" }}>
          <div style={{ height: 20, width: 120, background: "#EDE8DF", borderRadius: 6, marginBottom: 16 }} />
          <div style={{ height: 10, width: "80%", background: "#EDE8DF", borderRadius: 6 }} />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} style={{ background: "#FFFFFF", borderRadius: 16, padding: "18px 20px", border: "1px solid #E2DBD0", display: "flex", justifyContent: "space-between" }}>
            <div style={{ height: 14, width: 100, background: "#EDE8DF", borderRadius: 6 }} />
            <div style={{ height: 14, width: 80, background: "#EDE8DF", borderRadius: 6 }} />
          </div>
        ))}
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}} div{animation:pulse 1.5s ease-in-out infinite}`}</style>
    </div>
  );
}
