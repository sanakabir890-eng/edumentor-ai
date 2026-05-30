import { useState } from "react";

// =============================================================
//  EduMentor AI — An AI Agent for SDG 4: Quality Education
//  Aligned with Vision 2030 & Vision 2035 education goals
//  Three dashboards: User (Student), Admin, Client (Institution)
// =============================================================

const COLORS = {
  bg: "#0f1419",
  panel: "#1a2129",
  accent: "#f4a259",
  accent2: "#5bc0be",
  text: "#e8eef2",
  sub: "#8a99a8",
  border: "#2a333d",
};

// ---- Simple in-memory "database" (acts as Kaggle-hosted data stub) ----
const SEED = {
  students: [
    { id: 1, name: "Ayesha Khan", topics: 12, quizzes: 8, avgScore: 84 },
    { id: 2, name: "Bilal Ahmed", topics: 7, quizzes: 4, avgScore: 71 },
    { id: 3, name: "Sara Malik", topics: 19, quizzes: 14, avgScore: 91 },
  ],
  institutions: [
    { id: 1, name: "Future Skills Academy", students: 240, activeRate: 78 },
    { id: 2, name: "Vision 2030 Learning Hub", students: 512, activeRate: 85 },
  ],
};

export default function App() {
  const [view, setView] = useState("user");

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, color: COLORS.text, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <Header view={view} setView={setView} />
      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 16px" }}>
        {view === "user" && <UserDashboard />}
        {view === "admin" && <AdminDashboard />}
        {view === "client" && <ClientDashboard />}
      </main>
      <Footer />
    </div>
  );
}

function Header({ view, setView }) {
  const tabs = [
    { id: "user", label: "Student" },
    { id: "admin", label: "Admin" },
    { id: "client", label: "Institution (Client)" },
  ];
  return (
    <header style={{ borderBottom: `1px solid ${COLORS.border}`, background: COLORS.panel }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "16px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>
            <span style={{ color: COLORS.accent }}>Edu</span>
            <span style={{ color: COLORS.accent2 }}>Mentor</span> AI
          </div>
          <div style={{ fontSize: 12, color: COLORS.sub }}>AI Agent · SDG 4 Quality Education · Vision 2030/2035</div>
        </div>
        <nav style={{ display: "flex", gap: 8 }}>
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setView(t.id)}
              style={{
                padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontSize: 14,
                border: `1px solid ${view === t.id ? COLORS.accent : COLORS.border}`,
                background: view === t.id ? COLORS.accent : "transparent",
                color: view === t.id ? COLORS.bg : COLORS.text, fontWeight: 600,
              }}>
              {t.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer style={{ textAlign: "center", padding: "24px", color: COLORS.sub, fontSize: 12, borderTop: `1px solid ${COLORS.border}`, marginTop: 40 }}>
      EduMentor AI — Built for SDG 4. Data hosted via Kaggle dataset · Code on GitHub · Deployed on Vercel
    </footer>
  );
}

function Card({ children, style }) {
  return (
    <div style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 20, ...style }}>
      {children}
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <Card style={{ flex: 1, minWidth: 140 }}>
      <div style={{ fontSize: 13, color: COLORS.sub }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: color || COLORS.text, marginTop: 4 }}>{value}</div>
    </Card>
  );
}

// =============================================================
//  USER (STUDENT) DASHBOARD — the actual AI agent lives here
// =============================================================
function UserDashboard() {
  const [mode, setMode] = useState("explain"); // explain | quiz
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState("");

  async function runAgent() {
    if (!topic.trim()) return;
    setLoading(true); setError(""); setOutput(null);

    const prompt =
      mode === "explain"
        ? `You are EduMentor, an education AI agent supporting UN SDG 4 (Quality Education). Explain the topic "${topic}" simply and clearly for a student, in 3 short paragraphs. End with one real-world example.`
        : `You are EduMentor, an education AI agent for SDG 4. Create a 3-question multiple-choice quiz about "${topic}". Respond ONLY with valid JSON, no markdown, in this exact shape: {"questions":[{"q":"...","options":["A","B","C","D"],"answer":"the correct option text"}]}`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (!res.ok) throw new Error("api");
      const data = await res.json();
      const text = data.content.filter((c) => c.type === "text").map((c) => c.text).join("\n");

      if (mode === "quiz") {
        const clean = text.replace(/```json|```/g, "").trim();
        setOutput({ type: "quiz", data: JSON.parse(clean) });
      } else {
        setOutput({ type: "text", data: text });
      }
    } catch (e) {
      // Demo fallback: shows a representative agent response when the live API
      // key isn't configured (e.g. on the public Vercel deployment).
      if (mode === "quiz") {
        setOutput({
          type: "quiz",
          data: {
            questions: [
              { q: `What is the core idea behind "${topic}"?`, options: ["A foundational concept in the subject", "An unrelated topic", "A type of food", "A sport"], answer: "A foundational concept in the subject" },
              { q: `Why is "${topic}" important to learn?`, options: ["It has no use", "It builds understanding for advanced topics", "It is only for experts", "None of these"], answer: "It builds understanding for advanced topics" },
              { q: `Which is the best way to study "${topic}"?`, options: ["Memorize blindly", "Understand with examples and practice", "Skip it", "Guess"], answer: "Understand with examples and practice" },
            ],
          },
        });
      } else {
        setOutput({
          type: "text",
          data: `(Demo mode) EduMentor would explain "${topic}" here in three clear paragraphs:\n\nFirst, it introduces the core idea in simple language a student can follow, breaking the concept into its most basic parts.\n\nNext, it explains how the parts connect and why the topic matters, linking it to things the student already knows so the new idea sticks.\n\nFinally, it gives a real-world example showing the topic in action. Live AI responses run when an API key is configured — see the README for the one-step setup.`,
        });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h2 style={{ margin: 0 }}>Student Learning Agent</h2>
      <p style={{ color: COLORS.sub, marginTop: -8 }}>
        Ask EduMentor to explain any topic or generate a practice quiz. This directly supports SDG 4 by giving every student free, on-demand tutoring.
      </p>

      <Card>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <button onClick={() => { setMode("explain"); setOutput(null); }}
            style={tabBtn(mode === "explain")}>Explain a Topic</button>
          <button onClick={() => { setMode("quiz"); setOutput(null); }}
            style={tabBtn(mode === "quiz")}>Generate Quiz</button>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runAgent()}
            placeholder='e.g. "Photosynthesis" or "Pythagoras theorem"'
            style={{ flex: 1, minWidth: 200, padding: "12px", borderRadius: 8, border: `1px solid ${COLORS.border}`, background: COLORS.bg, color: COLORS.text, fontSize: 14 }}
          />
          <button onClick={runAgent} disabled={loading}
            style={{ padding: "12px 20px", borderRadius: 8, border: "none", background: COLORS.accent, color: COLORS.bg, fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
            {loading ? "Thinking…" : "Ask Agent"}
          </button>
        </div>
      </Card>

      {error && <Card style={{ borderColor: "#c0392b" }}><span style={{ color: "#e74c3c" }}>{error}</span></Card>}
      {output?.type === "text" && (
        <Card><div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{output.data}</div></Card>
      )}
      {output?.type === "quiz" && <Quiz quiz={output.data} />}
    </div>
  );
}

function Quiz({ quiz }) {
  const [picked, setPicked] = useState({});
  return (
    <Card>
      <h3 style={{ marginTop: 0 }}>Practice Quiz</h3>
      {quiz.questions.map((q, i) => (
        <div key={i} style={{ marginBottom: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>{i + 1}. {q.q}</div>
          {q.options.map((opt, j) => {
            const chosen = picked[i] === opt;
            const correct = opt === q.answer;
            const show = picked[i] != null;
            return (
              <div key={j} onClick={() => setPicked({ ...picked, [i]: opt })}
                style={{
                  padding: "8px 12px", borderRadius: 8, marginBottom: 6, cursor: "pointer",
                  border: `1px solid ${show && correct ? COLORS.accent2 : show && chosen ? "#c0392b" : COLORS.border}`,
                  background: show && correct ? "rgba(91,192,190,0.15)" : "transparent",
                }}>
                {opt}{show && correct ? "  ✓" : ""}
              </div>
            );
          })}
        </div>
      ))}
    </Card>
  );
}

// =============================================================
//  ADMIN DASHBOARD
// =============================================================
function AdminDashboard() {
  const s = SEED.students;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h2 style={{ margin: 0 }}>Admin Dashboard</h2>
      <p style={{ color: COLORS.sub, marginTop: -8 }}>System-wide oversight of all students using the EduMentor agent.</p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Stat label="Total Students" value={s.length} color={COLORS.accent} />
        <Stat label="Topics Explained" value={s.reduce((a, x) => a + x.topics, 0)} color={COLORS.accent2} />
        <Stat label="Quizzes Taken" value={s.reduce((a, x) => a + x.quizzes, 0)} />
        <Stat label="Avg Score" value={Math.round(s.reduce((a, x) => a + x.avgScore, 0) / s.length) + "%"} color={COLORS.accent} />
      </div>
      <Card>
        <h3 style={{ marginTop: 0 }}>Student Activity</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ color: COLORS.sub, textAlign: "left" }}>
              <th style={th}>Student</th><th style={th}>Topics</th><th style={th}>Quizzes</th><th style={th}>Avg Score</th>
            </tr>
          </thead>
          <tbody>
            {s.map((x) => (
              <tr key={x.id} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                <td style={td}>{x.name}</td><td style={td}>{x.topics}</td><td style={td}>{x.quizzes}</td>
                <td style={td}><Bar pct={x.avgScore} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// =============================================================
//  CLIENT (INSTITUTION) DASHBOARD
// =============================================================
function ClientDashboard() {
  const inst = SEED.institutions;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h2 style={{ margin: 0 }}>Institution Dashboard</h2>
      <p style={{ color: COLORS.sub, marginTop: -8 }}>For partner schools & universities tracking adoption against Vision 2030/2035 education targets.</p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Stat label="Partner Institutions" value={inst.length} color={COLORS.accent2} />
        <Stat label="Reached Students" value={inst.reduce((a, x) => a + x.students, 0)} color={COLORS.accent} />
        <Stat label="Avg Active Rate" value={Math.round(inst.reduce((a, x) => a + x.activeRate, 0) / inst.length) + "%"} />
      </div>
      {inst.map((x) => (
        <Card key={x.id}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <strong>{x.name}</strong><span style={{ color: COLORS.sub }}>{x.students} students</span>
          </div>
          <Bar pct={x.activeRate} />
          <div style={{ fontSize: 12, color: COLORS.sub, marginTop: 4 }}>{x.activeRate}% weekly active learners</div>
        </Card>
      ))}
      <Card style={{ borderColor: COLORS.accent2 }}>
        <strong style={{ color: COLORS.accent2 }}>SDG 4 Impact</strong>
        <p style={{ color: COLORS.sub, margin: "8px 0 0" }}>
          EduMentor extends quality tutoring to learners regardless of income or location — a core SDG 4 target and a pillar of Vision 2030 and Vision 2035 education strategy.
        </p>
      </Card>
    </div>
  );
}

function Bar({ pct }) {
  return (
    <div style={{ background: COLORS.bg, borderRadius: 6, overflow: "hidden", height: 10, width: "100%" }}>
      <div style={{ width: pct + "%", height: "100%", background: pct > 80 ? COLORS.accent2 : COLORS.accent }} />
    </div>
  );
}

const th = { padding: "8px 6px", fontWeight: 600 };
const td = { padding: "10px 6px" };
const tabBtn = (active) => ({
  padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600,
  border: `1px solid ${active ? COLORS.accent : COLORS.border}`,
  background: active ? "rgba(244,162,89,0.15)" : "transparent",
  color: active ? COLORS.accent : COLORS.text,
});
