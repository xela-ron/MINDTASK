import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import Icon from "./Icon";

const STATUS_COLS = [
  { key: "todo",        label: "To Do",       dot: "#6b6b6b" },
  { key: "in-progress", label: "In Progress", dot: "#fbbf24" },
  { key: "done",        label: "Done",        dot: "#4ade80" },
];

const PRIORITY_OPTIONS = ["high", "medium", "low"];
const TAG_OPTIONS = ["Dev", "Design", "AI", "QA", "Planning", "DevOps", "Research", "Other"];

export default function TaskBoard({ tasks, onUpdateTasks }) {
  const t = useTheme();
  const [adding, setAdding] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", priority: "medium", tag: "Dev" });
  const [filter, setFilter] = useState("all");

  const addTask = () => {
    if (!newTask.title.trim()) return;
    const task = { id: Date.now().toString(), ...newTask, status: "todo" };
    onUpdateTasks(prev => [...prev, task]);
    setNewTask({ title: "", priority: "medium", tag: "Dev" });
    setAdding(false);
  };

  const cycleStatus = (id) => {
    const order = ["todo", "in-progress", "done"];
    onUpdateTasks(prev => prev.map(task =>
      task.id === id ? { ...task, status: order[(order.indexOf(task.status) + 1) % 3] } : task
    ));
  };

  const deleteTask = (id) => onUpdateTasks(prev => prev.filter(t => t.id !== id));

  const filteredTasks = filter === "all" ? tasks : tasks.filter(t => t.priority === filter);

  const priorityClass = (p) => `priority-${p}`;
  const statusDot = (s) => STATUS_COLS.find(c => c.key === s)?.dot || t.muted;
  const statusLabel = (s) => STATUS_COLS.find(c => c.key === s)?.label || s;

  const inp = { background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 8, padding: "8px 12px", color: t.text, fontSize: 13, outline: "none" };

  return (
    <div style={{ padding: "48px 60px 80px", maxWidth: 1100, margin: "0 auto", width: "100%" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 28 }}>
        <span style={{ fontSize: 44 }}>✅</span>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, fontFamily: "'Lora', serif", color: t.text }}>My Tasks</h1>
          <p style={{ fontSize: 13, color: t.muted, marginTop: 2 }}>{tasks.length} tasks · {tasks.filter(t => t.status === "done").length} completed</p>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
        <button className="btn-base" onClick={() => setAdding(true)}
          style={{ display: "flex", alignItems: "center", gap: 6, background: t.accent, color: "#fff", padding: "8px 16px", borderRadius: 9, fontSize: 13, fontWeight: 500, boxShadow: "0 2px 10px rgba(91,138,240,0.28)" }}>
          <Icon name="plus" size={14} /> New Task
        </button>

        {/* Priority filter */}
        <div style={{ display: "flex", gap: 6, background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 9, padding: 4 }}>
          {["all", "high", "medium", "low"].map(f => (
            <button key={f} className="btn-base" onClick={() => setFilter(f)}
              style={{ padding: "5px 12px", borderRadius: 6, fontSize: 12, fontWeight: 500, background: filter === f ? t.accent : "transparent", color: filter === f ? "#fff" : t.muted, transition: "all 0.15s" }}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Add task form */}
      {adding && (
        <div className="slide-up" style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 16, marginBottom: 20, boxShadow: t.shadow }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <input value={newTask.title} onChange={e => setNewTask(n => ({ ...n, title: e.target.value }))}
              onKeyDown={e => e.key === "Enter" && addTask()}
              placeholder="Task title..."
              autoFocus
              style={{ ...inp, flex: 1, minWidth: 200 }} />
            <select value={newTask.priority} onChange={e => setNewTask(n => ({ ...n, priority: e.target.value }))}
              style={{ ...inp, width: "auto" }}>
              {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)} Priority</option>)}
            </select>
            <select value={newTask.tag} onChange={e => setNewTask(n => ({ ...n, tag: e.target.value }))}
              style={{ ...inp, width: "auto" }}>
              {TAG_OPTIONS.map(tag => <option key={tag} value={tag}>{tag}</option>)}
            </select>
            <button className="btn-base" onClick={addTask}
              style={{ background: t.accent, color: "#fff", padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500 }}>Add</button>
            <button className="btn-base" onClick={() => setAdding(false)}
              style={{ background: t.hover, color: t.muted, padding: "8px 12px", borderRadius: 8, fontSize: 13 }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Kanban columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18, alignItems: "start" }}>
        {STATUS_COLS.map(col => {
          const colTasks = filteredTasks.filter(task => task.status === col.key);
          return (
            <div key={col.key}>
              {/* Column header */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, padding: "0 2px" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: col.dot, boxShadow: `0 0 6px ${col.dot}55` }} />
                <span style={{ fontSize: 11.5, fontWeight: 600, color: t.muted, textTransform: "uppercase", letterSpacing: "0.07em" }}>{col.label}</span>
                <span style={{ marginLeft: "auto", fontSize: 11, color: t.muted, background: t.tagBg, padding: "1px 7px", borderRadius: 10, fontWeight: 500 }}>{colTasks.length}</span>
              </div>

              {/* Cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: 9, minHeight: 80 }}>
                {colTasks.map(task => (
                  <div key={task.id} className="task-card"
                    style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 11, padding: "13px 14px", boxShadow: t.dark ? "0 1px 6px rgba(0,0,0,0.35)" : "0 1px 6px rgba(0,0,0,0.06)" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <button className="btn-base" onClick={() => cycleStatus(task.id)}
                        style={{ background: "none", color: statusDot(task.status), padding: 0, marginTop: 1, flexShrink: 0, lineHeight: 0 }}>
                        <Icon name={task.status === "done" ? "check" : "circle"} size={15} />
                      </button>
                      <span style={{ fontSize: 13, flex: 1, lineHeight: 1.45, textDecoration: task.status === "done" ? "line-through" : "none", color: task.status === "done" ? t.muted : t.text }}>
                        {task.title}
                      </span>
                      <button className="btn-base" onClick={() => deleteTask(task.id)}
                        style={{ background: "none", color: t.muted, padding: 1, opacity: 0.45, lineHeight: 0, flexShrink: 0 }}>
                        <Icon name="x" size={12} />
                      </button>
                    </div>
                    <div style={{ display: "flex", gap: 6, marginTop: 9, paddingLeft: 23 }}>
                      <span className={priorityClass(task.priority)}
                        style={{ fontSize: 10.5, padding: "2px 8px", borderRadius: 6, fontWeight: 500 }}>
                        {task.priority}
                      </span>
                      <span style={{ fontSize: 10.5, padding: "2px 8px", borderRadius: 6, background: t.tagBg, color: t.muted, fontWeight: 500 }}>
                        {task.tag}
                      </span>
                    </div>
                  </div>
                ))}

                {colTasks.length === 0 && (
                  <div style={{ border: `1px dashed ${t.border}`, borderRadius: 11, padding: "18px 14px", textAlign: "center", color: t.muted, fontSize: 12 }}>
                    No tasks
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
