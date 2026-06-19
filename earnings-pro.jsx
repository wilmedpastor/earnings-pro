import { useState, useEffect } from "react";

// ── Design Tokens ──────────────────────────────────────────────────────────────
const C = {
  bg: "#0b1326",
  surface: "#111c30",
  card: "#152038",
  border: "#1e2f48",
  primary: "#10b981",
  primaryDim: "#0d9668",
  text: "#e2eaf6",
  muted: "#6b80a0",
  orange: "#f59e0b",
  red: "#ef4444",
  uber: "#000000",
  didi: "#ff5500",
};

// ── Helpers ────────────────────────────────────────────────────────────────────
const fmt = (n, currency = "$") => `${currency}${Number(n).toFixed(2)}`;
const pct = (v, t) => Math.min(100, (v / t) * 100).toFixed(0);

// ── Mock Data ──────────────────────────────────────────────────────────────────
const TRIPS = [
  { id: 1, platform: "Uber", type: "UberX", time: "14:25", amount: 185, km: 8.2, min: 22, surge: 1.0, efficiency: 94, date: "HOY" },
  { id: 2, platform: "DiDi", type: "DiDi Express", time: "13:05", amount: 210.5, km: 12.2, min: 35, surge: 1.0, efficiency: 82, date: "HOY" },
  { id: 3, platform: "Uber", type: "Uber Comfort", time: "12:45", amount: 342.1, km: 12.8, min: 38, surge: 1.8, efficiency: 98, date: "HOY" },
  { id: 4, platform: "DiDi", type: "DiDi Economy", time: "11:20", amount: 68, km: 2.9, min: 9, surge: 1.0, efficiency: 45, date: "HOY" },
  { id: 5, platform: "Uber", type: "UberXL", time: "22:45", amount: 340, km: 15.0, min: 42, surge: 1.4, efficiency: 98, date: "AYER" },
  { id: 6, platform: "DiDi", type: "DiDi Express", time: "21:15", amount: 75.2, km: 5.1, min: 18, surge: 1.0, efficiency: 45, date: "AYER" },
  { id: 7, platform: "Uber", type: "UberX", time: "19:30", amount: 142, km: 9.8, min: 28, surge: 1.0, efficiency: 89, date: "AYER" },
];

const WEEKLY = [820, 950, 620, 780, 1240, 1380, 620];
const DAYS = ["L", "M", "X", "J", "V", "S", "D"];

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = {
  app: {
    background: C.bg,
    minHeight: "100vh",
    maxWidth: 390,
    margin: "0 auto",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    color: C.text,
    position: "relative",
    display: "flex",
    flexDirection: "column",
  },
  scroll: {
    flex: 1,
    overflowY: "auto",
    paddingBottom: 80,
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px 12px",
    borderBottom: `1px solid ${C.border}`,
    position: "sticky",
    top: 0,
    background: C.bg,
    zIndex: 10,
  },
  logo: { display: "flex", alignItems: "center", gap: 10 },
  avatar: {
    width: 36, height: 36, borderRadius: "50%",
    background: `linear-gradient(135deg, ${C.primary}, #059669)`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 14, fontWeight: 700, color: "#fff",
    border: `2px solid ${C.primary}`,
  },
  logoText: { fontSize: 18, fontWeight: 700, color: C.primary },
  bell: {
    width: 36, height: 36, borderRadius: "50%",
    background: C.surface, display: "flex",
    alignItems: "center", justifyContent: "center",
    cursor: "pointer", border: `1px solid ${C.border}`,
  },
  nav: {
    display: "flex",
    position: "fixed",
    bottom: 0, left: "50%",
    transform: "translateX(-50%)",
    width: "100%", maxWidth: 390,
    background: C.surface,
    borderTop: `1px solid ${C.border}`,
    zIndex: 20,
  },
  navItem: {
    flex: 1, display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    padding: "10px 0", cursor: "pointer",
    gap: 4, fontSize: 11, fontWeight: 500,
    color: C.muted, transition: "all .2s",
    border: "none", background: "transparent",
  },
  navItemActive: {
    color: "#fff", background: C.primary,
    borderRadius: 12, margin: "6px 8px",
  },
  card: {
    background: C.card,
    borderRadius: 14,
    padding: "16px",
    border: `1px solid ${C.border}`,
  },
  label: { fontSize: 11, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: .8 },
  h1: { fontSize: 32, fontWeight: 800, color: C.text, lineHeight: 1.1, margin: "4px 0" },
  h2: { fontSize: 22, fontWeight: 700, color: C.text },
  green: { color: C.primary },
  orange: { color: C.orange },
  red: { color: C.red },
  row: { display: "flex", alignItems: "center", gap: 8 },
  between: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  badge: (color = C.primary) => ({
    background: `${color}22`, color, borderRadius: 6,
    padding: "2px 8px", fontSize: 11, fontWeight: 600,
  }),
  pill: {
    background: C.surface, borderRadius: 20,
    padding: "4px 12px", fontSize: 12, color: C.muted,
    border: `1px solid ${C.border}`,
  },
  btn: {
    width: "100%", padding: "16px", borderRadius: 14,
    background: C.primary, color: "#fff",
    border: "none", fontSize: 16, fontWeight: 700,
    cursor: "pointer", display: "flex", alignItems: "center",
    justifyContent: "center", gap: 8, letterSpacing: .3,
  },
  input: {
    width: "100%", background: C.surface, border: `1px solid ${C.border}`,
    borderRadius: 10, padding: "12px 14px", color: C.text,
    fontSize: 16, outline: "none", boxSizing: "border-box",
  },
  progressBar: (val, max) => ({
    height: 6, borderRadius: 3,
    background: C.border, overflow: "hidden",
    position: "relative",
  }),
  progressFill: (val, max, color = C.primary) => ({
    height: "100%", borderRadius: 3,
    background: color,
    width: `${Math.min(100, (val / max) * 100)}%`,
    transition: "width .6s ease",
  }),
  section: { padding: "0 16px", marginBottom: 16 },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  toggle: (on) => ({
    width: 44, height: 24, borderRadius: 12,
    background: on ? C.primary : C.border,
    position: "relative", cursor: "pointer",
    transition: "background .3s", border: "none",
  }),
  toggleDot: (on) => ({
    position: "absolute", top: 2,
    left: on ? 22 : 2, width: 20, height: 20,
    borderRadius: "50%", background: "#fff",
    transition: "left .3s",
  }),
};

// ── SVG Icons ──────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const icons = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
    activity: <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></>,
    shift: <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></>,
    stats: <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    bell: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    trending: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
    car: <><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></>,
    map: <><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></>,
    save: <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></>,
    check: <><polyline points="20 6 9 17 4 12"/></>,
    star: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>,
    edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    gps: <><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></>,
    spark: <><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z"/></>,
    clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    route: <><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5c.8 0 1.5-.7 1.5-1.5v-11c0-.8-.7-1.5-1.5-1.5S16 5.7 16 6.5V19"/><circle cx="6" cy="5" r="3"/></>,
    fuel: <><line x1="3" y1="22" x2="15" y2="22"/><line x1="4" y1="9" x2="14" y2="9"/><path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"/><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"/></>,
    info: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>,
    warning: <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    bolt: <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>,
    pdf: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></>,
    play: <><polygon points="5 3 19 12 5 21 5 3"/></>,
    arrow: <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    back: <><polyline points="15 18 9 12 15 6"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
};

// ── Mini Bar Chart ─────────────────────────────────────────────────────────────
const BarChart = ({ data, labels, highlight = -1, height = 80 }) => {
  const max = Math.max(...data);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, height: "100%" }}>
          <div style={{
            flex: 1, width: "100%", display: "flex", alignItems: "flex-end",
          }}>
            <div style={{
              width: "100%",
              height: `${(v / max) * 100}%`,
              background: i === highlight || highlight === -1 && i === data.length - 1
                ? C.primary : `${C.primary}33`,
              borderRadius: "4px 4px 0 0",
              minHeight: 4,
              transition: "height .5s ease",
            }} />
          </div>
          {labels && <span style={{ fontSize: 10, color: C.muted }}>{labels[i]}</span>}
        </div>
      ))}
    </div>
  );
};

// ── Platform Badge ─────────────────────────────────────────────────────────────
const PlatformIcon = ({ platform, size = 32 }) => {
  const isUber = platform === "Uber";
  return (
    <div style={{
      width: size, height: size, borderRadius: 8,
      background: isUber ? "#000" : C.didi,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.35, fontWeight: 900, color: "#fff",
      flexShrink: 0,
    }}>
      {isUber ? "U" : "D"}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// SCREENS
// ══════════════════════════════════════════════════════════════════════════════

// ── Dashboard ──────────────────────────────────────────────────────────────────
const DashboardScreen = () => {
  const gross = 1450.5;
  const tax = gross * 0.11;
  const net = gross - tax;
  const goal = 2000;
  const goalPct = pct(gross, goal);
  const uberEarnings = 820;
  const diDiEarnings = 630.5;

  return (
    <div style={{ padding: "16px" }}>
      {/* Earnings Card */}
      <div style={{ ...styles.card, marginBottom: 12 }}>
        <div style={styles.label}>Ganancias de hoy (AUD)</div>
        <div style={{ ...styles.row, justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>AUD</div>
            <div style={{ fontSize: 36, fontWeight: 800, color: C.primary, lineHeight: 1 }}>
              ${gross.toFixed(2)}
            </div>
          </div>
          <div style={{ ...styles.badge(C.primary), fontSize: 12, padding: "4px 10px" }}>
            ↗ +12% vs ayer
          </div>
        </div>
        <div style={{ ...styles.row, marginTop: 10, gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: C.red }}>Tax Estimate (11%)</div>
            <div style={{ fontSize: 13, color: C.red, fontWeight: 700 }}>-AUD ${tax.toFixed(2)}</div>
          </div>
          <div style={{ width: 1, height: 32, background: C.border }} />
          <div>
            <div style={{ fontSize: 11, color: C.muted }}>Net Take-home</div>
            <div style={{ fontSize: 15, color: C.text, fontWeight: 700 }}>AUD ${net.toFixed(2)}</div>
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <BarChart data={[320, 480, 620, 580, 750, 820, 1450]} height={60} />
        </div>
      </div>

      {/* Daily Goal */}
      <div style={{ ...styles.card, marginBottom: 12 }}>
        <div style={{ ...styles.between, marginBottom: 8 }}>
          <div style={styles.row}>
            <Icon name="trending" size={16} color={C.primary} />
            <span style={{ fontSize: 14, fontWeight: 600 }}>Meta Diaria</span>
          </div>
          <span style={{ fontSize: 13, color: C.muted }}>{goalPct}% completado</span>
        </div>
        <div style={styles.progressBar()}>
          <div style={styles.progressFill(gross, goal)} />
        </div>
        <div style={{ ...styles.between, marginTop: 6 }}>
          <span style={{ fontSize: 12, color: C.muted }}>AUD ${gross} / ${goal}.00</span>
          <span style={{ fontSize: 12, color: C.orange }}>Faltan ${(goal - gross).toFixed(2)}</span>
        </div>
      </div>

      {/* GPS */}
      <div style={{ ...styles.card, ...styles.row, marginBottom: 12, gap: 10 }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.primary, boxShadow: `0 0 8px ${C.primary}` }} />
        <span style={{ fontSize: 14, fontWeight: 600 }}>GPS Activo • Buena señal</span>
        <div style={{ marginLeft: "auto", ...styles.row, gap: 6 }}>
          <Icon name="car" size={14} color={C.primary} />
          <span style={{ fontSize: 12, color: C.primary }}>Toyota Camry</span>
        </div>
      </div>

      {/* Platform Cards */}
      <div style={{ ...styles.grid2, marginBottom: 12 }}>
        {[
          { platform: "Uber", amount: uberEarnings, trips: 8 },
          { platform: "DiDi", amount: diDiEarnings, trips: 6 },
        ].map(p => (
          <div key={p.platform} style={styles.card}>
            <div style={styles.row}>
              <PlatformIcon platform={p.platform} size={24} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>{p.platform}</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.text, marginTop: 8 }}>
              AUD ${p.amount}
            </div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{p.trips} viajes realizados</div>
          </div>
        ))}
      </div>

      {/* Stats Grid */}
      <div style={{ ...styles.grid2, marginBottom: 12 }}>
        {[
          { icon: "clock", label: "Conexión", value: "5h 42m" },
          { icon: "route", label: "Km Recorridos", value: "124.8 km" },
        ].map(s => (
          <div key={s.label} style={styles.card}>
            <Icon name={s.icon} size={18} color={C.primary} />
            <div style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>{s.label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Demand Zone */}
      <div style={{ ...styles.card, marginBottom: 12, background: `linear-gradient(135deg, #0f1f38, #152038)`, overflow: "hidden", position: "relative" }}>
        <div style={{
          position: "absolute", inset: 0, opacity: .15,
          background: "radial-gradient(circle at 60% 50%, #ff4400 0%, transparent 60%), radial-gradient(circle at 30% 50%, #10b981 0%, transparent 50%)",
        }} />
        <div style={{ position: "relative" }}>
          <div style={{ ...styles.label, color: C.primary }}>Zona de Alta Demanda</div>
          <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}>
            Polanco • <span style={{ color: C.primary }}>Multiplicador 1.8x</span>
          </div>
          <div style={{ marginTop: 4 }}>
            <Icon name="trending" size={16} color={C.primary} />
          </div>
        </div>
      </div>

      {/* Odometer Input */}
      <div style={{ ...styles.card, marginBottom: 16 }}>
        <div style={styles.row}>
          <Icon name="route" size={16} color={C.primary} />
          <span style={{ fontSize: 13, color: C.muted }}>Kilometraje Inicial</span>
        </div>
        <div style={{ ...styles.row, marginTop: 10, gap: 10 }}>
          <input style={{ ...styles.input, flex: 1 }} placeholder="Ej: 124,800" type="number" />
          <span style={{ color: C.muted, fontSize: 14 }}>km</span>
        </div>
      </div>

      {/* CTA */}
      <button style={styles.btn}>
        <Icon name="play" size={18} color="#fff" /> Iniciar Jornada
      </button>
      <p style={{ textAlign: "center", color: C.muted, fontSize: 12, marginTop: 8 }}>
        Estás en modo offline. Toca para conectar.
      </p>
    </div>
  );
};

// ── Activity ───────────────────────────────────────────────────────────────────
const ActivityScreen = () => {
  const [period, setPeriod] = useState("Hoy");
  const totalToday = TRIPS.filter(t => t.date === "HOY").reduce((s, t) => s + t.amount, 0);

  const grouped = TRIPS.reduce((acc, t) => {
    if (!acc[t.date]) acc[t.date] = [];
    acc[t.date].push(t);
    return acc;
  }, {});

  return (
    <div>
      {/* Period Tabs */}
      <div style={{ padding: "12px 16px 0" }}>
        <div style={{ display: "flex", background: C.surface, borderRadius: 12, padding: 4, gap: 4, border: `1px solid ${C.border}` }}>
          {["Hoy", "Semana", "Mes"].map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              flex: 1, padding: "8px 0", borderRadius: 9,
              border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600,
              background: period === p ? C.primary : "transparent",
              color: period === p ? "#fff" : C.muted,
              transition: "all .2s",
            }}>{p}</button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div style={{ padding: "12px 16px" }}>
        <div style={styles.card}>
          <div style={styles.label}>Ganancias de hoy</div>
          <div style={{ ...styles.row, justifyContent: "space-between" }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: C.primary }}>${totalToday.toFixed(2)}</div>
            <div style={{ ...styles.badge(C.primary) }}>↗ +12%</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ padding: "0 16px 8px" }}>
        <div style={{ ...styles.between, marginBottom: 8 }}>
          <span style={{ fontSize: 16, fontWeight: 700 }}>Filtros de Actividad</span>
          <span style={{ color: C.primary, fontSize: 13, cursor: "pointer" }}>Limpiar</span>
        </div>
        <div style={{ ...styles.row, gap: 8, overflowX: "auto", paddingBottom: 4 }}>
          <div style={styles.pill}>📅 Esta Semana</div>
          <div style={styles.pill}>🚗 Toyota Prius (ABC-12...</div>
        </div>
      </div>

      {/* Trips Grouped */}
      {Object.entries(grouped).map(([date, trips]) => (
        <div key={date} style={{ padding: "0 16px" }}>
          <div style={{ ...styles.label, marginBottom: 8, marginTop: 4 }}>{date}, {date === "HOY" ? "14 OCT" : "13 OCT"}</div>
          {trips.map(trip => (
            <div key={trip.id} style={{ ...styles.card, marginBottom: 10 }}>
              <div style={styles.between}>
                <div style={styles.row}>
                  <PlatformIcon platform={trip.platform} size={36} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>
                      {trip.type}
                      {trip.surge > 1 && (
                        <span style={{ ...styles.badge(C.orange), marginLeft: 8, fontSize: 10 }}>{trip.surge}x Surge</span>
                      )}
                    </div>
                    <div style={{ color: C.muted, fontSize: 12 }}>{trip.time} • {trip.km} km</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 800, color: C.primary, fontSize: 16 }}>${trip.amount.toFixed(2)}</div>
                  <div style={{ fontSize: 11, color: trip.efficiency >= 80 ? C.primary : C.orange }}>
                    Eficiencia: {trip.efficiency}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

// ── Shift / Cierre de Jornada ──────────────────────────────────────────────────
const ShiftScreen = () => {
  const [fuel, setFuel] = useState("");
  const [tolls, setTolls] = useState("");
  const [finalKm, setFinalKm] = useState("");
  const [saved, setSaved] = useState(false);

  const gross = 342.5;
  const taxRate = 0.11;
  const fuelVal = parseFloat(fuel) || 0;
  const tollsVal = parseFloat(tolls) || 0;
  const totalExpenses = fuelVal + tollsVal + 45;
  const taxes = gross * taxRate;
  const net = gross - totalExpenses - taxes;
  const goalMet = net >= 250;

  return (
    <div style={{ padding: "16px" }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 26, fontWeight: 800 }}>Cierre de Jornada</div>
        <div style={{ color: C.muted, fontSize: 13 }}>Revisa tus números y guarda el progreso de hoy.</div>
      </div>

      {/* Expenses */}
      <div style={{ ...styles.card, marginBottom: 12 }}>
        <div style={{ ...styles.row, marginBottom: 12 }}>
          <Icon name="fuel" size={16} color={C.primary} />
          <span style={{ fontSize: 12, fontWeight: 700, color: C.primary, textTransform: "uppercase", letterSpacing: .8 }}>
            Ingresar Gastos del Día (AUD)
          </span>
        </div>
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 6 }}>Combustible</div>
          <div style={{ ...styles.row, gap: 8 }}>
            <span style={{ color: C.muted }}>A$</span>
            <input style={{ ...styles.input, flex: 1 }} value={fuel}
              onChange={e => setFuel(e.target.value)} placeholder="0.00" type="number" />
          </div>
        </div>
        <div>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 6 }}>Peajes / Otros</div>
          <div style={{ ...styles.row, gap: 8 }}>
            <span style={{ color: C.muted }}>A$</span>
            <input style={{ ...styles.input, flex: 1 }} value={tolls}
              onChange={e => setTolls(e.target.value)} placeholder="0.00" type="number" />
          </div>
        </div>
      </div>

      {/* KM */}
      <div style={{ ...styles.card, marginBottom: 12 }}>
        <div style={{ ...styles.row, marginBottom: 12 }}>
          <Icon name="route" size={16} color={C.primary} />
          <span style={{ fontSize: 12, fontWeight: 700, color: C.primary, textTransform: "uppercase", letterSpacing: .8 }}>
            Registrar Kilometraje (KM)
          </span>
        </div>
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 6 }}>Kilometraje Final</div>
        <div style={{ ...styles.row, gap: 8 }}>
          <span style={{ color: C.muted }}>KM</span>
          <input style={{ ...styles.input, flex: 1 }} value={finalKm}
            onChange={e => setFinalKm(e.target.value)} placeholder="0.00" type="number" />
        </div>
      </div>

      {/* Summary Rows */}
      {[
        { label: "Ganancia Bruta", value: `A$${gross.toFixed(2)}`, sub: "↗ +12% vs ayer", subColor: C.primary },
        { label: "Gastos Totales", value: `A$${totalExpenses.toFixed(2)}`, sub: "Estimado hoy", valueColor: C.orange },
        { label: `Impuestos Estimados (${(taxRate * 100).toFixed(0)}%)`, value: `A$${taxes.toFixed(2)}`, sub: "Reserva sugerida", valueColor: C.orange },
      ].map(row => (
        <div key={row.label} style={{ ...styles.card, ...styles.between, marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{row.label}</div>
            {row.sub && <div style={{ fontSize: 12, color: row.subColor || C.muted }}>{row.sub}</div>}
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: row.valueColor || C.text }}>{row.value}</div>
        </div>
      ))}

      {/* Net Total */}
      <div style={{
        ...styles.card, marginBottom: 12, textAlign: "center",
        border: `2px solid ${C.primary}`,
        background: `linear-gradient(135deg, #0d2a1f, #152038)`,
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.primary, textTransform: "uppercase", letterSpacing: 1 }}>
          Ganancia Neta Total
        </div>
        <div style={{ fontSize: 36, fontWeight: 900, color: C.primary, margin: "8px 0" }}>
          A${net.toFixed(2)}
        </div>
        {goalMet && (
          <div style={{ ...styles.badge(C.primary), display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", fontSize: 13 }}>
            <Icon name="check" size={14} color={C.primary} /> Meta diaria alcanzada
          </div>
        )}
      </div>

      {/* Efficiency Summary */}
      <div style={{ fontSize: 13, fontWeight: 700, color: C.muted, marginBottom: 8, textTransform: "uppercase", letterSpacing: .8 }}>
        Resumen de Eficiencia
      </div>
      <div style={{ ...styles.grid2, marginBottom: 12 }}>
        {[
          { label: "Vehículo", value: "Toyota Camry", sub: "+5% vs promedio", subColor: C.primary },
          { label: "KM Recorridos", value: "142.5 km", sub: "" },
          { label: "Ingreso / KM", value: "A$2.40", sub: "" },
          { label: "Ingreso / Hora", value: "A$42.80", sub: "Basado en 8h 00m", subColor: C.muted },
        ].map(s => (
          <div key={s.label} style={styles.card}>
            <div style={{ fontSize: 11, color: C.muted }}>{s.label}</div>
            <div style={{ fontSize: 16, fontWeight: 800, marginTop: 4 }}>{s.value}</div>
            {s.sub && <div style={{ fontSize: 11, color: s.subColor || C.muted }}>{s.sub}</div>}
          </div>
        ))}
      </div>

      <button style={styles.btn} onClick={() => setSaved(true)}>
        <Icon name="save" size={18} color="#fff" />
        {saved ? "¡Jornada Guardada!" : "Cerrar Jornada y Guardar"}
      </button>
      <p style={{ textAlign: "center", color: C.muted, fontSize: 11, marginTop: 8 }}>
        Al guardar, se finalizará el registro de hoy y se enviará el reporte a tu correo.
      </p>
    </div>
  );
};

// ── Stats ──────────────────────────────────────────────────────────────────────
const StatsScreen = () => {
  const [view, setView] = useState("weekly");

  const dayStats = [
    { day: "Sábado (Pico)", trips: "6.4 viajes/hora", hours: "8.5h", amount: 342.1 },
    { day: "Viernes", trips: "5.2 viajes/hora", hours: "7.2h", amount: 298.45 },
    { day: "Miércoles", trips: "4.1 viajes/hora", hours: "6.0h", amount: 185.2 },
  ];

  const vehicles = [
    { name: "Tesla Model 3", type: "ELECTRIC • ELITE TIER", rate: 2.15, perf: "+18.2%", positive: true },
    { name: "Toyota Camry", type: "HYBRID • COMFORT TIER", rate: 1.55, perf: "-4.5%", positive: false },
    { name: "Honda Accord", type: "GAS • STANDARD TIER", rate: 1.82, perf: "+0.8%", positive: true },
  ];

  return (
    <div style={{ padding: "16px" }}>
      <div style={{ fontSize: 26, fontWeight: 800, marginBottom: 16 }}>Stats</div>

      {/* KPIs */}
      <div style={{ ...styles.card, marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: C.muted }}>
          <Icon name="clock" size={14} color={C.primary} /> Eficiencia (Ingresos/Hora)
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, color: C.text, margin: "4px 0" }}>
          $34.50 <span style={{ fontSize: 14, color: C.primary }}>+12% vs sem. pasada</span>
        </div>
        <div style={styles.progressBar()}>
          <div style={styles.progressFill(34.5, 50)} />
        </div>
      </div>

      <div style={{ ...styles.card, marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: C.muted }}>
          <Icon name="route" size={14} color={C.primary} /> Rentabilidad Promedio/KM
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, marginTop: 4 }}>$1.85 <span style={{ fontSize: 14, color: C.muted }}>Global</span></div>
        <div style={{ ...styles.row, gap: 8, marginTop: 10 }}>
          {[85, 92, 78, 95].map((v, i) => (
            <div key={i} style={{ flex: 1, height: 8, borderRadius: 4, background: C.primary, opacity: 0.3 + (v / 100) * 0.7 }} />
          ))}
        </div>
      </div>

      {/* Weekly Chart */}
      <div style={{ ...styles.card, marginBottom: 12 }}>
        <div style={{ ...styles.between, marginBottom: 12 }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Tendencia Semanal</div>
          <div style={styles.pill}>Últimos 7 días</div>
        </div>
        <BarChart data={WEEKLY} labels={DAYS} highlight={4} height={100} />
        <div style={{ ...styles.card, marginTop: 12, background: `${C.orange}11`, border: `1px solid ${C.orange}33` }}>
          <div style={{ ...styles.row, gap: 8 }}>
            <Icon name="spark" size={16} color={C.orange} />
            <div>
              <div style={{ fontSize: 12, color: C.orange, fontWeight: 700 }}>Optimización de Tiempo</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                Tus ingresos aumentan un <span style={{ color: C.orange }}>35%</span> los viernes y sábados entre las 20:00 y 23:00.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Day Analysis */}
      <div style={{ fontSize: 13, fontWeight: 700, color: C.muted, marginBottom: 8, textTransform: "uppercase", letterSpacing: .8 }}>
        Análisis por Día
      </div>
      {dayStats.map(d => (
        <div key={d.day} style={{ ...styles.card, ...styles.between, marginBottom: 10 }}>
          <div style={{ ...styles.row, gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `${C.primary}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="dashboard" size={16} color={C.primary} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{d.day}</div>
              <div style={{ fontSize: 12, color: C.muted }}>{d.trips} {d.hours} conectadas</div>
            </div>
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.primary }}>${d.amount.toFixed(2)}</div>
        </div>
      ))}

      {/* Vehicles */}
      <div style={{ fontSize: 13, fontWeight: 700, color: C.muted, marginBottom: 8, marginTop: 4, textTransform: "uppercase", letterSpacing: .8 }}>
        Rendimiento por Vehículo
      </div>
      {vehicles.map(v => (
        <div key={v.name} style={{ ...styles.card, ...styles.between, marginBottom: 10, borderLeft: `3px solid ${v.positive ? C.primary : C.red}` }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{v.name}</div>
            <div style={{ fontSize: 11, color: C.muted }}>{v.type}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: v.positive ? C.primary : C.red }}>↗ ${v.rate}/km</div>
            <div style={{ fontSize: 12, color: v.positive ? C.primary : C.red }}>Rendimiento: {v.perf}</div>
          </div>
        </div>
      ))}

      {/* Bonuses */}
      <div style={{ ...styles.grid2, marginBottom: 12 }}>
        <div style={{ ...styles.card, borderLeft: `3px solid ${C.primary}` }}>
          <div style={{ fontSize: 11, color: C.muted }}>Surge Bonus</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.primary }}>+$142.50</div>
          <div style={{ fontSize: 11, color: C.orange }}>⚡ 24 horas activas</div>
        </div>
        <div style={{ ...styles.card, borderLeft: `3px solid ${C.red}` }}>
          <div style={{ fontSize: 11, color: C.muted }}>Gastos Operativos</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.red }}>-$84.20</div>
          <div style={{ fontSize: 11, color: C.muted }}>🔧 Mantenimiento & Comb.</div>
        </div>
      </div>

      {/* Weekly Summary */}
      <div style={{ ...styles.card, marginBottom: 12 }}>
        <div style={{ ...styles.between, marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>Resumen Semanal</div>
            <div style={{ fontSize: 12, color: C.muted }}>14 Oct - 20 Oct, 2024</div>
          </div>
          <div style={{ ...styles.badge(C.primary) }}>Semana 42</div>
        </div>
        <div style={{ fontSize: 11, color: C.muted }}>Total a cobrar</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: C.primary }}>$12,840.50</div>
        <div style={{ ...styles.badge(C.primary), display: "inline-flex", marginTop: 4 }}>↗ +12%</div>
        <div style={{ marginTop: 12 }}>
          <div style={styles.progressBar()}>
            <div style={styles.progressFill(12840.5, 15000)} />
          </div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>Meta Semanal</div>
        </div>

        {/* Platform breakdown */}
        {[
          { platform: "Uber", close: "Lun 4:00 AM", pay: "Martes", net: 7420, trips: 48, hours: "32h 15m" },
          { platform: "DiDi", close: "Dom 12:00 AM", pay: "Lunes", net: 5420.5, trips: 34, hours: "22h 40m" },
        ].map(p => (
          <div key={p.platform} style={{ ...styles.card, marginTop: 10 }}>
            <div style={{ ...styles.between, marginBottom: 8 }}>
              <div style={styles.row}>
                <PlatformIcon platform={p.platform} size={28} />
                <span style={{ fontWeight: 700 }}>{p.platform}</span>
              </div>
              <div style={{ ...styles.badge(C.muted), fontSize: 11 }}>Pago: {p.pay}</div>
            </div>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 8 }}>Cierre: {p.close}</div>
            <div style={{ ...styles.between }}>
              <div>
                <div style={{ fontSize: 11, color: C.muted }}>Ingresos netos</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: C.primary }}>${p.net.toFixed(2)}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: C.muted }}>Viajes / Horas</div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{p.trips} / {p.hours}</div>
              </div>
            </div>
          </div>
        ))}

        {/* Bar chart comparison */}
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
            Desempeño Diario
            <span style={{ ...styles.badge(C.primary), marginLeft: 8, fontSize: 11 }}>● Uber</span>
            <span style={{ ...styles.badge("#60a5fa"), marginLeft: 4, fontSize: 11 }}>● DiDi</span>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 80 }}>
            {DAYS.map((d, i) => (
              <div key={d} style={{ flex: 1, display: "flex", gap: 2, alignItems: "flex-end", height: "100%" }}>
                <div style={{ flex: 1, height: `${60 + Math.sin(i) * 30}%`, background: C.primary, borderRadius: "3px 3px 0 0", opacity: .85 }} />
                <div style={{ flex: 1, height: `${40 + Math.cos(i) * 25}%`, background: "#60a5fa", borderRadius: "3px 3px 0 0", opacity: .75 }} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {DAYS.map(d => <div key={d} style={{ flex: 1, textAlign: "center", fontSize: 10, color: C.muted, marginTop: 4 }}>{d}</div>)}
          </div>
        </div>
      </div>

      <button style={styles.btn}>
        <Icon name="pdf" size={18} color="#fff" /> Exportar Detalle PDF
      </button>
    </div>
  );
};

// ── Onboarding ─────────────────────────────────────────────────────────────────
const OnboardingScreen = ({ onDone }) => {
  const [step, setStep] = useState(1);
  const [country, setCountry] = useState("Australia");
  const [taxRate, setTaxRate] = useState("11");
  const [vehicle, setVehicle] = useState("");
  const [plate, setPlate] = useState("");
  const [year, setYear] = useState("2024");

  const steps = [
    {
      title: "Bienvenido a", highlight: "Earnings Pro",
      sub: "Configura tu cuenta en 3 pasos para empezar a optimizar tus ganancias.",
      content: (
        <div style={{ ...styles.card, ...styles.row }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: `${C.primary}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="stats" size={20} color={C.primary} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Maximiza Ingresos</div>
            <div style={{ fontSize: 12, color: C.muted }}>Algoritmos inteligentes que encuentran las mejores zonas.</div>
          </div>
        </div>
      ),
    },
    {
      title: "Localización e", highlight: "Impuestos",
      sub: "Ajustamos los cálculos según tu región.",
      content: (
        <div style={styles.card}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>País de Residencia</div>
          <select style={{ ...styles.input, marginBottom: 12 }} value={country} onChange={e => setCountry(e.target.value)}>
            {["Australia", "México", "Colombia", "Argentina", "España"].map(c => <option key={c}>{c}</option>)}
          </select>
          <div style={styles.grid2}>
            <div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>Moneda</div>
              <div style={{ ...styles.input, color: C.primary, fontWeight: 700 }}>AUD ($)</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>Tasa de Impuesto</div>
              <div style={{ ...styles.row, gap: 4 }}>
                <input style={styles.input} value={taxRate} onChange={e => setTaxRate(e.target.value)} type="number" />
                <span style={{ color: C.muted }}>%</span>
              </div>
            </div>
          </div>
          <div style={{ ...styles.card, marginTop: 10, background: `${C.primary}11` }}>
            <div style={{ ...styles.row, gap: 8 }}>
              <Icon name="info" size={16} color={C.primary} />
              <div style={{ fontSize: 12, color: C.primary }}>Esto ayudará a calcular tu ingreso neto real</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Tu Primer", highlight: "Vehículo",
      sub: "Registra el auto que usarás hoy para comenzar a generar ganancias.",
      content: (
        <div style={styles.card}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Marca y Modelo</div>
          <input style={{ ...styles.input, marginBottom: 12 }} value={vehicle} onChange={e => setVehicle(e.target.value)} placeholder="Ej: Toyota Corolla" />
          <div style={styles.grid2}>
            <div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>Placa / Matrícula</div>
              <input style={styles.input} value={plate} onChange={e => setPlate(e.target.value)} placeholder="ABC-123" />
            </div>
            <div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>Año</div>
              <input style={styles.input} value={year} onChange={e => setYear(e.target.value)} type="number" placeholder="2024" />
            </div>
          </div>
          <div style={{ ...styles.card, marginTop: 10, background: `${C.primary}11` }}>
            <div style={{ ...styles.row, gap: 8 }}>
              <Icon name="info" size={16} color={C.primary} />
              <div style={{ fontSize: 12, color: C.primary }}>
                <b>Verificación rápida</b><br />
                <span style={{ color: C.muted }}>Asegúrate de que los datos coincidan exactamente con tu tarjeta de circulación.</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const current = steps[step - 1];

  return (
    <div style={{ padding: "24px 20px", display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ ...styles.between, marginBottom: 16 }}>
        {step > 1 && (
          <button onClick={() => setStep(s => s - 1)} style={{ background: "none", border: "none", cursor: "pointer", color: C.primary }}>
            <Icon name="back" size={20} color={C.primary} />
          </button>
        )}
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 13, color: C.muted, fontWeight: 600 }}>Paso {step} de {steps.length + 1}</span>
      </div>

      {/* Progress */}
      <div style={{ ...styles.progressBar(), marginBottom: 20 }}>
        <div style={styles.progressFill(step, steps.length + 1)} />
      </div>

      {/* Hero image placeholder */}
      <div style={{
        borderRadius: 16, height: 160, marginBottom: 20,
        background: `linear-gradient(135deg, #0f1f38, #1a2f50)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        border: `1px solid ${C.border}`,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 80%, #10b98122, transparent 60%)" }} />
        <div style={{ fontSize: 48 }}>
          {step === 1 ? "🚗" : step === 2 ? "🌏" : "🚘"}
        </div>
        <div style={{ position: "absolute", bottom: 12, left: 12, ...styles.badge(C.primary), display: "flex", alignItems: "center", gap: 6 }}>
          <Icon name="check" size={12} color={C.primary} /> Status: Ready
        </div>
      </div>

      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: C.primary, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
          Paso {step} de {steps.length + 1}
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.2 }}>
          {current.title} <span style={{ color: C.primary }}>{current.highlight}</span>
        </div>
        <div style={{ fontSize: 14, color: C.muted, marginTop: 8 }}>{current.sub}</div>
      </div>

      {current.content}

      <div style={{ flex: 1 }} />

      <button style={{ ...styles.btn, marginTop: 20 }} onClick={() => step < steps.length ? setStep(s => s + 1) : onDone()}>
        {step < steps.length ? "Continuar" : "¡Comenzar!"} <Icon name="arrow" size={18} color="#fff" />
      </button>
      {step === 1 && (
        <p onClick={onDone} style={{ textAlign: "center", color: C.muted, fontSize: 13, marginTop: 12, cursor: "pointer" }}>
          Omitir por ahora
        </p>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════════════════════
export default function EarningsPro() {
  const [screen, setScreen] = useState("onboarding");
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "activity", label: "Activity", icon: "activity" },
    { id: "shift", label: "Shift", icon: "shift" },
    { id: "stats", label: "Stats", icon: "stats" },
  ];

  if (screen === "onboarding") {
    return (
      <div style={{ ...styles.app, background: C.bg }}>
        <div style={styles.topBar}>
          <div style={styles.logo}>
            <Icon name="trending" size={20} color={C.primary} />
            <span style={styles.logoText}>Earnings Pro</span>
          </div>
          <button style={{ ...styles.bell, background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 13, fontWeight: 600 }}>?</button>
        </div>
        <div style={styles.scroll}>
          <OnboardingScreen onDone={() => setScreen("main")} />
        </div>
      </div>
    );
  }

  const renderScreen = () => {
    switch (activeTab) {
      case "dashboard": return <DashboardScreen />;
      case "activity": return <ActivityScreen />;
      case "shift": return <ShiftScreen />;
      case "stats": return <StatsScreen />;
      default: return <DashboardScreen />;
    }
  };

  return (
    <div style={styles.app}>
      {/* Top Bar */}
      <div style={styles.topBar}>
        <div style={styles.logo}>
          <div style={styles.avatar}>EP</div>
          <span style={styles.logoText}>Earnings Pro</span>
        </div>
        <button style={styles.bell}>
          <Icon name="bell" size={18} color={C.muted} />
        </button>
      </div>

      {/* Screen Content */}
      <div style={styles.scroll}>
        {renderScreen()}
      </div>

      {/* Bottom Nav */}
      <nav style={styles.nav}>
        {tabs.map(tab => {
          const active = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ ...styles.navItem, ...(active ? styles.navItemActive : {}) }}>
              <Icon name={tab.icon} size={20} color={active ? "#fff" : C.muted} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
