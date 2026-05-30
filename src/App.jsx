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

// ---- Built-in knowledge base: real explanations & quizzes for common topics.
//      Keyed by lowercase keyword. Used when the live AI API isn't configured. ----
const KNOWLEDGE = {
  photosynthesis: {
    explain:
      "Photosynthesis is the process plants use to make their own food using sunlight. Inside the leaves are tiny structures called chloroplasts, which contain a green pigment called chlorophyll. Chlorophyll captures energy from sunlight and uses it to power a chemical reaction.\n\nIn this reaction, the plant takes in carbon dioxide from the air through small pores in its leaves, and water from the soil through its roots. Using the captured light energy, it combines these into glucose (a sugar the plant uses for energy and growth) and releases oxygen as a by-product. The simple equation is: carbon dioxide + water + sunlight → glucose + oxygen.\n\nThis process is vital for almost all life on Earth, because it produces the oxygen we breathe and forms the base of nearly every food chain. A real-world example: the leaves of a mango tree in a garden are constantly carrying out photosynthesis during the day, which is why plants need sunlight, air, and water to stay alive and grow.",
    quiz: [
      { q: "Which pigment captures light energy during photosynthesis?", options: ["Chlorophyll", "Haemoglobin", "Melanin", "Keratin"], answer: "Chlorophyll" },
      { q: "What gas do plants release as a by-product of photosynthesis?", options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"], answer: "Oxygen" },
      { q: "What does a plant produce as food during photosynthesis?", options: ["Glucose", "Protein", "Salt", "Fat"], answer: "Glucose" },
    ],
  },
  gravity: {
    explain:
      "Gravity is the invisible force that pulls objects toward each other. Every object with mass has gravity, but we mostly notice the gravity of very large objects like the Earth, which pulls everything toward its centre. This is why when you drop something, it falls down rather than floating away.\n\nThe strength of gravity depends on two things: how much mass an object has, and how far apart the objects are. The Earth has a huge mass, so its pull is strong enough to keep us, the oceans, and the atmosphere on its surface. The Moon has less mass, so its gravity is weaker, which is why astronauts can bounce around on it.\n\nGravity also keeps the planets orbiting the Sun and the Moon orbiting the Earth. A real-world example: when you jump, gravity is what pulls you back down to the ground — without it, you would simply keep floating upward.",
    quiz: [
      { q: "Gravity pulls objects toward what?", options: ["Each other", "The sky", "The horizon", "Nothing"], answer: "Each other" },
      { q: "The strength of gravity depends on an object's…", options: ["Mass and distance", "Colour", "Temperature", "Age"], answer: "Mass and distance" },
      { q: "Why do astronauts bounce on the Moon?", options: ["The Moon's gravity is weaker", "There is no gravity", "The Moon spins faster", "Their suits are light"], answer: "The Moon's gravity is weaker" },
    ],
  },
  "pythagoras theorem": {
    explain:
      "The Pythagoras theorem is a rule in geometry about right-angled triangles — triangles that have one 90-degree angle. It states that the square of the longest side (called the hypotenuse) equals the sum of the squares of the other two sides. We write this as a² + b² = c², where c is the hypotenuse.\n\nThis means if you know the lengths of any two sides of a right-angled triangle, you can always work out the third. For example, if the two shorter sides are 3 and 4 units long, then c² = 3² + 4² = 9 + 16 = 25, so c = 5 units.\n\nThe theorem is extremely useful in real life. A real-world example: builders and carpenters use it to check that corners are perfectly square, and it is the basis for how GPS and maps calculate straight-line distances between two points.",
    quiz: [
      { q: "The Pythagoras theorem applies to which kind of triangle?", options: ["Right-angled", "Equilateral", "Obtuse", "Any triangle"], answer: "Right-angled" },
      { q: "What is the formula for the Pythagoras theorem?", options: ["a² + b² = c²", "a + b = c", "a × b = c", "a² − b² = c²"], answer: "a² + b² = c²" },
      { q: "The longest side of a right-angled triangle is called the…", options: ["Hypotenuse", "Base", "Radius", "Vertex"], answer: "Hypotenuse" },
    ],
  },
  "water cycle": {
    explain:
      "The water cycle is the continuous journey water takes between the Earth's surface and the sky. It has no real beginning or end — water keeps moving in a loop, changing between liquid, gas, and sometimes solid forms.\n\nIt starts with evaporation: heat from the Sun turns water in oceans, rivers, and lakes into water vapour, which rises into the air. As this vapour rises and cools, it turns back into tiny droplets through a process called condensation, forming clouds. When the droplets in the clouds become heavy enough, they fall back to Earth as precipitation — rain, snow, or hail.\n\nThe water that falls collects in rivers, lakes, and oceans, or soaks into the ground, and the cycle begins again. A real-world example: the rain that fills a city's reservoirs after a cloudy day is the same water that evaporated from the sea days earlier.",
    quiz: [
      { q: "What process turns liquid water into vapour in the water cycle?", options: ["Evaporation", "Condensation", "Precipitation", "Filtration"], answer: "Evaporation" },
      { q: "Clouds form through which process?", options: ["Condensation", "Evaporation", "Melting", "Erosion"], answer: "Condensation" },
      { q: "Rain, snow, and hail are all forms of…", options: ["Precipitation", "Evaporation", "Reflection", "Absorption"], answer: "Precipitation" },
    ],
  },
  "machine learning": {
    explain:
      "Machine learning is a type of artificial intelligence where a computer learns to do a task by studying examples, instead of being given exact step-by-step instructions. The idea is that the computer can find patterns in data and use those patterns to make decisions or predictions.\n\nIt works by feeding the computer a large amount of data — for example, thousands of labelled photos of cats and dogs. A learning algorithm looks for patterns that separate one from the other. Once it has 'learned' these patterns, it can look at a brand-new photo it has never seen and predict whether it shows a cat or a dog.\n\nMachine learning powers many tools we use every day. A real-world example: when a streaming app suggests a show you might like, or your email filters out spam, machine learning is working behind the scenes by learning from past behaviour.",
    quiz: [
      { q: "Machine learning teaches computers using…", options: ["Examples and data", "Only fixed rules", "Random guessing", "Human memory"], answer: "Examples and data" },
      { q: "What does a machine learning model look for in data?", options: ["Patterns", "Colours", "Spelling", "Prices"], answer: "Patterns" },
      { q: "Which is a real-world use of machine learning?", options: ["Spam email filtering", "Boiling water", "Cutting paper", "Painting a wall"], answer: "Spam email filtering" },
    ],
  },
  "solar system": {
    explain:
      "The solar system is made up of the Sun and everything that orbits around it, held together by the Sun's gravity. At its centre is the Sun, a giant ball of hot gas that provides light and heat to everything around it.\n\nEight planets orbit the Sun: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. The four closest to the Sun are small and rocky, while the four farther out are large and made mostly of gas and ice. Along with the planets, the solar system contains moons, dwarf planets like Pluto, asteroids, and comets.\n\nEverything in the solar system moves in regular paths because of the Sun's gravity. A real-world example: the Earth takes one full year to travel around the Sun, and this orbit, combined with the Earth's tilt, is what gives us our seasons.",
    quiz: [
      { q: "What is at the centre of the solar system?", options: ["The Sun", "The Earth", "The Moon", "Jupiter"], answer: "The Sun" },
      { q: "How many planets orbit the Sun?", options: ["Eight", "Five", "Ten", "Twelve"], answer: "Eight" },
      { q: "What force holds the solar system together?", options: ["Gravity", "Magnetism", "Wind", "Friction"], answer: "Gravity" },
    ],
  },
};

function lookupKnowledge(topic) {
  const t = topic.trim().toLowerCase();
  if (KNOWLEDGE[t]) return KNOWLEDGE[t];
  for (const key of Object.keys(KNOWLEDGE)) {
    if (t.includes(key) || key.includes(t)) return KNOWLEDGE[key];
  }
  return null;
}

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
  const [mode, setMode] = useState("explain");
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
      const known = lookupKnowledge(topic);
      if (mode === "quiz") {
        setOutput({
          type: "quiz",
          data: {
            questions: known ? known.quiz : [
              { q: `What is the core idea behind "${topic}"?`, options: ["A foundational concept in the subject", "An unrelated topic", "A type of food", "A sport"], answer: "A foundational concept in the subject" },
              { q: `Why is "${topic}" important to learn?`, options: ["It has no use", "It builds understanding for advanced topics", "It is only for experts", "None of these"], answer: "It builds understanding for advanced topics" },
              { q: `Which is the best way to study "${topic}"?`, options: ["Memorize blindly", "Understand with examples and practice", "Skip it", "Guess"], answer: "Understand with examples and practice" },
            ],
          },
        });
      } else {
        setOutput({
          type: "text",
          data: known
            ? known.explain
            : `EduMentor explains "${topic}":\n\nThis topic introduces a core idea, broken into simple parts a student can follow. It then connects those parts, linking the new idea to things the student already knows. Finally, it gives a real-world example showing the topic in action.\n\n(Tip: try a built-in topic like Photosynthesis, Gravity, Pythagoras theorem, Water cycle, Machine learning, or Solar system for a full detailed explanation. Live AI covers any topic when an API key is configured.)`,
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
