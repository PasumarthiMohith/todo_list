import { useState, useEffect } from "react";

const defaultTodos = [
  { id: 1, text: "Create landing page UI",   priority: "high",   done: false },
  { id: 2, text: "Improve responsive layout", priority: "medium", done: true  },
  { id: 3, text: "Deploy project to Vercel",  priority: "low",    done: false },
];

export default function App() {
  const [todos, setTodos]   = useState(() => {
    const saved = localStorage.getItem("checkmate");
    return saved ? JSON.parse(saved) : defaultTodos;
  });
  const [input, setInput]   = useState("");
  const [priority, setPriority] = useState("medium");
  const [filter, setFilter] = useState("all");
  const [toast, setToast]   = useState("");

  useEffect(() => {
    localStorage.setItem("checkmate", JSON.stringify(todos));
  }, [todos]);

  let toastTimer;
  function showToast(msg) {
    setToast(msg);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => setToast(""), 2000);
  }

  function addTask() {
    if (!input.trim()) return;
    setTodos([{ id: Date.now(), text: input.trim(), priority, done: false }, ...todos]);
    setInput("");
    showToast("✅ Task added!");
  }

  function toggle(id) {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
    const t = todos.find(t => t.id === id);
    showToast(t.done ? "↩ Marked active" : "✅ Done!");
  }

  function del(id) {
    setTodos(todos.filter(t => t.id !== id));
    showToast("🗑 Deleted");
  }

  function clearDone() {
    const count = todos.filter(t => t.done).length;
    if (!count) { showToast("Nothing to clear!"); return; }
    setTodos(todos.filter(t => !t.done));
    showToast("🧹 Cleared!");
  }

  const filtered = todos.filter(t =>
    filter === "active" ? !t.done : filter === "completed" ? t.done : true
  );

  return (
    <div style={styles.body}>
      <div style={styles.app}>

        {/* HEADER */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 600, marginBottom: 4 }}>CheckMate ✓</h1>
          <p style={{ fontSize: 14, color: "#6b7280" }}>Keep track of what matters</p>
        </div>

        {/* STATS */}
        <div style={styles.stats}>
          {[
            { label: "Total",   value: todos.length },
            { label: "Pending", value: todos.filter(t => !t.done).length },
            { label: "Done",    value: todos.filter(t =>  t.done).length },
          ].map(s => (
            <div key={s.label} style={styles.stat}>
              <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 2 }}>{s.value}</h2>
              <p style={{ fontSize: 12, color: "#6b7280" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* FORM */}
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <input
            style={styles.input}
            type="text"
            placeholder="Add a new task..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addTask()}
          />
          <select style={styles.select} value={priority} onChange={e => setPriority(e.target.value)}>
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
        </div>
        <button style={styles.addBtn} onClick={addTask}>+ Add Task</button>

        {/* FILTERS */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          {["all", "active", "completed"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{ ...styles.filterBtn, ...(filter === f ? styles.filterActive : {}) }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* LIST */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.length === 0 && (
            <p style={{ textAlign: "center", color: "#9ca3af", padding: "40px 0", fontSize: 14 }}>
              No tasks here yet.
            </p>
          )}
          {filtered.map(t => (
            <div key={t.id} style={styles.todoItem}>
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => toggle(t.id)}
                style={{ width: 17, height: 17, cursor: "pointer", accentColor: "#6366f1" }}
              />
              <span style={{ ...styles.taskText, ...(t.done ? styles.taskDone : {}) }}>
                {t.text}
              </span>
              <span style={{ ...styles.badge, ...styles[t.priority] }}>{t.priority}</span>
              <button style={styles.delBtn} onClick={() => del(t.id)}>×</button>
            </div>
          ))}
        </div>

        {/* CLEAR */}
        <button style={styles.clearBtn} onClick={clearDone}>🗑 Clear Completed</button>
      </div>

      {/* TOAST */}
      {toast && <div style={styles.toast}>{toast}</div>}
    </div>
  );
}

const styles = {
  body: {
    fontFamily: "sans-serif",
    background: "#f3f4f6",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    padding: "40px 16px 60px",
    color: "#111",
  },
  app: { width: "100%", maxWidth: 520 },
  stats: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 24 },
  stat: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: 14, textAlign: "center" },
  input: { flex: 1, padding: "10px 14px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, outline: "none", background: "#fff" },
  select: { padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, background: "#fff", outline: "none", cursor: "pointer" },
  addBtn: { width: "100%", padding: 11, background: "#6366f1", color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", marginBottom: 20 },
  filterBtn: { padding: "6px 16px", border: "1px solid #d1d5db", borderRadius: 999, background: "#fff", fontSize: 13, cursor: "pointer", color: "#374151" },
  filterActive: { background: "#6366f1", color: "white", borderColor: "#6366f1" },
  todoItem: { display: "flex", alignItems: "center", gap: 12, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "13px 16px" },
  taskText: { flex: 1, fontSize: 14, color: "#111827" },
  taskDone: { textDecoration: "line-through", color: "#9ca3af" },
  badge: { fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999, textTransform: "uppercase" },
  high:   { background: "#fee2e2", color: "#b91c1c" },
  medium: { background: "#fef9c3", color: "#92400e" },
  low:    { background: "#dcfce7", color: "#166534" },
  delBtn: { background: "none", border: "none", fontSize: 18, color: "#9ca3af", cursor: "pointer" },
  clearBtn: { width: "100%", marginTop: 16, padding: 11, background: "transparent", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, color: "#ef4444", cursor: "pointer" },
  toast: { position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#1f2937", color: "#fff", padding: "10px 20px", borderRadius: 999, fontSize: 13 },
};