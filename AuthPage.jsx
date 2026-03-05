import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Icon from "../components/Icon";

export default function AuthPage() {
  const { login, register, error, setError, demoUsers } = useAuth();
  const t = useTheme();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError(""); };

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 400)); // simulate async
    if (mode === "login") {
      login(form.email, form.password);
    } else {
      if (!form.name.trim()) { setError("Please enter your name."); setLoading(false); return; }
      register(form.name, form.email, form.password);
    }
    setLoading(false);
  };

  const quickLogin = (u) => {
    setForm({ name: "", email: u.email, password: u.password });
    setMode("login");
    setTimeout(() => login(u.email, u.password), 50);
  };

  const inp = {
    background: t.inputBg,
    border: `1px solid ${t.border}`,
    borderRadius: 10,
    padding: "11px 14px",
    color: t.text,
    fontSize: 14,
    width: "100%",
    transition: "border 0.2s, box-shadow 0.2s",
  };

  return (
    <div style={{ minHeight: "100vh", background: t.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      {/* Background orbs */}
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-10%", left: "-5%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${t.dark ? "rgba(91,138,240,0.07)" : "rgba(91,138,240,0.06)"} 0%, transparent 70%)` }} />
        <div style={{ position: "absolute", bottom: "-10%", right: "-5%", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${t.dark ? "rgba(192,132,252,0.06)" : "rgba(192,132,252,0.05)"} 0%, transparent 70%)` }} />
      </div>

      <div className="slide-up" style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 52, height: 52, borderRadius: 14, background: `linear-gradient(135deg, ${t.accent}, ${t.purple})`, marginBottom: 14, boxShadow: `0 8px 24px rgba(91,138,240,0.35)` }}>
            <span style={{ fontSize: 24 }}>🌿</span>
          </div>
          <h1 style={{ fontSize: "1.9rem", fontWeight: 700, fontFamily: "'Lora', serif", color: t.text }}>MindTask</h1>
          <p style={{ color: t.muted, fontSize: 14, marginTop: 4 }}>Productivity meets wellness</p>
        </div>

        {/* Card */}
        <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 18, padding: "28px 28px 24px", boxShadow: t.shadowLg }}>
          {/* Tabs */}
          <div style={{ display: "flex", background: t.inputBg, borderRadius: 10, padding: 4, marginBottom: 24, border: `1px solid ${t.border}` }}>
            {["login", "register"].map(m => (
              <button key={m} className="btn-base" onClick={() => { setMode(m); setError(""); setForm({ name: "", email: "", password: "" }); }}
                style={{ flex: 1, padding: "8px 0", borderRadius: 7, fontSize: 13.5, fontWeight: 500, background: mode === m ? t.accent : "transparent", color: mode === m ? "#fff" : t.muted, transition: "all 0.2s" }}>
                {m === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          {/* Fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {mode === "register" && (
              <div>
                <label style={{ fontSize: 12, color: t.muted, fontWeight: 500, display: "block", marginBottom: 5 }}>Full Name</label>
                <input className="auth-input" value={form.name} onChange={e => set("name", e.target.value)} placeholder="Your full name" style={inp} />
              </div>
            )}
            <div>
              <label style={{ fontSize: 12, color: t.muted, fontWeight: 500, display: "block", marginBottom: 5 }}>Email</label>
              <input className="auth-input" type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@example.com" style={inp}
                onKeyDown={e => e.key === "Enter" && handleSubmit()} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: t.muted, fontWeight: 500, display: "block", marginBottom: 5 }}>Password</label>
              <div style={{ position: "relative" }}>
                <input className="auth-input" type={showPass ? "text" : "password"} value={form.password} onChange={e => set("password", e.target.value)} placeholder="••••••••" style={{ ...inp, paddingRight: 42 }}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()} />
                <button onClick={() => setShowPass(v => !v)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", color: t.muted }}>
                  <Icon name={showPass ? "eyeOff" : "eye"} size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ marginTop: 12, padding: "9px 12px", borderRadius: 8, background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171", fontSize: 13 }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button className="btn-base" onClick={handleSubmit} disabled={loading}
            style={{ width: "100%", marginTop: 18, padding: "12px", borderRadius: 11, background: `linear-gradient(135deg, ${t.accent}, ${t.purple})`, color: "#fff", fontWeight: 600, fontSize: 14.5, boxShadow: "0 4px 16px rgba(91,138,240,0.3)", opacity: loading ? 0.75 : 1 }}>
            {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>

          {/* Demo accounts */}
          <div style={{ marginTop: 22, borderTop: `1px solid ${t.border}`, paddingTop: 18 }}>
            <p style={{ fontSize: 11.5, color: t.muted, textAlign: "center", marginBottom: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>Quick Demo Login</p>
            <div style={{ display: "flex", gap: 8 }}>
              {demoUsers.slice(0, 3).map(u => (
                <button key={u.id} className="btn-base" onClick={() => quickLogin(u)}
                  style={{ flex: 1, background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 9, padding: "8px 4px", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, color: t.text }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: u.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10.5, fontWeight: 700, color: "#fff" }}>{u.avatar}</div>
                  <span style={{ fontSize: 11, color: t.muted }}>{u.name.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p style={{ textAlign: "center", color: t.muted, fontSize: 12, marginTop: 16 }}>
          Demo password: <span style={{ color: t.accent, fontWeight: 500 }}>demo123</span>
        </p>
      </div>
    </div>
  );
}
