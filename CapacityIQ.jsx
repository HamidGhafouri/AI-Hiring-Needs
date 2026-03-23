import { useState, useRef, useEffect } from "react";
import {
    AreaChart, Area, BarChart, Bar, Cell,
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer
} from "recharts";

// ─── CORPORATE DEPARTMENTS (13) ───────────────────────────────────────────────
const DEPT_DATA = [
    { id: 1, abbr: "AcctAP", name: "Accounting & Finance – AP", current: 5, proj2028: 8, risk: "medium", kpi: "Invoice volume & entity count", color: "#3b82f6", autoSavings: 1 },
    { id: 2, abbr: "AcctPay", name: "Accounting & Finance – FS/Payroll", current: 4, proj2028: 6, risk: "medium", kpi: "Total payroll headcount", color: "#f59e0b", autoSavings: 1 },
    { id: 3, abbr: "AdminPC", name: "Admin – Project Coordinator", current: 6, proj2028: 9, risk: "high", kpi: "Active project count & admin workload", color: "#8b5cf6", autoSavings: 1 },
    { id: 4, abbr: "BizDev", name: "Business Development", current: 4, proj2028: 7, risk: "high", kpi: "Proposal volume & market win rate", color: "#10b981", autoSavings: 1 },
    { id: 5, abbr: "Equip", name: "Equipment Department", current: 8, proj2028: 12, risk: "high", kpi: "Fleet size & asset utilization rate", color: "#ef4444", autoSavings: 2 },
    { id: 6, abbr: "HR", name: "Human Resources", current: 6, proj2028: 10, risk: "high", kpi: "Total employee headcount", color: "#06b6d4", autoSavings: 1 },
    { id: 7, abbr: "IT", name: "Information Technology", current: 12, proj2028: 18, risk: "high", kpi: "User count & digital complexity", color: "#f97316", autoSavings: 3 },
    { id: 8, abbr: "Mktg", name: "Marketing – Corp. Communications", current: 4, proj2028: 6, risk: "low", kpi: "Brand initiatives & proposal volume", color: "#ec4899", autoSavings: 1 },
    { id: 9, abbr: "Training", name: "Training & Development", current: 3, proj2028: 6, risk: "medium", kpi: "New hire volume & compliance requirements", color: "#84cc16", autoSavings: 1 },
    { id: 10, abbr: "Recruiting", name: "Recruiting", current: 4, proj2028: 7, risk: "high", kpi: "Open positions & time-to-fill rate", color: "#a855f7", autoSavings: 1 },
    { id: 11, abbr: "BondsIns", name: "Bonds & Insurance", current: 3, proj2028: 5, risk: "low", kpi: "Contract value & project risk exposure", color: "#14b8a6", autoSavings: 1 },
    { id: 12, abbr: "Safety", name: "Safety", current: 5, proj2028: 8, risk: "medium", kpi: "Field employee ratio & incident rate", color: "#f43f5e", autoSavings: 1 },
    { id: 13, abbr: "Legal", name: "Legal", current: 4, proj2028: 6, risk: "low", kpi: "Contract volume & regulatory complexity", color: "#6366f1", autoSavings: 1 },
];

// ─── CORPORATE 5-YEAR BASE PROJECTIONS ────────────────────────────────────────
const BASE_PROJ = [
    { year: "2026", AcctAP: 5, AcctPay: 4, AdminPC: 6, BizDev: 4, Equip: 8, HR: 6, IT: 12, Mktg: 4, Training: 3, Recruiting: 4, BondsIns: 3, Safety: 5, Legal: 4 },
    { year: "2027", AcctAP: 5, AcctPay: 4, AdminPC: 7, BizDev: 5, Equip: 9, HR: 7, IT: 14, Mktg: 4, Training: 4, Recruiting: 5, BondsIns: 3, Safety: 6, Legal: 4 },
    { year: "2028", AcctAP: 6, AcctPay: 5, AdminPC: 7, BizDev: 5, Equip: 10, HR: 8, IT: 15, Mktg: 5, Training: 5, Recruiting: 5, BondsIns: 4, Safety: 6, Legal: 5 },
    { year: "2029", AcctAP: 7, AcctPay: 5, AdminPC: 8, BizDev: 6, Equip: 11, HR: 9, IT: 17, Mktg: 5, Training: 5, Recruiting: 6, BondsIns: 4, Safety: 7, Legal: 5 },
    { year: "2030", AcctAP: 8, AcctPay: 6, AdminPC: 9, BizDev: 7, Equip: 12, HR: 10, IT: 18, Mktg: 6, Training: 6, Recruiting: 7, BondsIns: 5, Safety: 8, Legal: 6 },
];

// ─── FINANCIAL PROJECTIONS ────────────────────────────────────────────────────
const FINANCIAL_PROJ = [
    { year: "2026", revenue: 820, backlog: 1600, headcount: 1820 },
    { year: "2027", revenue: 940, backlog: 1850, headcount: 2020 },
    { year: "2028", revenue: 1080, backlog: 2100, headcount: 2280 },
    { year: "2029", revenue: 1240, backlog: 2400, headcount: 2550 },
    { year: "2030", revenue: 1420, backlog: 2750, headcount: 2850 },
];

// ─── HIRING TIMELINE (GANTT DATA) ─────────────────────────────────────────────
// qIndex: 0=Q1'26 … 15=Q4'29  |  TODAY = Q1'26 = index 0
const QUARTERS = ["Q1'26", "Q2'26", "Q3'26", "Q4'26", "Q1'27", "Q2'27", "Q3'27", "Q4'27", "Q1'28", "Q2'28", "Q3'28", "Q4'28", "Q1'29", "Q2'29", "Q3'29", "Q4'29"];
const TODAY_Q = 0;

const HIRING_PLAN = [
    // ── IT
    { dept: "Information Technology", color: "#f97316", role: "Senior Systems Administrator", level: "Senior IC", qIndex: 1, type: "urgent" },
    { dept: "Information Technology", color: "#f97316", role: "Cybersecurity Analyst", level: "Mid IC", qIndex: 2, type: "urgent" },
    { dept: "Information Technology", color: "#f97316", role: "Data Engineer / BI Developer", level: "Senior IC", qIndex: 4, type: "planned" },
    { dept: "Information Technology", color: "#f97316", role: "IT Project Manager", level: "Manager", qIndex: 6, type: "planned" },
    { dept: "Information Technology", color: "#f97316", role: "IT Support Specialist", level: "Entry", qIndex: 9, type: "conditional" },
    { dept: "Information Technology", color: "#f97316", role: "Infrastructure Engineer", level: "Senior IC", qIndex: 12, type: "conditional" },
    // ── HR
    { dept: "Human Resources", color: "#06b6d4", role: "Talent Acquisition Specialist", level: "Mid IC", qIndex: 2, type: "urgent" },
    { dept: "Human Resources", color: "#06b6d4", role: "HRIS / Workforce Analyst", level: "Mid IC", qIndex: 5, type: "planned" },
    { dept: "Human Resources", color: "#06b6d4", role: "HR Business Partner", level: "Senior IC", qIndex: 8, type: "planned" },
    { dept: "Human Resources", color: "#06b6d4", role: "Benefits Coordinator", level: "Entry", qIndex: 13, type: "conditional" },
    // ── Recruiting
    { dept: "Recruiting", color: "#a855f7", role: "Senior Recruiter", level: "Senior IC", qIndex: 1, type: "urgent" },
    { dept: "Recruiting", color: "#a855f7", role: "Recruiting Coordinator", level: "Entry", qIndex: 3, type: "urgent" },
    { dept: "Recruiting", color: "#a855f7", role: "Technical Recruiter", level: "Mid IC", qIndex: 5, type: "planned" },
    { dept: "Recruiting", color: "#a855f7", role: "Recruiting Manager", level: "Manager", qIndex: 10, type: "conditional" },
    // ── Equipment
    { dept: "Equipment Department", color: "#ef4444", role: "Equipment Manager", level: "Manager", qIndex: 1, type: "urgent" },
    { dept: "Equipment Department", color: "#ef4444", role: "Fleet Coordinator", level: "Mid IC", qIndex: 3, type: "planned" },
    { dept: "Equipment Department", color: "#ef4444", role: "Equipment Technician", level: "Entry", qIndex: 5, type: "planned" },
    { dept: "Equipment Department", color: "#ef4444", role: "Senior Equipment Tech", level: "Senior IC", qIndex: 8, type: "planned" },
    // ── Admin PC
    { dept: "Admin – Project Coordinator", color: "#8b5cf6", role: "Project Coordinator", level: "Entry", qIndex: 0, type: "urgent" },
    { dept: "Admin – Project Coordinator", color: "#8b5cf6", role: "Senior Project Coordinator", level: "Senior IC", qIndex: 2, type: "planned" },
    { dept: "Admin – Project Coordinator", color: "#8b5cf6", role: "Admin Specialist", level: "Entry", qIndex: 5, type: "planned" },
    // ── Safety
    { dept: "Safety", color: "#f43f5e", role: "Safety Manager", level: "Manager", qIndex: 0, type: "urgent" },
    { dept: "Safety", color: "#f43f5e", role: "Safety Coordinator", level: "Mid IC", qIndex: 6, type: "planned" },
    { dept: "Safety", color: "#f43f5e", role: "Senior Safety Specialist", level: "Senior IC", qIndex: 13, type: "conditional" },
    // ── Business Development
    { dept: "Business Development", color: "#10b981", role: "BD Manager", level: "Manager", qIndex: 2, type: "planned" },
    { dept: "Business Development", color: "#10b981", role: "Proposal Writer", level: "Mid IC", qIndex: 5, type: "planned" },
    { dept: "Business Development", color: "#10b981", role: "Market Analyst", level: "Entry", qIndex: 9, type: "conditional" },
    // ── Training
    { dept: "Training & Development", color: "#84cc16", role: "Training Coordinator", level: "Mid IC", qIndex: 5, type: "planned" },
    { dept: "Training & Development", color: "#84cc16", role: "L&D Specialist", level: "Senior IC", qIndex: 8, type: "planned" },
    { dept: "Training & Development", color: "#84cc16", role: "Training Manager", level: "Manager", qIndex: 14, type: "conditional" },
    // ── Accounting AP
    { dept: "Accounting & Finance – AP", color: "#3b82f6", role: "Senior AP Specialist", level: "Senior IC", qIndex: 5, type: "planned" },
    { dept: "Accounting & Finance – AP", color: "#3b82f6", role: "AP Analyst", level: "Entry", qIndex: 10, type: "conditional" },
    // ── Accounting Payroll
    { dept: "Accounting & Finance – FS/Payroll", color: "#f59e0b", role: "Payroll Specialist", level: "Mid IC", qIndex: 7, type: "planned" },
    { dept: "Accounting & Finance – FS/Payroll", color: "#f59e0b", role: "Senior Payroll Analyst", level: "Senior IC", qIndex: 13, type: "conditional" },
    // ── Marketing
    { dept: "Marketing – Corp. Communications", color: "#ec4899", role: "Digital Marketing Specialist", level: "Mid IC", qIndex: 4, type: "planned" },
    { dept: "Marketing – Corp. Communications", color: "#ec4899", role: "Communications Manager", level: "Manager", qIndex: 11, type: "conditional" },
    // ── Bonds & Insurance
    { dept: "Bonds & Insurance", color: "#14b8a6", role: "Bond Specialist", level: "Senior IC", qIndex: 6, type: "planned" },
    { dept: "Bonds & Insurance", color: "#14b8a6", role: "Insurance Analyst", level: "Mid IC", qIndex: 13, type: "conditional" },
    // ── Legal
    { dept: "Legal", color: "#6366f1", role: "Contract Specialist", level: "Senior IC", qIndex: 5, type: "planned" },
    { dept: "Legal", color: "#6366f1", role: "Senior Legal Counsel", level: "Senior IC", qIndex: 12, type: "conditional" },
];

// ─── AI CHAT RESPONSES ────────────────────────────────────────────────────────
const AI_RESPONSES = {
    "If we grow headcount 20%, how many will HR need by 2030?":
        "Based on the HR staffing ratio model (1 FTE per ~35 employees), a 20% operational headcount growth scenario projects total company headcount to reach ~2,850 by 2030.\n\nThis would require HR to grow from 6 to approximately 18 FTEs — adding 12 positions over 5 years.\n\nPriority hire sequence:\n• Q3 2026 — Talent Acquisition Specialist (critical given operational surge)\n• Q2 2027 — HRIS / Workforce Analytics role\n• Q1 2028 — HR Business Partner (field operations support)\n• 2029 — Benefits Coordinator (contingent on headcount threshold)\n\nCurrent HR capacity risk is HIGH. A Q3 2026 hire is strongly recommended.",

    "Which departments are at highest capacity risk?":
        "Six departments currently show HIGH capacity risk:\n\n• IT — ~85% utilization, digital transformation accelerating. Critical hire window: Q2 2026.\n• HR — 1:47 ratio exceeds 1:35 best-practice threshold. Talent Acquisition strain grows with the operational surge.\n• Recruiting — Projected to manage 80+ open reqs by end of 2026. Needs a Senior Recruiter immediately.\n• Equipment — Fleet growth outpacing management capacity. Equipment Manager hire is urgent.\n• Business Development — Proposal volume up 30%. Losing bids due to bandwidth constraints.\n• Admin/Project Coordinators — Project count is outpacing admin support ratio.\n\nRecommendation: Prioritize these six in the Q3 2026 budget action.",

    "What if we automate 30% of Finance tasks with AI?":
        "Applying a 30% AI automation factor to Accounting & Finance tasks (AP reconciliation, payroll processing, variance reporting, standard journal entries):\n\n• 2026–2027: No headcount reduction — growth slows. Avoid 2 planned hires, redeploy to FP&A.\n• 2028–2029: Combined AP + Payroll headcount need drops from 14 to ~9 FTEs, saving ~$500K annually.\n• Redeployment opportunity: 1.5 FTE equivalent shifts to strategic finance and financial planning roles.\n\nThis assumes Microsoft Copilot for Finance rollout by mid-2026 with proper adoption support.",

    "When should we start hiring for IT?":
        "IT is your most time-sensitive corporate department. Recommended sequence:\n\n• Q2 2026 (NOW): Senior Systems Admin — single-threaded on critical infrastructure today\n• Q3 2026: Cybersecurity Analyst — compliance exposure growing with geographic expansion\n• Q1 2027: Data Engineer / BI Developer — Power BI environment needs dedicated ownership\n• Q3 2027: IT Project Manager — digital transformation volume exceeds capacity\n• Q2 2028 — Q4 2029: 2 additional FTEs tied to operational headcount milestones\n\nDelaying the Q2 2026 hire carries significant operational and security risk.",
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function computeScenario(growthRate, aiLevel, expansion) {
    return BASE_PROJ.map((row, i) => {
        const gF = 1 + (growthRate / 100) * (i / 4);
        const aF = 1 - (aiLevel / 100) * 0.25 * (i / 4);
        const eF = expansion ? 1 + 0.04 * i : 1;
        const out = { year: row.year };
        DEPT_DATA.forEach(d => {
            out[d.abbr] = Math.max(d.current, Math.round(row[d.abbr] * gF * aF * eF));
        });
        out.total = DEPT_DATA.reduce((s, d) => s + out[d.abbr], 0);
        return out;
    });
}


const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 10, padding: "10px 14px", fontSize: 12, maxWidth: 220 }}>
            <p style={{ color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>{label}</p>
            {payload.map((p, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 16, color: p.color || "#e2e8f0", marginBottom: 2 }}>
                    <span style={{ opacity: 0.85 }}>{p.name}</span>
                    <span style={{ fontWeight: 700 }}>{typeof p.value === "number" ? p.value.toLocaleString() : p.value}</span>
                </div>
            ))}
        </div>
    );
};

const riskSt = {
    high: { bg: "#ef444418", border: "1px solid #ef444440", color: "#ef4444" },
    medium: { bg: "#f59e0b18", border: "1px solid #f59e0b40", color: "#f59e0b" },
    low: { bg: "#10b98118", border: "1px solid #10b98140", color: "#10b981" },
};

const RiskBadge = ({ risk, small }) => (
    <span style={{
        fontSize: small ? 9 : 10, padding: small ? "1px 6px" : "2px 8px",
        borderRadius: 20, background: riskSt[risk].bg,
        border: riskSt[risk].border, color: riskSt[risk].color,
        fontWeight: 600, whiteSpace: "nowrap",
    }}>{risk}</span>
);

const typeSt = {
    urgent: { bg: "#ef444418", border: "1px solid #ef444450", color: "#ef4444", label: "Urgent" },
    planned: { bg: "#3b82f618", border: "1px solid #3b82f650", color: "#3b82f6", label: "Planned" },
    conditional: { bg: "#10b98118", border: "1px solid #10b98150", color: "#10b981", label: "Conditional" },
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function CapacityIQ() {
    const [tab, setTab] = useState("dashboard");
    const [growthRate, setGrowthRate] = useState(12);
    const [aiLevel, setAiLevel] = useState(0);
    const [expansion, setExpansion] = useState(false);
    const [selDept, setSelDept] = useState(null);
    const [ganttFilter, setGanttFilter] = useState("all");
    const [messages, setMessages] = useState([
        { role: "ai", text: "Hello! I'm CapacityIQ — your AI workforce planning assistant.\n\nI can answer questions about headcount projections, capacity risks, hiring timelines, and automation impact. Try one of the example questions below, or ask me anything!" },
    ]);
    const [chatInput, setChatInput] = useState("");
    const [typing, setTyping] = useState(false);
    const chatEnd = useRef(null);

    useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

    const scenario = computeScenario(growthRate, aiLevel, expansion);
    const totalNow = DEPT_DATA.reduce((s, d) => s + d.current, 0);
    const total2028 = scenario[4].total;
    const netNew = total2028 - totalNow;
    const highRisk = DEPT_DATA.filter(d => d.risk === "high").length;
    const aiSavings = aiLevel > 0 ? DEPT_DATA.reduce((s, d) => s + Math.round(d.autoSavings * aiLevel / 50), 0) : 0;

    const sendMessage = (text) => {
        const msg = (text || chatInput).trim();
        if (!msg) return;
        setMessages(p => [...p, { role: "user", text: msg }]);
        setChatInput("");
        setTyping(true);
        setTimeout(() => {
            const reply = AI_RESPONSES[msg] ||
                "Great question! In the full version, I analyze this against your live Power BI datasets, 5-year financial plan, and KPI driver models. This demo uses mock data — once connected to real data, I can provide precise projections with confidence intervals and specific hiring timeline recommendations.";
            setMessages(p => [...p, { role: "ai", text: reply }]);
            setTyping(false);
        }, 1400);
    };

    // Gantt filtered data
    const ganttRows = HIRING_PLAN.filter(h => ganttFilter === "all" || h.type === ganttFilter);
    const hiresByYear = [0, 1, 2, 3].map(yr =>
        HIRING_PLAN.filter(h => Math.floor(h.qIndex / 4) === yr).length
    );

    // ── styles
    const card = { background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, padding: "20px 22px" };
    const navItems = [
        { id: "dashboard", label: "Dashboard", icon: "▤" },
        { id: "scenarios", label: "Scenario Planner", icon: "⚙" },
        { id: "departments", label: "Departments", icon: "◫" },
        { id: "financials", label: "Financial Drivers", icon: "↗" },
        { id: "timeline", label: "Hiring Timeline", icon: "≡" },
        { id: "chat", label: "AI Assistant", icon: "◈" },
    ];

    return (
        <div style={{ display: "flex", height: "100vh", background: "#020617", color: "#e2e8f0", fontFamily: "'Inter',system-ui,sans-serif", overflow: "hidden" }}>

            {/* ══ SIDEBAR */}
            <div style={{ width: 218, background: "#0a0f1e", borderRight: "1px solid #1e293b", display: "flex", flexDirection: "column", flexShrink: 0 }}>
                {/* Logo */}
                <div style={{ padding: "18px 16px", borderBottom: "1px solid #1e293b" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 34, height: 34, background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15, flexShrink: 0 }}>C</div>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: "-0.3px" }}>CapacityIQ</div>
                            <div style={{ fontSize: 10, color: "#475569", marginTop: 1 }}>Workforce Intelligence</div>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: "10px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
                    {navItems.map(n => (
                        <button key={n.id} onClick={() => setTab(n.id)} style={{
                            display: "flex", alignItems: "center", gap: 9,
                            padding: "8px 12px", borderRadius: 9, border: "none", cursor: "pointer",
                            fontSize: 12.5, fontWeight: 500, width: "100%", textAlign: "left",
                            background: tab === n.id ? "linear-gradient(90deg,#1d4ed8,#4f46e5)" : "transparent",
                            color: tab === n.id ? "#fff" : "#64748b",
                            transition: "all 0.15s",
                        }}>
                            <span style={{ width: 16, textAlign: "center", flexShrink: 0, fontSize: 13, lineHeight: 1 }}>{n.icon}</span>
                            <span style={{ lineHeight: 1 }}>{n.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Demo badge */}
                <div style={{ padding: "10px 8px", borderTop: "1px solid #1e293b" }}>
                    <div style={{ background: "#1e3a5f", border: "1px solid #2563eb40", borderRadius: 9, padding: "10px 12px" }}>
                        <div style={{ fontSize: 9, color: "#60a5fa", fontWeight: 700, marginBottom: 4, letterSpacing: "0.5px" }}>⚡ DEMO MODE</div>
                        <div style={{ fontSize: 10, color: "#475569", lineHeight: 1.5 }}>Mock data. Full version connects to Power BI + 5-Year Plan.</div>
                    </div>
                </div>
            </div>

            {/* ══ MAIN AREA */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                {/* Header */}
                <div style={{ padding: "13px 26px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#020617", flexShrink: 0 }}>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: 15 }}>
                            {tab === "dashboard" && "Workforce Planning Dashboard"}
                            {tab === "scenarios" && "Scenario Planner"}
                            {tab === "departments" && "Corporate Department Explorer"}
                            {tab === "financials" && "Financial Growth Drivers"}
                            {tab === "timeline" && "Hiring Timeline — Gantt View"}
                            {tab === "chat" && "AI Workforce Assistant"}
                        </div>
                        <div style={{ fontSize: 11, color: "#475569", marginTop: 1 }}>Corporate Services · 5-Year Horizon 2026–2030 · Colorado & Arizona Operations</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ fontSize: 11, background: "#0f172a", border: "1px solid #1e293b", padding: "5px 12px", borderRadius: 20, color: "#64748b" }}>FY2026 Planning Cycle</div>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12 }}>HG</div>
                    </div>
                </div>

                {/* ══ CONTENT */}
                <div style={{ flex: 1, overflow: "auto", padding: "22px 26px" }}>

                    {/* ─────────────────────── DASHBOARD ─────────────────────── */}
                    {tab === "dashboard" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                            {/* KPI cards */}
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 13 }}>
                                {[
                                    { label: "Corporate Staff (Current)", value: totalNow, sub: "across 13 departments", accent: "#3b82f6" },
                                    { label: "Corporate Staff (2030)", value: total2028, sub: "baseline growth scenario", accent: "#8b5cf6" },
                                    { label: "Net New Hires (5-Year)", value: `+${netNew}`, sub: "corporate positions", accent: "#10b981" },
                                    { label: "High Risk Departments", value: highRisk, sub: "need priority action", accent: "#ef4444" },
                                ].map((c, i) => (
                                    <div key={i} style={card}>
                                        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 8 }}>{c.label}</div>
                                        <div style={{ fontSize: 28, fontWeight: 800, color: c.accent, lineHeight: 1 }}>{c.value}</div>
                                        <div style={{ fontSize: 11, color: "#334155", marginTop: 6 }}>{c.sub}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Charts row */}
                            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14 }}>
                                <div style={card}>
                                    <div style={{ fontWeight: 600, fontSize: 12, color: "#94a3b8", marginBottom: 13 }}>Corporate Headcount Trajectory (2026–2030)</div>
                                    <ResponsiveContainer width="100%" height={195}>
                                        <AreaChart data={scenario}>
                                            <defs>
                                                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                            <XAxis dataKey="year" stroke="#1e293b" tick={{ fill: "#475569", fontSize: 11 }} />
                                            <YAxis stroke="#1e293b" tick={{ fill: "#475569", fontSize: 11 }} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Area type="monotone" dataKey="total" name="Total FTEs" stroke="#3b82f6" strokeWidth={2.5} fill="url(#g1)" dot={{ fill: "#3b82f6", r: 4 }} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                                <div style={card}>
                                    <div style={{ fontWeight: 600, fontSize: 12, color: "#94a3b8", marginBottom: 13 }}>Net New Hires by Department</div>
                                    <ResponsiveContainer width="100%" height={195}>
                                        <BarChart data={DEPT_DATA.map(d => ({ name: d.abbr, hires: d.proj2028 - d.current, color: d.color }))} barSize={14}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                            <XAxis dataKey="name" stroke="#1e293b" tick={{ fill: "#475569", fontSize: 9 }} />
                                            <YAxis stroke="#1e293b" tick={{ fill: "#475569", fontSize: 11 }} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Bar dataKey="hires" name="Net New Hires" radius={[4, 4, 0, 0]}>
                                                {DEPT_DATA.map((d, i) => <Cell key={i} fill={d.color} />)}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Risk table */}
                            <div style={card}>
                                <div style={{ fontWeight: 600, fontSize: 12, color: "#94a3b8", marginBottom: 13 }}>Department Capacity Risk — All 13 Corporate Departments</div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 24px" }}>
                                    {DEPT_DATA.map(d => (
                                        <div key={d.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 6, borderBottom: "1px solid #0f172a" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                                                <div style={{ width: 7, height: 7, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
                                                <span style={{ fontSize: 11.5, color: "#94a3b8" }}>{d.name}</span>
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                <span style={{ fontSize: 11, color: "#334155" }}>{d.current}→{d.proj2028}</span>
                                                <RiskBadge risk={d.risk} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ─────────────────────── SCENARIOS ─────────────────────── */}
                    {tab === "scenarios" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                            <div style={{ display: "grid", gridTemplateColumns: "230px 1fr", gap: 18 }}>
                                {/* Controls */}
                                <div style={{ ...card, display: "flex", flexDirection: "column", gap: 20 }}>
                                    <div style={{ fontWeight: 700, fontSize: 13, color: "#94a3b8" }}>Scenario Controls</div>
                                    {[
                                        { label: "Operational Growth Rate", value: growthRate, set: setGrowthRate, min: 0, max: 30, unit: "%", color: "#3b82f6" },
                                        { label: "AI Automation Adoption", value: aiLevel, set: setAiLevel, min: 0, max: 50, unit: "%", color: "#8b5cf6" },
                                    ].map((c, i) => (
                                        <div key={i}>
                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                                                <span style={{ fontSize: 11.5, color: "#64748b" }}>{c.label}</span>
                                                <span style={{ fontSize: 12, color: c.color, fontWeight: 700 }}>{c.value}{c.unit}</span>
                                            </div>
                                            <input type="range" min={c.min} max={c.max} value={c.value} onChange={e => c.set(Number(e.target.value))} style={{ width: "100%", accentColor: c.color }} />
                                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#334155", marginTop: 3 }}>
                                                <span>{c.min}{c.unit}</span><span>{c.max}{c.unit}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {/* Toggle */}
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <span style={{ fontSize: 11.5, color: "#64748b" }}>Geo Expansion (+2 States)</span>
                                        <div onClick={() => setExpansion(!expansion)} style={{ width: 40, height: 22, borderRadius: 11, background: expansion ? "#2563eb" : "#1e293b", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
                                            <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: expansion ? 21 : 3, transition: "left 0.2s" }} />
                                        </div>
                                    </div>
                                    {/* Summary */}
                                    <div style={{ borderTop: "1px solid #1e293b", paddingTop: 16, display: "flex", flexDirection: "column", gap: 9 }}>
                                        {[
                                            { label: "2030 Corporate Total", value: `${total2028} FTEs`, color: "#e2e8f0" },
                                            { label: "Net New Hires", value: `+${netNew}`, color: "#10b981" },
                                            { label: "AI Positions Saved", value: aiSavings > 0 ? `-${aiSavings}` : "—", color: "#8b5cf6" },
                                            { label: "Est. Labor Cost Impact", value: `$${(netNew * 95000 / 1e6).toFixed(1)}M`, color: "#f59e0b" },
                                        ].map((s, i) => (
                                            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                                                <span style={{ color: "#475569" }}>{s.label}</span>
                                                <span style={{ color: s.color, fontWeight: 700 }}>{s.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* Chart */}
                                <div style={card}>
                                    <div style={{ fontWeight: 600, fontSize: 12, color: "#94a3b8", marginBottom: 13 }}>Adjusted Corporate Headcount by Department & Year</div>
                                    <ResponsiveContainer width="100%" height={285}>
                                        <BarChart data={scenario}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                            <XAxis dataKey="year" stroke="#1e293b" tick={{ fill: "#475569", fontSize: 12 }} />
                                            <YAxis stroke="#1e293b" tick={{ fill: "#475569", fontSize: 12 }} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend wrapperStyle={{ fontSize: 10, color: "#64748b" }} />
                                            {DEPT_DATA.map(d => (
                                                <Bar key={d.abbr} dataKey={d.abbr} name={d.name} stackId="a" fill={d.color} />
                                            ))}
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Projection table */}
                            <div style={card}>
                                <div style={{ fontWeight: 600, fontSize: 12, color: "#94a3b8", marginBottom: 13 }}>Detailed 5-Year Projection (Active Scenario)</div>
                                <div style={{ overflowX: "auto" }}>
                                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5 }}>
                                        <thead>
                                            <tr style={{ borderBottom: "1px solid #1e293b" }}>
                                                <th style={{ textAlign: "left", padding: "7px 10px", color: "#475569", fontWeight: 600, minWidth: 200 }}>Department</th>
                                                <th style={{ textAlign: "center", padding: "7px 10px", color: "#475569", fontWeight: 600 }}>Current</th>
                                                {scenario.slice(1).map(d => (
                                                    <th key={d.year} style={{ textAlign: "center", padding: "7px 10px", color: "#475569", fontWeight: 600 }}>{d.year}</th>
                                                ))}
                                                <th style={{ textAlign: "center", padding: "7px 10px", color: "#475569", fontWeight: 600 }}>Net New</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {DEPT_DATA.map(dept => {
                                                const p28 = scenario[4][dept.abbr];
                                                const net = p28 - dept.current;
                                                return (
                                                    <tr key={dept.id} style={{ borderBottom: "1px solid #0f172a" }}>
                                                        <td style={{ padding: "8px 10px", display: "flex", alignItems: "center", gap: 7 }}>
                                                            <div style={{ width: 7, height: 7, borderRadius: "50%", background: dept.color, flexShrink: 0 }} />
                                                            <span style={{ color: "#94a3b8" }}>{dept.name}</span>
                                                        </td>
                                                        <td style={{ padding: "8px 10px", textAlign: "center", color: "#64748b" }}>{dept.current}</td>
                                                        {scenario.slice(1).map(d => (
                                                            <td key={d.year} style={{ padding: "8px 10px", textAlign: "center", color: "#e2e8f0" }}>{d[dept.abbr]}</td>
                                                        ))}
                                                        <td style={{ padding: "8px 10px", textAlign: "center" }}>
                                                            <span style={{ color: "#10b981", fontWeight: 700 }}>+{net}</span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            <tr style={{ borderTop: "1px solid #1e293b" }}>
                                                <td style={{ padding: "8px 10px", color: "#e2e8f0", fontWeight: 700 }}>TOTAL</td>
                                                <td style={{ padding: "8px 10px", textAlign: "center", color: "#e2e8f0", fontWeight: 700 }}>{totalNow}</td>
                                                {scenario.slice(1).map(d => (
                                                    <td key={d.year} style={{ padding: "8px 10px", textAlign: "center", color: "#3b82f6", fontWeight: 700 }}>{d.total}</td>
                                                ))}
                                                <td style={{ padding: "8px 10px", textAlign: "center", color: "#10b981", fontWeight: 700 }}>+{netNew}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ─────────────────────── DEPARTMENTS ─────────────────────── */}
                    {tab === "departments" && (
                        <div style={{ display: "grid", gridTemplateColumns: "230px 1fr", gap: 18 }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 7, overflowY: "auto", maxHeight: "calc(100vh - 140px)" }}>
                                {DEPT_DATA.map(d => (
                                    <button key={d.id} onClick={() => setSelDept(d)} style={{
                                        textAlign: "left", padding: "11px 13px", borderRadius: 10, cursor: "pointer",
                                        background: selDept?.id === d.id ? "#1e3a5f" : "#0f172a",
                                        border: selDept?.id === d.id ? "1px solid #2563eb60" : "1px solid #1e293b",
                                        transition: "all 0.15s",
                                    }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                                                <div style={{ width: 8, height: 8, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
                                                <span style={{ fontSize: 11.5, fontWeight: 600, color: "#e2e8f0" }}>{d.name}</span>
                                            </div>
                                            <RiskBadge risk={d.risk} small />
                                        </div>
                                        <div style={{ fontSize: 10.5, color: "#475569", marginLeft: 15 }}>{d.current} → {d.proj2028} FTEs</div>
                                    </button>
                                ))}
                            </div>

                            {selDept ? (
                                <div style={{ ...card, display: "flex", flexDirection: "column", gap: 18 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                        <div>
                                            <div style={{ fontSize: 19, fontWeight: 800 }}>{selDept.name}</div>
                                            <div style={{ fontSize: 11.5, color: "#475569", marginTop: 5 }}>Primary KPI Driver: {selDept.kpi}</div>
                                        </div>
                                        <RiskBadge risk={selDept.risk} />
                                    </div>
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 11 }}>
                                        {[
                                            { label: "Current Staff", value: selDept.current, color: "#e2e8f0" },
                                            { label: "2030 Projected", value: scenario[4][selDept.abbr], color: "#3b82f6" },
                                            { label: "Net New Hires", value: `+${scenario[4][selDept.abbr] - selDept.current}`, color: "#10b981" },
                                        ].map((s, i) => (
                                            <div key={i} style={{ background: "#020617", border: "1px solid #1e293b", borderRadius: 10, padding: "13px 15px" }}>
                                                <div style={{ fontSize: 11, color: "#475569", marginBottom: 5 }}>{s.label}</div>
                                                <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 11.5, color: "#64748b", fontWeight: 600, marginBottom: 11 }}>5-Year Staffing Trajectory (Active Scenario)</div>
                                        <ResponsiveContainer width="100%" height={175}>
                                            <AreaChart data={scenario.map(d => ({ year: d.year, headcount: d[selDept.abbr] }))}>
                                                <defs>
                                                    <linearGradient id="dg" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor={selDept.color} stopOpacity={0.35} />
                                                        <stop offset="95%" stopColor={selDept.color} stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                                <XAxis dataKey="year" stroke="#1e293b" tick={{ fill: "#475569", fontSize: 11 }} />
                                                <YAxis stroke="#1e293b" tick={{ fill: "#475569", fontSize: 11 }} />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Area type="monotone" dataKey="headcount" name="Headcount" stroke={selDept.color} strokeWidth={2.5} fill="url(#dg)" dot={{ fill: selDept.color, r: 4 }} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                    {/* Upcoming hires from timeline */}
                                    <div>
                                        <div style={{ fontSize: 11.5, color: "#64748b", fontWeight: 600, marginBottom: 9 }}>Planned Hires from Hiring Timeline</div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                            {HIRING_PLAN.filter(h => h.dept === selDept.name).slice(0, 4).map((h, i) => (
                                                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "#020617", borderRadius: 8, border: "1px solid #1e293b" }}>
                                                    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: typeSt[h.type].bg, border: typeSt[h.type].border, color: typeSt[h.type].color, fontWeight: 600, whiteSpace: "nowrap" }}>{typeSt[h.type].label}</span>
                                                    <span style={{ fontSize: 11.5, color: "#94a3b8", flex: 1 }}>{h.role}</span>
                                                    <span style={{ fontSize: 11, color: "#475569" }}>{QUARTERS[h.qIndex]}</span>
                                                    <span style={{ fontSize: 10, color: "#334155" }}>{h.level}</span>
                                                </div>
                                            ))}
                                            {HIRING_PLAN.filter(h => h.dept === selDept.name).length === 0 && (
                                                <div style={{ fontSize: 12, color: "#334155", padding: "10px 0" }}>No hires planned in current timeline.</div>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ background: "#0a1628", border: "1px solid #1d4ed830", borderRadius: 10, padding: "13px 15px" }}>
                                        <div style={{ fontSize: 11, fontWeight: 700, color: "#60a5fa", marginBottom: 7 }}>◈ AI Recommendation</div>
                                        <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.65 }}>
                                            {selDept.risk === "high" && "This department is near capacity limits. A hiring action in Q3 2025 is recommended to prevent throughput degradation. Prioritize a senior-level hire first and consider a contractor bridge while the permanent hire ramps up."}
                                            {selDept.risk === "medium" && "Capacity is manageable but trending toward constraint. Monitor KPI ratios quarterly. Recommended hire window: Q1–Q2 2026. A contractor bridge may help absorb demand spikes without over-hiring ahead of confirmed growth."}
                                            {selDept.risk === "low" && "Well-positioned relative to growth projections. No immediate hiring urgency. Revisit in next planning cycle or if operational growth exceeds 20% in a given year. Consider cross-training existing staff to build flexibility."}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ ...card, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 320 }}>
                                    <div style={{ textAlign: "center", color: "#334155" }}>
                                        <div style={{ fontSize: 36, marginBottom: 12 }}>◫</div>
                                        <div style={{ fontSize: 13 }}>Select a department to view detailed projections</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ─────────────────────── FINANCIALS ─────────────────────── */}
                    {tab === "financials" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 13 }}>
                                {[
                                    { label: "2030 Projected Revenue", value: "$1.42B", sub: "+73% over 5 years", color: "#3b82f6" },
                                    { label: "2030 Backlog Projection", value: "$2.75B", sub: "construction backlog", color: "#8b5cf6" },
                                    { label: "2030 Total Headcount", value: "2,850", sub: "operations workforce", color: "#10b981" },
                                ].map((c, i) => (
                                    <div key={i} style={card}>
                                        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 8 }}>{c.label}</div>
                                        <div style={{ fontSize: 28, fontWeight: 800, color: c.color, lineHeight: 1 }}>{c.value}</div>
                                        <div style={{ fontSize: 11, color: "#334155", marginTop: 6 }}>{c.sub}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={card}>
                                <div style={{ fontWeight: 600, fontSize: 12, color: "#94a3b8", marginBottom: 13 }}>Revenue & Backlog Growth vs. Operational Headcount</div>
                                <ResponsiveContainer width="100%" height={230}>
                                    <LineChart data={FINANCIAL_PROJ}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                        <XAxis dataKey="year" stroke="#1e293b" tick={{ fill: "#475569", fontSize: 12 }} />
                                        <YAxis yAxisId="left" stroke="#1e293b" tick={{ fill: "#475569", fontSize: 12 }} />
                                        <YAxis yAxisId="right" orientation="right" stroke="#1e293b" tick={{ fill: "#475569", fontSize: 12 }} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend wrapperStyle={{ fontSize: 11, color: "#64748b" }} />
                                        <Line yAxisId="left" type="monotone" dataKey="revenue" name="Revenue ($M)" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4, fill: "#3b82f6" }} />
                                        <Line yAxisId="left" type="monotone" dataKey="backlog" name="Backlog ($M)" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4, fill: "#8b5cf6" }} />
                                        <Line yAxisId="right" type="monotone" dataKey="headcount" name="Op. Headcount" stroke="#10b981" strokeWidth={2.5} strokeDasharray="5 5" dot={{ r: 4, fill: "#10b981" }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <div style={card}>
                                <div style={{ fontWeight: 600, fontSize: 12, color: "#94a3b8", marginBottom: 12 }}>KPI Staffing Ratios — How Financial Growth Drives Corporate Hiring</div>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 11 }}>
                                    {[
                                        { dept: "Accounting & Finance", driver: "Revenue & entity count", ratio: "1 FTE / $80M revenue", color: "#3b82f6" },
                                        { dept: "Human Resources", driver: "Total headcount", ratio: "1 FTE / 35 employees", color: "#06b6d4" },
                                        { dept: "Information Technology", driver: "Users & digital systems", ratio: "1 FTE / 130 users", color: "#f97316" },
                                        { dept: "Procurement", driver: "Backlog value", ratio: "1 FTE / $200M backlog", color: "#a855f7" },
                                        { dept: "Safety", driver: "Field employee ratio", ratio: "1 FTE / 50 field staff", color: "#f43f5e" },
                                        { dept: "Recruiting", driver: "Open positions", ratio: "1 FTE / 35 open reqs", color: "#a855f7" },
                                        { dept: "Legal", driver: "Contract volume", ratio: "1 FTE / 120 contracts", color: "#6366f1" },
                                        { dept: "Training & Dev.", driver: "New hire volume", ratio: "1 FTE / 40 new hires/yr", color: "#84cc16" },
                                    ].map((d, i) => (
                                        <div key={i} style={{ background: "#020617", border: `1px solid ${d.color}30`, borderRadius: 10, padding: "13px 14px" }}>
                                            <div style={{ width: 7, height: 7, borderRadius: "50%", background: d.color, marginBottom: 8 }} />
                                            <div style={{ fontSize: 11.5, fontWeight: 700, color: "#e2e8f0", marginBottom: 3 }}>{d.dept}</div>
                                            <div style={{ fontSize: 10.5, color: "#475569", marginBottom: 8 }}>{d.driver}</div>
                                            <div style={{ fontSize: 10.5, color: d.color, fontWeight: 600, background: d.color + "15", padding: "3px 8px", borderRadius: 6 }}>{d.ratio}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ─────────────────────── HIRING TIMELINE (GANTT) ─────────────────────── */}
                    {tab === "timeline" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            {/* Summary bar */}
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }}>
                                <div style={card}>
                                    <div style={{ fontSize: 10.5, color: "#64748b", marginBottom: 6 }}>Total Planned Hires</div>
                                    <div style={{ fontSize: 26, fontWeight: 800, color: "#e2e8f0" }}>{HIRING_PLAN.length}</div>
                                    <div style={{ fontSize: 10.5, color: "#334155", marginTop: 4 }}>2026 – 2029</div>
                                </div>
                                {["2026", "2027", "2028", "2029"].map((yr, i) => (
                                    <div key={yr} style={card}>
                                        <div style={{ fontSize: 10.5, color: "#64748b", marginBottom: 6 }}>{yr} Hires</div>
                                        <div style={{ fontSize: 26, fontWeight: 800, color: ["#ef4444", "#3b82f6", "#8b5cf6", "#10b981"][i] }}>{hiresByYear[i]}</div>
                                        <div style={{ fontSize: 10.5, color: "#334155", marginTop: 4 }}>
                                            {HIRING_PLAN.filter(h => Math.floor(h.qIndex / 4) === i && h.type === "urgent").length} urgent
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Filters */}
                            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                <span style={{ fontSize: 11.5, color: "#475569", marginRight: 4 }}>Filter:</span>
                                {["all", "urgent", "planned", "conditional"].map(f => (
                                    <button key={f} onClick={() => setGanttFilter(f)}
                                        style={{
                                            fontSize: 11.5, padding: "5px 14px", borderRadius: 20, cursor: "pointer",
                                            background: ganttFilter === f ? (f === "all" ? "#1e293b" : typeSt[f]?.bg || "#1e293b") : "transparent",
                                            border: ganttFilter === f ? `1px solid ${f === "all" ? "#475569" : typeSt[f]?.border?.split(" solid ")[1] || "#475569"}` : "1px solid #1e293b",
                                            color: ganttFilter === f ? (f === "all" ? "#e2e8f0" : typeSt[f]?.color || "#e2e8f0") : "#64748b",
                                            fontWeight: ganttFilter === f ? 700 : 400,
                                        }}>
                                        {f === "all" ? "All Types" : typeSt[f]?.label}
                                        {f !== "all" && <span style={{ marginLeft: 6, fontSize: 10, opacity: 0.75 }}>({HIRING_PLAN.filter(h => h.type === f).length})</span>}
                                    </button>
                                ))}
                                {/* Legend */}
                                <div style={{ marginLeft: "auto", display: "flex", gap: 14 }}>
                                    {["urgent", "planned", "conditional"].map(t => (
                                        <div key={t} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                            <div style={{ width: 10, height: 10, borderRadius: 3, background: typeSt[t].bg, border: typeSt[t].border }} />
                                            <span style={{ fontSize: 10.5, color: typeSt[t].color }}>{typeSt[t].label}</span>
                                        </div>
                                    ))}
                                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                        <div style={{ width: 2, height: 14, background: "#fbbf24" }} />
                                        <span style={{ fontSize: 10.5, color: "#fbbf24" }}>Today (Q1'26)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Gantt table */}
                            <div style={{ ...card, padding: 0, overflow: "hidden" }}>
                                <div style={{ overflowX: "auto" }}>
                                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5 }}>
                                        <thead>
                                            {/* Year header */}
                                            <tr style={{ background: "#020617", borderBottom: "1px solid #1e293b" }}>
                                                <th style={{ width: 195, minWidth: 195, padding: "8px 14px", textAlign: "left", color: "#475569", fontWeight: 600, borderRight: "1px solid #1e293b" }}>Department</th>
                                                <th style={{ width: 220, minWidth: 220, padding: "8px 14px", textAlign: "left", color: "#475569", fontWeight: 600, borderRight: "1px solid #1e293b" }}>Role</th>
                                                <th style={{ width: 80, padding: "8px 10px", textAlign: "center", color: "#475569", fontWeight: 600, borderRight: "1px solid #1e293b" }}>Level</th>
                                                <th style={{ width: 84, padding: "8px 10px", textAlign: "center", color: "#475569", fontWeight: 600, borderRight: "1px solid #1e293b" }}>Type</th>
                                                {["2026", "2027", "2028", "2029"].map((yr, yi) => (
                                                    <th key={yr} colSpan={4} style={{ padding: "8px 0", textAlign: "center", color: ["#ef444490", "#3b82f690", "#8b5cf690", "#10b98190"][yi], fontWeight: 700, fontSize: 12, borderRight: "1px solid #1e293b", borderLeft: yi > 0 ? "1px solid #1e293b" : undefined }}>
                                                        {yr}
                                                    </th>
                                                ))}
                                            </tr>
                                            {/* Quarter header */}
                                            <tr style={{ background: "#0a0f1e", borderBottom: "1px solid #1e293b" }}>
                                                <th style={{ borderRight: "1px solid #1e293b" }} />
                                                <th style={{ borderRight: "1px solid #1e293b" }} />
                                                <th style={{ borderRight: "1px solid #1e293b" }} />
                                                <th style={{ borderRight: "1px solid #1e293b" }} />
                                                {QUARTERS.map((q, qi) => (
                                                    <th key={qi} style={{
                                                        padding: "5px 0", textAlign: "center", fontSize: 10,
                                                        color: qi === TODAY_Q ? "#fbbf24" : "#334155", fontWeight: 600,
                                                        background: qi === TODAY_Q ? "#fbbf2410" : "transparent",
                                                        borderRight: (qi + 1) % 4 === 0 ? "1px solid #1e293b" : "1px solid #0f172a",
                                                        minWidth: 46,
                                                    }}>{q}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ganttRows.map((h, rowIdx) => (
                                                <tr key={rowIdx} style={{ borderBottom: "1px solid #0a0f1e" }}
                                                    onMouseEnter={e => e.currentTarget.style.background = "#0f172a"}
                                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                                    {/* Dept */}
                                                    <td style={{ padding: "7px 14px", borderRight: "1px solid #1e293b", verticalAlign: "middle" }}>
                                                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: h.color, flexShrink: 0 }} />
                                                            <span style={{ color: "#64748b", fontSize: 11, lineHeight: 1.3 }}>{h.dept}</span>
                                                        </div>
                                                    </td>
                                                    {/* Role */}
                                                    <td style={{ padding: "7px 14px", borderRight: "1px solid #1e293b", color: "#94a3b8", verticalAlign: "middle" }}>{h.role}</td>
                                                    {/* Level */}
                                                    <td style={{ padding: "7px 10px", textAlign: "center", borderRight: "1px solid #1e293b", verticalAlign: "middle" }}>
                                                        <span style={{ fontSize: 10, color: "#475569" }}>{h.level}</span>
                                                    </td>
                                                    {/* Type */}
                                                    <td style={{ padding: "7px 10px", textAlign: "center", borderRight: "1px solid #1e293b", verticalAlign: "middle" }}>
                                                        <span style={{ fontSize: 9.5, padding: "2px 7px", borderRadius: 20, background: typeSt[h.type].bg, border: typeSt[h.type].border, color: typeSt[h.type].color, fontWeight: 600 }}>
                                                            {typeSt[h.type].label}
                                                        </span>
                                                    </td>
                                                    {/* Quarter cells */}
                                                    {QUARTERS.map((q, qi) => (
                                                        <td key={qi} style={{
                                                            padding: "4px 3px", textAlign: "center", verticalAlign: "middle",
                                                            background: qi === TODAY_Q ? "#fbbf2408" : "transparent",
                                                            borderRight: (qi + 1) % 4 === 0 ? "1px solid #1e293b" : "1px solid #0a0f1e",
                                                        }}>
                                                            {qi === h.qIndex && (
                                                                <div style={{
                                                                    width: "90%", height: 22, borderRadius: 6, margin: "0 auto",
                                                                    background: h.color + "25", border: `1px solid ${h.color}60`,
                                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                                }}>
                                                                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: h.color }} />
                                                                </div>
                                                            )}
                                                            {/* Today marker */}
                                                            {qi === TODAY_Q && qi !== h.qIndex && (
                                                                <div style={{ width: 1, height: 22, background: "#fbbf2430", margin: "0 auto" }} />
                                                            )}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {ganttRows.length === 0 && (
                                    <div style={{ padding: "40px", textAlign: "center", color: "#334155", fontSize: 13 }}>No hires match the current filter.</div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ─────────────────────── AI CHAT ─────────────────────── */}
                    {tab === "chat" && (
                        <div style={{ display: "flex", flexDirection: "column", maxWidth: 780, margin: "0 auto", width: "100%", height: "calc(100vh - 168px)" }}>
                            {/* Messages */}
                            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14, paddingBottom: 8 }}>
                                {messages.map((m, i) => (
                                    <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                                        {m.role === "ai" && (
                                            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0, marginRight: 10, marginTop: 2 }}>C</div>
                                        )}
                                        <div style={{
                                            maxWidth: "74%", padding: "12px 16px",
                                            borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
                                            background: m.role === "user" ? "linear-gradient(135deg,#1d4ed8,#4f46e5)" : "#0f172a",
                                            border: m.role === "ai" ? "1px solid #1e293b" : "none",
                                            fontSize: 12.5, lineHeight: 1.7, color: m.role === "user" ? "#fff" : "#94a3b8",
                                            whiteSpace: "pre-line",
                                        }}>{m.text}</div>
                                    </div>
                                ))}
                                {typing && (
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>C</div>
                                        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "4px 18px 18px 18px", padding: "12px 18px", display: "flex", gap: 5 }}>
                                            {[0, 0.15, 0.3].map((d, i) => (
                                                <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#475569", animation: "bounce 1s infinite", animationDelay: `${d}s` }} />
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEnd} />
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 11 }}>
                                {Object.keys(AI_RESPONSES).map((q, i) => (
                                    <button key={i} onClick={() => sendMessage(q)}
                                        style={{ fontSize: 11, padding: "5px 12px", borderRadius: 20, background: "#0f172a", border: "1px solid #1e293b", color: "#64748b", cursor: "pointer" }}
                                        onMouseEnter={e => { e.target.style.borderColor = "#3b82f6"; e.target.style.color = "#93c5fd"; }}
                                        onMouseLeave={e => { e.target.style.borderColor = "#1e293b"; e.target.style.color = "#64748b"; }}>
                                        {q.length > 56 ? q.slice(0, 56) + "…" : q}
                                    </button>
                                ))}
                            </div>
                            <div style={{ display: "flex", gap: 10 }}>
                                <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()}
                                    placeholder="Ask about projections, hiring timing, capacity risks, scenarios..."
                                    style={{ flex: 1, background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: "12px 16px", fontSize: 12.5, color: "#e2e8f0", outline: "none" }}
                                    onFocus={e => e.target.style.borderColor = "#3b82f6"}
                                    onBlur={e => e.target.style.borderColor = "#1e293b"} />
                                <button onClick={() => sendMessage()}
                                    style={{ background: "linear-gradient(135deg,#1d4ed8,#4f46e5)", border: "none", borderRadius: 12, padding: "12px 22px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                                    Send
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
            <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}`}</style>
        </div>
    );
}
