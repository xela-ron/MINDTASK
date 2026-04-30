// ============================================================
// MindTask - Notion Clone + Mental Health Chatbot
// Full multi-file React project bundled for preview
//
// 📁 Project Structure:
//   src/
//     App.jsx
//     context/
//       ThemeContext.jsx
//       AuthContext.jsx
//     data/
//       defaults.js
//     utils/
//       wellness.js
//       markdown.jsx
//     styles/
//       GlobalStyles.jsx
//     components/
//       Icon.jsx
//       Sidebar.jsx
//       PageEditor.jsx
//       TaskBoard.jsx
//       ChatPanel.jsx
//     pages/
//       AuthPage.jsx
//       Dashboard.jsx
// ============================================================

import { useState, useRef, useEffect, createContext, useContext } from "react";

// ─── DEFAULTS ────────────────────────────────────────────────────────────────
const DEFAULT_PAGES = [
  { id: "p1", title: "Welcome to MindTask 🌱", icon: "🌱", content: "# Welcome to MindTask\n\nThis is your personal productivity space with a mental wellness companion.\n\n## Getting Started\n\n- Create pages for your notes and ideas\n- Manage your tasks with the Task Board\n- Chat with MindEase whenever you feel stressed\n\n> **Tip:** Click the 💬 button in the bottom right to open your wellness companion anytime.", type: "page" },
  { id: "p2", title: "My Notes", icon: "📝", content: "# My Notes\n\nUse this page to jot down your thoughts, ideas, and reflections.\n\n## Today's Focus\n\n- What's the most important thing to accomplish today?\n- What can I let go of?\n- How am I feeling right now?\n\n> Small consistent steps lead to big changes. 🌿", type: "page" },
  { id: "p3", title: "My Tasks", icon: "✅", content: "", type: "tasks" },
];
const DEFAULT_TASKS = [
  { id: "t1", title: "Review project requirements",   status: "done",        priority: "high",   tag: "Planning" },
  { id: "t2", title: "Set up development environment", status: "done",        priority: "high",   tag: "Dev" },
  { id: "t3", title: "Design UI wireframes",           status: "in-progress", priority: "high",   tag: "Design" },
  { id: "t4", title: "Build authentication system",    status: "todo",        priority: "high",   tag: "Dev" },
  { id: "t5", title: "Integrate AI chatbot API",       status: "todo",        priority: "medium", tag: "AI" },
  { id: "t6", title: "Write unit tests",               status: "todo",        priority: "low",    tag: "QA" },
];
function makeUserData(uid) {
  return {
    pages: DEFAULT_PAGES.map(p => ({ ...p, id: `${uid}-${p.id}` })),
    tasks: DEFAULT_TASKS.map(t => ({ ...t, id: `${uid}-${t.id}` })),
  };
}
const DEMO_USERS = [
  { id: "u1", name: "Alex Rivera",  email: "alex@mindtask.app",  password: "demo123", avatar: "AR", color: "#5b8af0" },
  { id: "u2", name: "Jamie Lee",    email: "jamie@mindtask.app", password: "demo123", avatar: "JL", color: "#c084fc" },
  { id: "u3", name: "Sam Torres",   email: "sam@mindtask.app",   password: "demo123", avatar: "ST", color: "#4ade80" },
];

// ─── WELLNESS ────────────────────────────────────────────────────────────────
const WELLNESS = [
  { triggers:["overwhelm","too much","stressed","stress","anxious","anxiety","panic"],     text:"I hear you — feeling overwhelmed is genuinely exhausting. 💙 Let's take this one step at a time. What's the single thing weighing on you the most right now? Sometimes naming it out loud makes it feel a little smaller." },
  { triggers:["tired","exhausted","burnt out","burnout","drained","no energy"],            text:"Burnout is real and serious. Your body and mind are sending you a signal. 🌿 Have you been able to take any breaks today? Even 5 minutes away from screens can genuinely reset your nervous system." },
  { triggers:["can't focus","distracted","procrastinat","can't start","where to start"],   text:"Trouble focusing is so common when tasks feel big. 🎯 Try this: just commit to starting for 5 minutes. Not finishing — just starting. That's usually all the momentum you need." },
  { triggers:["sad","lonely","down","depressed","hopeless","empty","worthless"],           text:"Thank you for trusting me with this. 💛 Feeling low is part of being human, but you don't have to sit with it alone. Is there someone you trust you could reach out to today?" },
  { triggers:["happy","great","amazing","excited","wonderful","feeling good","good today"],text:"That's so wonderful to hear! 🌟 Positive energy is worth celebrating. What's been going well? Recognizing your wins — even small ones — is one of the best things for your mental health." },
  { triggers:["deadline","due date","late","behind","running out of time"],                text:"Deadline pressure is intense — I get it. Take one slow breath first. 🌬️ Then write just the next 3 actions you need to take. Not everything. Just 3. What would those be?" },
  { triggers:["sleep","insomnia","can't sleep","tired but"],                               text:"Sleep struggles affect everything — mood, focus, energy. 🌙 Try dimming screens an hour before bed and avoid reviewing tasks at night. Your mind needs permission to rest. You've done enough today." },
  { triggers:["angry","frustrated","mad","irritated","annoyed"],                           text:"Frustration signals that something matters to you. 🔥 Try labeling it out loud: 'I feel frustrated because...' — this tiny act of naming actually calms your nervous system. What's at the root of it?" },
  { triggers:["hello","hi","hey","hiya"],                                                  text:"Hey there! 👋 So glad you opened MindEase. How are you feeling today — honestly? Whether it's work stress, personal stuff, or just a general blah, I'm here to listen." },
];
function fallbackResponse(msg) {
  const lower = msg.toLowerCase();
  for (const w of WELLNESS) if (w.triggers.some(t => lower.includes(t))) return w.text;
  return "I'm here with you. 🤍 Whatever you're carrying right now is valid. Would you like to talk about what's on your mind?";
}
async function getAIResponse(msg, name) {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg, name }),
    });
    if (!res.ok) throw new Error("AI service error");
    const data = await res.json();
    return data?.reply || fallbackResponse(msg);
  } catch (error) {
    console.error("getAIResponse error:", error);
    return fallbackResponse(msg);
  }
}

// ─── MARKDOWN ────────────────────────────────────────────────────────────────
function renderMarkdown(content) {
  if (!content) return null;
  return content.split("\n").map((line, i) => {
    const b = t => t.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    if (line.startsWith("# "))   return <h1 key={i}>{line.slice(2)}</h1>;
    if (line.startsWith("## "))  return <h2 key={i}>{line.slice(3)}</h2>;
    if (line.startsWith("### ")) return <h3 key={i}>{line.slice(4)}</h3>;
    if (line.startsWith("> "))   return <blockquote key={i} dangerouslySetInnerHTML={{__html: b(line.slice(2))}} />;
    if (line.startsWith("- "))   return <ul key={i}><li dangerouslySetInnerHTML={{__html: b(line.slice(2))}} /></ul>;
    if (/^\d+\. /.test(line))    return <ol key={i}><li dangerouslySetInnerHTML={{__html: b(line.replace(/^\d+\. /,""))}} /></ol>;
    if (line === "")             return <br key={i} />;
    return <p key={i} dangerouslySetInnerHTML={{__html: b(line)}} />;
  });
}

// ─── THEME CONTEXT ───────────────────────────────────────────────────────────
const ThemeCtx = createContext();
function ThemeProvider({ children }) {
  const [dark, setDark] = useState(true);
  const c = {
    dark, toggle: () => setDark(v => !v),
    bg:         dark ? "#0f0f0f" : "#ffffff",
    sidebar:    dark ? "#161616" : "#f7f7f5",
    surface:    dark ? "#1c1c1c" : "#ffffff",
    card:       dark ? "#1c1c1c" : "#fdfdfc",
    border:     dark ? "#2a2a2a" : "#e8e8e6",
    text:       dark ? "#e8e8e4" : "#1a1a1a",
    muted:      dark ? "#5e5e5e" : "#9b9b9b",
    hover:      dark ? "#202020" : "#f0f0ee",
    inputBg:    dark ? "#1a1a1a" : "#f5f5f3",
    chatBg:     dark ? "#141414" : "#fafaf9",
    userBubble: dark ? "#1d2d4a" : "#dbeafe",
    aiBubble:   dark ? "#1c1c1c" : "#f4f4f2",
    tagBg:      dark ? "#252525" : "#eeeeec",
    accent:     "#5b8af0",
    accentSoft: dark ? "rgba(91,138,240,0.12)" : "rgba(91,138,240,0.08)",
    green:      "#4ade80", yellow: "#fbbf24", red: "#f87171", purple: "#c084fc",
    shadow:     dark ? "0 2px 12px rgba(0,0,0,0.5)"  : "0 2px 12px rgba(0,0,0,0.08)",
    shadowLg:   dark ? "0 8px 40px rgba(0,0,0,0.45)" : "0 8px 40px rgba(0,0,0,0.12)",
  };
  return <ThemeCtx.Provider value={c}>{children}</ThemeCtx.Provider>;
}
const useTheme = () => useContext(ThemeCtx);

// ─── AUTH CONTEXT ─────────────────────────────────────────────────────────────
const AuthCtx = createContext();
function AuthProvider({ children }) {
  const [user, setUser]   = useState(null);
  const [err,  setErr]    = useState("");
  const [store, setStore] = useState(() => {
    const s = {}; DEMO_USERS.forEach(u => { s[u.id] = makeUserData(u.id); }); return s;
  });
  const users = useRef([...DEMO_USERS]);

  const login = (email, pw) => {
    const u = users.current.find(u => u.email === email && u.password === pw);
    if (u) { setUser(u); setErr(""); return true; }
    setErr("Invalid email or password."); return false;
  };
  const register = (name, email, pw) => {
    if (users.current.find(u => u.email === email)) { setErr("Email already in use."); return false; }
    const id = `u${Date.now()}`;
    const initials = name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
    const colors = ["#f87171","#fbbf24","#34d399","#60a5fa","#a78bfa","#f472b6"];
    const nu = { id, name, email, password: pw, avatar: initials, color: colors[Math.floor(Math.random()*colors.length)] };
    users.current.push(nu);
    setStore(p => ({ ...p, [id]: makeUserData(id) }));
    setUser(nu); setErr(""); return true;
  };
  const logout = () => setUser(null);
  const getData = () => user ? store[user.id] : null;
  const setPages = (fn) => { if (!user) return; setStore(p => ({ ...p, [user.id]: { ...p[user.id], pages: typeof fn==="function" ? fn(p[user.id].pages) : fn } })); };
  const setTasks = (fn) => { if (!user) return; setStore(p => ({ ...p, [user.id]: { ...p[user.id], tasks: typeof fn==="function" ? fn(p[user.id].tasks) : fn } })); };

  return <AuthCtx.Provider value={{ user, login, register, logout, err, setErr, getData, setPages, setTasks, demoUsers: DEMO_USERS }}>{children}</AuthCtx.Provider>;
}
const useAuth = () => useContext(AuthCtx);

// ─── ICON ─────────────────────────────────────────────────────────────────────
const ICON_PATHS = {
  sun:     "M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 5a7 7 0 1 0 0 14A7 7 0 0 0 12 5z",
  moon:    "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
  plus:    "M12 5v14M5 12h14",
  trash:   "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
  check:   "M20 6L9 17l-5-5",
  circle:  "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z",
  send:    "M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z",
  menu:    "M3 12h18M3 6h18M3 18h18",
  x:       "M18 6L6 18M6 6l12 12",
  logout:  "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  eye:     "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  eyeOff:  "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22",
};
function Ic({ n, size=16, style={}, className="" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style} className={className}>
      <path d={ICON_PATHS[n]} />
    </svg>
  );
}

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
function GlobalStyles({ dark }) {
  return <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Lora:ital,wght@0,500;0,700;1,400&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    html,body{height:100%;font-family:'Geist',sans-serif;}
    ::-webkit-scrollbar{width:4px;height:4px;}
    ::-webkit-scrollbar-track{background:transparent;}
    ::-webkit-scrollbar-thumb{background:${dark?"#2e2e2e":"#d0d0ce"};border-radius:4px;}
    input,textarea,button,select{font-family:'Geist',sans-serif;}
    textarea{resize:none;}
    button{cursor:pointer;border:none;outline:none;background:none;}
    .sb-item{transition:background 0.12s;cursor:pointer;border-radius:7px;}
    .sb-item:hover{background:${dark?"#1e1e1e":"#eaeae8"};}
    .sb-item.active{background:${dark?"rgba(91,138,240,0.14)":"rgba(91,138,240,0.09)"};}
    .btn{transition:all 0.15s;}
    .btn:hover{opacity:0.82;}
    .btn:active{transform:scale(0.96);}
    .tc{transition:background 0.12s,color 0.12s;}
    .task-card{transition:transform 0.15s,box-shadow 0.15s;}
    .task-card:hover{transform:translateY(-2px);}
    .fade-in{animation:fadeIn 0.3s ease;}
    .slide-up{animation:slideUp 0.38s cubic-bezier(0.16,1,0.3,1);}
    .pop-in{animation:popIn 0.3s cubic-bezier(0.175,0.885,0.32,1.275);}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes slideUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
    @keyframes popIn{from{transform:scale(0.5);opacity:0}to{transform:scale(1);opacity:1}}
    .bubble{animation:bubbleIn 0.22s ease;}
    @keyframes bubbleIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
    .td{animation:tdBounce 1.3s infinite ease-in-out;}
    .td:nth-child(2){animation-delay:0.18s;}
    .td:nth-child(3){animation-delay:0.36s;}
    @keyframes tdBounce{0%,60%,100%{transform:translateY(0);opacity:0.4}30%{transform:translateY(-4px);opacity:1}}
    .pc h1{font-size:1.85rem;font-weight:700;margin:22px 0 10px;font-family:'Lora',serif;}
    .pc h2{font-size:1.25rem;font-weight:600;margin:18px 0 8px;}
    .pc h3{font-size:1.05rem;font-weight:600;margin:14px 0 6px;}
    .pc p{margin-bottom:7px;line-height:1.72;}
    .pc ul,.pc ol{padding-left:22px;margin-bottom:8px;}
    .pc li{margin-bottom:4px;line-height:1.65;}
    .pc blockquote{border-left:3px solid #5b8af0;padding-left:14px;opacity:0.7;font-style:italic;margin:12px 0;}
    .pc strong{font-weight:600;}
    .ph{background:rgba(248,113,113,0.14);color:#f87171;}
    .pm{background:rgba(251,191,36,0.14);color:#fbbf24;}
    .pl{background:rgba(74,222,128,0.14);color:#4ade80;}
    .ai:focus{border-color:#5b8af0!important;box-shadow:0 0 0 3px rgba(91,138,240,0.15)!important;}
    input:focus,textarea:focus{outline:none;}
  `}</style>;
}

// ─── AUTH PAGE ────────────────────────────────────────────────────────────────
function AuthPage() {
  const { login, register, err, setErr, demoUsers } = useAuth();
  const t = useTheme();
  const [mode, setMode] = useState("login");
  const [showPw, setShowPw] = useState(false);
  const [f, setF] = useState({ name:"", email:"", password:"" });
  const [loading, setLoading] = useState(false);
  const upd = (k,v) => { setF(p=>({...p,[k]:v})); setErr(""); };
  const submit = async () => {
    setLoading(true);
    await new Promise(r=>setTimeout(r,350));
    if (mode==="login") login(f.email, f.password);
    else { if(!f.name.trim()){setErr("Please enter your name.");setLoading(false);return;} register(f.name,f.email,f.password); }
    setLoading(false);
  };
  const quick = (u) => { setMode("login"); setTimeout(()=>login(u.email,u.password),20); };

  const inp = { background:t.inputBg, border:`1px solid ${t.border}`, borderRadius:10, padding:"11px 14px", color:t.text, fontSize:14, width:"100%", transition:"border 0.2s,box-shadow 0.2s", outline:"none" };
  const lbl = { fontSize:12, color:t.muted, fontWeight:500, display:"block", marginBottom:5 };

  return (
    <div style={{ minHeight:"100vh", background:t.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ position:"fixed", inset:0, overflow:"hidden", pointerEvents:"none" }}>
        <div style={{ position:"absolute", top:"-10%", left:"-5%", width:500, height:500, borderRadius:"50%", background:`radial-gradient(circle,${t.dark?"rgba(91,138,240,0.07)":"rgba(91,138,240,0.05)"} 0%,transparent 70%)` }} />
        <div style={{ position:"absolute", bottom:"-10%", right:"-5%", width:600, height:600, borderRadius:"50%", background:`radial-gradient(circle,${t.dark?"rgba(192,132,252,0.06)":"rgba(192,132,252,0.04)"} 0%,transparent 70%)` }} />
      </div>

      <div className="slide-up" style={{ width:"100%", maxWidth:420, position:"relative", zIndex:1 }}>
        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:30 }}>
          <div style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:54, height:54, borderRadius:15, background:"linear-gradient(135deg,#5b8af0,#c084fc)", marginBottom:14, boxShadow:"0 8px 28px rgba(91,138,240,0.38)" }}>
            <span style={{ fontSize:25 }}>🌿</span>
          </div>
          <h1 style={{ fontSize:"2rem", fontWeight:700, fontFamily:"'Lora',serif", color:t.text, letterSpacing:"-0.02em" }}>MindTask</h1>
          <p style={{ color:t.muted, fontSize:14, marginTop:5 }}>Productivity meets wellness</p>
        </div>

        <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:18, padding:"28px 28px 22px", boxShadow:t.shadowLg }}>
          {/* Tabs */}
          <div style={{ display:"flex", background:t.inputBg, borderRadius:10, padding:4, marginBottom:22, border:`1px solid ${t.border}` }}>
            {["login","register"].map(m=>(
              <button key={m} className="btn tc" onClick={()=>{setMode(m);setErr("");setF({name:"",email:"",password:""}); }}
                style={{ flex:1, padding:"8px 0", borderRadius:7, fontSize:13.5, fontWeight:500, background:mode===m?t.accent:"transparent", color:mode===m?"#fff":t.muted }}>
                {m==="login"?"Sign In":"Create Account"}
              </button>
            ))}
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
            {mode==="register" && (
              <div><label style={lbl}>Full Name</label>
                <input className="ai" value={f.name} onChange={e=>upd("name",e.target.value)} placeholder="Your full name" style={inp} /></div>
            )}
            <div><label style={lbl}>Email</label>
              <input className="ai" type="email" value={f.email} onChange={e=>upd("email",e.target.value)} placeholder="you@example.com" style={inp} onKeyDown={e=>e.key==="Enter"&&submit()} /></div>
            <div><label style={lbl}>Password</label>
              <div style={{ position:"relative" }}>
                <input className="ai" type={showPw?"text":"password"} value={f.password} onChange={e=>upd("password",e.target.value)} placeholder="••••••••" style={{...inp,paddingRight:42}} onKeyDown={e=>e.key==="Enter"&&submit()} />
                <button onClick={()=>setShowPw(v=>!v)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", color:t.muted, padding:0, lineHeight:0 }}>
                  <Ic n={showPw?"eyeOff":"eye"} size={15} />
                </button>
              </div>
            </div>
          </div>

          {err && <div style={{ marginTop:11, padding:"9px 12px", borderRadius:8, background:"rgba(248,113,113,0.1)", border:"1px solid rgba(248,113,113,0.2)", color:"#f87171", fontSize:13 }}>{err}</div>}

          <button className="btn" onClick={submit} disabled={loading}
            style={{ width:"100%", marginTop:18, padding:"12px", borderRadius:11, background:"linear-gradient(135deg,#5b8af0,#c084fc)", color:"#fff", fontWeight:600, fontSize:14.5, boxShadow:"0 4px 18px rgba(91,138,240,0.32)", opacity:loading?0.75:1 }}>
            {loading?"Please wait…":mode==="login"?"Sign In":"Create Account"}
          </button>

          {/* Demo */}
          <div style={{ marginTop:22, borderTop:`1px solid ${t.border}`, paddingTop:18 }}>
            <p style={{ fontSize:11, color:t.muted, textAlign:"center", marginBottom:10, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.07em" }}>Quick Demo Login</p>
            <div style={{ display:"flex", gap:8 }}>
              {demoUsers.map(u=>(
                <button key={u.id} className="btn tc" onClick={()=>quick(u)}
                  style={{ flex:1, background:t.inputBg, border:`1px solid ${t.border}`, borderRadius:9, padding:"8px 4px", display:"flex", flexDirection:"column", alignItems:"center", gap:5, color:t.text }}>
                  <div style={{ width:30, height:30, borderRadius:"50%", background:u.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#fff" }}>{u.avatar}</div>
                  <span style={{ fontSize:11, color:t.muted }}>{u.name.split(" ")[0]}</span>
                </button>
              ))}
            </div>
            <p style={{ textAlign:"center", color:t.muted, fontSize:11.5, marginTop:10 }}>Password: <span style={{ color:t.accent, fontWeight:600 }}>demo123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
function Sidebar({ pages, activePage, setActivePage, onAdd, onDelete, onChat, open }) {
  const { user, logout } = useAuth();
  const t = useTheme();
  if (!open) return null;
  return (
    <div style={{ width:245, minWidth:245, background:t.sidebar, borderRight:`1px solid ${t.border}`, display:"flex", flexDirection:"column", height:"100%", flexShrink:0 }}>
      {/* Workspace */}
      <div style={{ padding:"14px 12px 12px", borderBottom:`1px solid ${t.border}`, display:"flex", alignItems:"center", gap:9 }}>
        <div style={{ width:30, height:30, borderRadius:8, background:"linear-gradient(135deg,#5b8af0,#c084fc)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:"#fff", flexShrink:0 }}>M</div>
        <div style={{ flex:1, overflow:"hidden" }}>
          <div style={{ fontWeight:600, fontSize:13.5, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>MindTask</div>
          <div style={{ fontSize:11, color:t.muted, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{user?.email}</div>
        </div>
      </div>

      {/* User strip */}
      <div style={{ padding:"10px 10px 8px", borderBottom:`1px solid ${t.border}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 8px", borderRadius:8 }}>
          <div style={{ width:28, height:28, borderRadius:"50%", background:user?.color||"#5b8af0", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#fff", flexShrink:0 }}>{user?.avatar}</div>
          <div style={{ flex:1, overflow:"hidden" }}>
            <div style={{ fontSize:12.5, fontWeight:500, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{user?.name}</div>
            <div style={{ fontSize:10.5, color:t.muted, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{user?.email}</div>
          </div>
          <button className="btn" onClick={logout} title="Sign out" style={{ color:t.muted, padding:4, borderRadius:5, lineHeight:0 }}><Ic n="logout" size={13} /></button>
        </div>
      </div>

      {/* Nav */}
      <div style={{ padding:"8px 8px 0" }}>
        {[["🏠","Home"],["🔍","Search"],["📥","Inbox"]].map(([ic,lb])=>(
          <div key={lb} className="sb-item" style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 10px", color:t.muted, fontSize:13 }}><span>{ic}</span>{lb}</div>
        ))}
      </div>

      {/* Pages */}
      <div style={{ flex:1, overflow:"auto", padding:"10px 8px 0" }}>
        <div style={{ fontSize:10.5, color:t.muted, padding:"0 10px 6px", fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase" }}>Pages</div>
        {pages.map(pg=>(
          <div key={pg.id} className={`sb-item ${activePage?.id===pg.id?"active":""}`}
            style={{ display:"flex", alignItems:"center", gap:7, padding:"5px 10px", fontSize:13, color:activePage?.id===pg.id?t.accent:t.text, marginBottom:1 }}
            onClick={()=>setActivePage(pg.id)}>
            <span style={{ fontSize:14, flexShrink:0 }}>{pg.icon}</span>
            <span style={{ flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{pg.title}</span>
            {activePage?.id===pg.id && pages.length>1 && (
              <button className="btn" onClick={e=>{e.stopPropagation();onDelete(pg.id);}} style={{ color:t.muted, padding:2, borderRadius:4, opacity:0.5, lineHeight:0 }}><Ic n="trash" size={11} /></button>
            )}
          </div>
        ))}
        <button className="btn sb-item" onClick={onAdd}
          style={{ display:"flex", alignItems:"center", gap:7, padding:"5px 10px", fontSize:13, color:t.muted, width:"100%", textAlign:"left", marginTop:2 }}>
          <Ic n="plus" size={13} /> New page
        </button>
      </div>

      {/* Banner */}
      <div style={{ margin:"12px 12px 14px", padding:"13px 14px", borderRadius:12, background:t.dark?"rgba(91,138,240,0.08)":"rgba(91,138,240,0.05)", border:`1px solid ${t.dark?"rgba(91,138,240,0.16)":"rgba(91,138,240,0.12)"}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:5 }}>
          <span style={{ fontSize:15 }}>🌿</span>
          <span style={{ fontSize:12, fontWeight:600, color:t.accent }}>MindEase</span>
        </div>
        <p style={{ fontSize:11.5, color:t.muted, lineHeight:1.5, marginBottom:9 }}>Feeling overwhelmed? Your wellness companion is here.</p>
        <button className="btn tc" onClick={onChat}
          style={{ fontSize:12, background:t.accent, color:"#fff", padding:"6px 12px", borderRadius:7, fontWeight:500, width:"100%" }}>
          Open Chat 💬
        </button>
      </div>
    </div>
  );
}

// ─── PAGE EDITOR ─────────────────────────────────────────────────────────────
const EMOJIS = ["📄","📋","🌱","✨","💡","🎯","📝","🔖","⚡","🧠","💙","🌿","🎨","🚀","🌸","🍃","📚","🔬"];
function PageEditor({ page, onUpdate }) {
  const t = useTheme();
  const shuffle = () => onUpdate(page.id,"icon",EMOJIS[Math.floor(Math.random()*EMOJIS.length)]);
  return (
    <div style={{ maxWidth:860, margin:"0 auto", width:"100%", padding:"48px 60px 80px" }}>
      <button className="btn" onClick={shuffle} title="Click to change icon" style={{ fontSize:46, marginBottom:10, display:"block", lineHeight:1, padding:"4px 0" }}>{page.icon}</button>
      <input value={page.title} onChange={e=>onUpdate(page.id,"title",e.target.value)} placeholder="Untitled"
        style={{ width:"100%", fontSize:"2.2rem", fontWeight:700, fontFamily:"'Lora',serif", background:"none", border:"none", color:t.text, lineHeight:1.2, marginBottom:18, outline:"none" }} />
      <textarea value={page.content} onChange={e=>onUpdate(page.id,"content",e.target.value)}
        placeholder="Start writing... Use # for headings, - for bullets, > for quotes, **bold**"
        style={{ width:"100%", minHeight:"calc(100vh - 300px)", background:"none", border:"none", color:t.text, fontSize:15, lineHeight:1.75, outline:"none", resize:"none" }} />
      <div style={{ marginTop:32, borderTop:`1px solid ${t.border}`, paddingTop:24 }}>
        <div style={{ fontSize:11, color:t.muted, marginBottom:10, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.07em", opacity:0.6 }}>Rendered Preview</div>
        <div className="pc" style={{ color:t.text, fontSize:14.5, opacity:0.85 }}>{renderMarkdown(page.content)}</div>
      </div>
    </div>
  );
}

// ─── TASK BOARD ──────────────────────────────────────────────────────────────
const COLS = [
  { key:"todo", label:"To Do", dot:"#6b6b6b" },
  { key:"in-progress", label:"In Progress", dot:"#fbbf24" },
  { key:"done", label:"Done", dot:"#4ade80" },
];
const TAGS = ["Dev","Design","AI","QA","Planning","DevOps","Research","Other"];
function TaskBoard({ tasks, onUpdate }) {
  const t = useTheme();
  const [adding, setAdding] = useState(false);
  const [nt, setNt] = useState({ title:"", priority:"medium", tag:"Dev" });
  const [filter, setFilter] = useState("all");

  const addTask = () => {
    if(!nt.title.trim()) return;
    onUpdate(p=>[...p,{id:Date.now().toString(),...nt,status:"todo"}]);
    setNt({title:"",priority:"medium",tag:"Dev"}); setAdding(false);
  };
  const cycle = (id) => {
    const ord=["todo","in-progress","done"];
    onUpdate(p=>p.map(tk=>tk.id===id?{...tk,status:ord[(ord.indexOf(tk.status)+1)%3]}:tk));
  };
  const del = (id) => onUpdate(p=>p.filter(tk=>tk.id!==id));
  const filtered = filter==="all" ? tasks : tasks.filter(tk=>tk.priority===filter);
  const inp = { background:t.inputBg, border:`1px solid ${t.border}`, borderRadius:8, padding:"8px 12px", color:t.text, fontSize:13, outline:"none" };

  return (
    <div style={{ padding:"48px 60px 80px", maxWidth:1100, margin:"0 auto", width:"100%" }}>
      <div style={{ display:"flex", alignItems:"flex-end", gap:12, marginBottom:26 }}>
        <span style={{ fontSize:42 }}>✅</span>
        <div>
          <h1 style={{ fontSize:"2rem", fontWeight:700, fontFamily:"'Lora',serif", color:t.text }}>My Tasks</h1>
          <p style={{ fontSize:13, color:t.muted, marginTop:2 }}>{tasks.length} tasks · {tasks.filter(tk=>tk.status==="done").length} completed</p>
        </div>
      </div>

      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:22, flexWrap:"wrap" }}>
        <button className="btn tc" onClick={()=>setAdding(true)}
          style={{ display:"flex", alignItems:"center", gap:6, background:t.accent, color:"#fff", padding:"8px 16px", borderRadius:9, fontSize:13, fontWeight:500, boxShadow:"0 2px 10px rgba(91,138,240,0.28)" }}>
          <Ic n="plus" size={14} /> New Task
        </button>
        <div style={{ display:"flex", gap:5, background:t.inputBg, border:`1px solid ${t.border}`, borderRadius:9, padding:4 }}>
          {["all","high","medium","low"].map(f=>(
            <button key={f} className="btn tc" onClick={()=>setFilter(f)}
              style={{ padding:"5px 11px", borderRadius:6, fontSize:12, fontWeight:500, background:filter===f?t.accent:"transparent", color:filter===f?"#fff":t.muted }}>
              {f.charAt(0).toUpperCase()+f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {adding && (
        <div className="slide-up" style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:12, padding:16, marginBottom:20 }}>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
            <input value={nt.title} onChange={e=>setNt(n=>({...n,title:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addTask()} placeholder="Task title..." autoFocus style={{...inp,flex:1,minWidth:180}} />
            <select value={nt.priority} onChange={e=>setNt(n=>({...n,priority:e.target.value}))} style={{...inp,width:"auto"}}>
              {["high","medium","low"].map(p=><option key={p} value={p}>{p.charAt(0).toUpperCase()+p.slice(1)} Priority</option>)}
            </select>
            <select value={nt.tag} onChange={e=>setNt(n=>({...n,tag:e.target.value}))} style={{...inp,width:"auto"}}>
              {TAGS.map(tg=><option key={tg} value={tg}>{tg}</option>)}
            </select>
            <button className="btn tc" onClick={addTask} style={{ background:t.accent, color:"#fff", padding:"8px 16px", borderRadius:8, fontSize:13, fontWeight:500 }}>Add</button>
            <button className="btn tc" onClick={()=>setAdding(false)} style={{ background:t.hover, color:t.muted, padding:"8px 12px", borderRadius:8, fontSize:13 }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:18, alignItems:"start" }}>
        {COLS.map(col=>{
          const colTasks = filtered.filter(tk=>tk.status===col.key);
          return (
            <div key={col.key}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12, padding:"0 2px" }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:col.dot, boxShadow:`0 0 6px ${col.dot}55` }} />
                <span style={{ fontSize:11.5, fontWeight:600, color:t.muted, textTransform:"uppercase", letterSpacing:"0.07em" }}>{col.label}</span>
                <span style={{ marginLeft:"auto", fontSize:11, color:t.muted, background:t.tagBg, padding:"1px 7px", borderRadius:10, fontWeight:500 }}>{colTasks.length}</span>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:9, minHeight:70 }}>
                {colTasks.map(tk=>(
                  <div key={tk.id} className="task-card" style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:11, padding:"13px 14px", boxShadow:t.dark?"0 1px 6px rgba(0,0,0,0.35)":"0 1px 6px rgba(0,0,0,0.06)" }}>
                    <div style={{ display:"flex", alignItems:"flex-start", gap:8 }}>
                      <button className="btn" onClick={()=>cycle(tk.id)} style={{ color:col.dot, padding:0, marginTop:1, flexShrink:0, lineHeight:0 }}>
                        <Ic n={tk.status==="done"?"check":"circle"} size={15} />
                      </button>
                      <span style={{ fontSize:13, flex:1, lineHeight:1.45, textDecoration:tk.status==="done"?"line-through":"none", color:tk.status==="done"?t.muted:t.text }}>{tk.title}</span>
                      <button className="btn" onClick={()=>del(tk.id)} style={{ color:t.muted, padding:1, opacity:0.4, lineHeight:0, flexShrink:0 }}><Ic n="x" size={12} /></button>
                    </div>
                    <div style={{ display:"flex", gap:6, marginTop:9, paddingLeft:23 }}>
                      <span className={`p${tk.priority[0]}`} style={{ fontSize:10.5, padding:"2px 8px", borderRadius:6, fontWeight:500 }}>{tk.priority}</span>
                      <span style={{ fontSize:10.5, padding:"2px 8px", borderRadius:6, background:t.tagBg, color:t.muted, fontWeight:500 }}>{tk.tag}</span>
                    </div>
                  </div>
                ))}
                {colTasks.length===0 && (
                  <div style={{ border:`1px dashed ${t.border}`, borderRadius:11, padding:"18px 14px", textAlign:"center", color:t.muted, fontSize:12 }}>No tasks</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── CHAT PANEL ──────────────────────────────────────────────────────────────
const QUICK = ["I'm overwhelmed 😔","Need a break 😮‍💨","Feeling anxious 😟","Feeling good! 🌟","Can't focus 🎯"];
function ChatPanel({ onClose }) {
  const t = useTheme();
  const { user } = useAuth();
  const [msgs, setMsgs] = useState([{ role:"assistant", text:`Hey ${user?.name?.split(" ")[0]||"there"}! 🌿 I'm MindEase, your wellness companion. How are you feeling today? Whether you're stressed, overwhelmed, or just need to talk — I'm here.` }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);
  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs,typing]);

  const send = async (txt) => {
    const msg = (txt||input).trim(); if(!msg) return;
    setInput(""); setMsgs(m=>[...m,{role:"user",text:msg}]); setTyping(true);
    const reply = await getAIResponse(msg, user?.name||"friend");
    setTyping(false); setMsgs(m=>[...m,{role:"assistant",text:reply}]);
  };

  return (
    <div className="pop-in" style={{ position:"fixed", bottom:24, right:24, width:375, height:550, background:t.chatBg, border:`1px solid ${t.border}`, borderRadius:18, display:"flex", flexDirection:"column", zIndex:300, boxShadow:t.shadowLg, overflow:"hidden" }}>
      {/* Header */}
      <div style={{ padding:"14px 16px", borderBottom:`1px solid ${t.border}`, display:"flex", alignItems:"center", gap:10, background:t.dark?"#161616":"#f5f5f3", flexShrink:0 }}>
        <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#4ade80,#5b8af0)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>🌿</div>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:600, fontSize:14, color:t.text }}>MindEase</div>
          <div style={{ fontSize:11.5, color:"#4ade80", display:"flex", alignItems:"center", gap:4 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:"#4ade80" }} /> Here for you
          </div>
        </div>
        <button className="btn" onClick={onClose} style={{ color:t.muted, padding:5, borderRadius:7, lineHeight:0 }}><Ic n="x" size={15} /></button>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflow:"auto", padding:"14px 14px 6px", display:"flex", flexDirection:"column", gap:11 }}>
        {msgs.map((m,i)=>(
          <div key={i} className="bubble" style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start", alignItems:"flex-end", gap:8 }}>
            {m.role==="assistant" && <div style={{ width:26, height:26, borderRadius:"50%", background:"linear-gradient(135deg,#4ade80,#5b8af0)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, flexShrink:0, marginBottom:2 }}>🌿</div>}
            <div style={{ maxWidth:"78%", padding:"10px 13px", borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px", background:m.role==="user"?t.userBubble:t.aiBubble, fontSize:13.5, lineHeight:1.55, color:t.text, border:`1px solid ${m.role==="user"?"transparent":t.border}` }}>
              {m.text}
            </div>
            {m.role==="user" && <div style={{ width:26, height:26, borderRadius:"50%", background:user?.color||t.accent, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:"#fff", flexShrink:0, marginBottom:2 }}>{user?.avatar}</div>}
          </div>
        ))}
        {typing && (
          <div style={{ display:"flex", alignItems:"flex-end", gap:8 }}>
            <div style={{ width:26, height:26, borderRadius:"50%", background:"linear-gradient(135deg,#4ade80,#5b8af0)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, flexShrink:0 }}>🌿</div>
            <div style={{ background:t.aiBubble, border:`1px solid ${t.border}`, borderRadius:"16px 16px 16px 4px", padding:"11px 14px", display:"flex", gap:4, alignItems:"center" }}>
              {[0,1,2].map(i=><div key={i} className="td" style={{ width:6, height:6, borderRadius:"50%", background:t.muted }} />)}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Quick prompts */}
      <div style={{ padding:"6px 12px", display:"flex", gap:6, overflowX:"auto", flexShrink:0 }}>
        {QUICK.map(p=>(
          <button key={p} className="btn tc" onClick={()=>send(p)}
            style={{ background:t.dark?"rgba(91,138,240,0.1)":"rgba(91,138,240,0.07)", color:t.accent, border:`1px solid ${t.dark?"rgba(91,138,240,0.18)":"rgba(91,138,240,0.13)"}`, borderRadius:20, padding:"4px 11px", fontSize:11.5, whiteSpace:"nowrap", fontWeight:500 }}>
            {p}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding:"8px 12px 14px", display:"flex", gap:8, alignItems:"center", flexShrink:0 }}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
          placeholder="Share how you're feeling…"
          style={{ flex:1, background:t.inputBg, border:`1px solid ${t.border}`, borderRadius:11, padding:"9px 13px", color:t.text, fontSize:13, outline:"none" }} />
        <button className="btn tc" onClick={()=>send()}
          style={{ background:"linear-gradient(135deg,#5b8af0,#c084fc)", color:"#fff", width:38, height:38, borderRadius:11, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 2px 10px rgba(91,138,240,0.3)" }}>
          <Ic n="send" size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function Dashboard() {
  const { user, getData, setPages, setTasks } = useAuth();
  const t = useTheme();
  const [activeId, setActiveId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);

  const data = getData();
  const pages = data?.pages || [];
  const tasks = data?.tasks || [];
  const activePage = pages.find(p=>p.id===activeId) || pages[0];

  const addPage = () => {
    const id = `${user.id}-p${Date.now()}`;
    setPages(p=>[...p,{id,title:"Untitled",icon:"📄",content:"# Untitled\n\nStart writing here...",type:"page"}]);
    setActiveId(id);
  };
  const deletePage = (id) => {
    setPages(p=>p.filter(pg=>pg.id!==id));
    if(activePage?.id===id){ const rem=pages.filter(pg=>pg.id!==id); setActiveId(rem[0]?.id||null); }
  };
  const updatePage = (id,field,val) => setPages(p=>p.map(pg=>pg.id===id?{...pg,[field]:val}:pg));

  return (
    <div style={{ display:"flex", height:"100vh", background:t.bg, color:t.text, overflow:"hidden" }}>
      <Sidebar pages={pages} activePage={activePage} setActivePage={setActiveId} onAdd={addPage} onDelete={deletePage} onChat={()=>setChatOpen(true)} open={sidebarOpen} />

      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 }}>
        {/* Topbar */}
        <div style={{ height:46, borderBottom:`1px solid ${t.border}`, display:"flex", alignItems:"center", padding:"0 16px", gap:10, background:t.surface, flexShrink:0 }}>
          <button className="btn tc" onClick={()=>setSidebarOpen(v=>!v)} style={{ color:t.muted, padding:6, borderRadius:7, lineHeight:0 }}><Ic n="menu" size={15} /></button>
          <div style={{ flex:1, display:"flex", alignItems:"center", gap:7, fontSize:13.5, overflow:"hidden" }}>
            <span style={{ fontSize:16, flexShrink:0 }}>{activePage?.icon}</span>
            <span style={{ color:t.text, fontWeight:500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{activePage?.title||"Select a page"}</span>
          </div>
          <button className="btn tc" onClick={t.toggle} style={{ color:t.muted, padding:7, borderRadius:7, lineHeight:0 }}><Ic n={t.dark?"sun":"moon"} size={14} /></button>
          <div style={{ width:28, height:28, borderRadius:"50%", background:user?.color||t.accent, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#fff", flexShrink:0 }} title={user?.name}>{user?.avatar}</div>
        </div>

        {/* Content */}
        <div style={{ flex:1, overflow:"auto" }}>
          {activePage?.type==="tasks"
            ? <TaskBoard tasks={tasks} onUpdate={setTasks} />
            : activePage
              ? <PageEditor page={activePage} onUpdate={updatePage} />
              : <div style={{ display:"flex",alignItems:"center",justifyContent:"center",height:"100%",color:t.muted,fontSize:14 }}>Select a page or create a new one.</div>
          }
        </div>
      </div>

      {!chatOpen && (
        <button className="btn pop-in" onClick={()=>setChatOpen(true)}
          style={{ position:"fixed", bottom:24, right:24, width:54, height:54, borderRadius:"50%", background:"linear-gradient(135deg,#5b8af0,#c084fc)", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 24px rgba(91,138,240,0.45)", zIndex:200, fontSize:22 }}>
          💬
        </button>
      )}
      {chatOpen && <ChatPanel onClose={()=>setChatOpen(false)} />}
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
function AppInner() {
  const { user } = useAuth();
  const { dark } = useTheme();
  return <><GlobalStyles dark={dark} />{user ? <Dashboard /> : <AuthPage />}</>;
}

export default function App() {
  return <ThemeProvider><AuthProvider><AppInner /></AuthProvider></ThemeProvider>;
}
