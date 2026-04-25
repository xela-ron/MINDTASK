import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Icon from "./Icon";

export default function Sidebar({ pages, activePageId, setActivePageId, onAddPage, onDeletePage, onOpenChat, sidebarOpen }) {
  const { currentUser, logout } = useAuth();
  const t = useTheme();

  if (!sidebarOpen) return null;

  return (
    <div style={{ width: 240, minWidth: 240, background: t.sidebar, borderRight: `1px solid ${t.border}`, display: "flex", flexDirection: "column", height: "100%", flexShrink: 0 }}>

      {/* Workspace header */}
      <div style={{ padding: "14px 12px 12px", borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", gap: 9 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg, ${t.accent}, ${t.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff", flexShrink: 0 }}>M</div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <div style={{ fontWeight: 600, fontSize: 13.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>MindTask</div>
          <div style={{ fontSize: 11, color: t.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentUser?.name}</div>
        </div>
      </div>

      {/* User profile strip */}
      <div style={{ padding: "10px 10px 6px", borderBottom: `1px solid ${t.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", borderRadius: 8, background: t.t?.accentSoft }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: currentUser?.color || t.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
            {currentUser?.avatar}
          </div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={{ fontSize: 12.5, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentUser?.name}</div>
            <div style={{ fontSize: 10.5, color: t.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentUser?.email}</div>
          </div>
          <button className="btn-base" onClick={logout} title="Logout"
            style={{ background: "none", color: t.muted, padding: 4, borderRadius: 5 }}>
            <Icon name="logout" size={13} />
          </button>
        </div>
      </div>

      {/* Nav */}
      <div style={{ padding: "8px 8px 0" }}>
        <div className="sidebar-item" style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", color: t.muted, fontSize: 13 }}>
          <span>🏠</span> Home
        </div>
        <div className="sidebar-item" style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", color: t.muted, fontSize: 13 }}>
          <span>🔍</span> Search
        </div>
        <div className="sidebar-item" style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", color: t.muted, fontSize: 13 }}>
          <span>📥</span> Inbox
        </div>
      </div>

      {/* Pages */}
      <div style={{ flex: 1, overflow: "auto", padding: "10px 8px 0" }}>
        <div style={{ fontSize: 10.5, color: t.muted, padding: "0 10px 6px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>Pages</div>

        {pages.map(page => (
          <div key={page.id}
            className={`sidebar-item ${activePageId === page.id ? "active" : ""}`}
            style={{ display: "flex", alignItems: "center", gap: 7, padding: "5px 10px", fontSize: 13, color: activePageId === page.id ? t.accent : t.text, position: "relative", marginBottom: 1 }}
            onClick={() => setActivePageId(page.id)}>
            <span style={{ fontSize: 14, flexShrink: 0 }}>{page.icon}</span>
            <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{page.title}</span>
            {activePageId === page.id && pages.length > 1 && (
              <button className="btn-base" onClick={e => { e.stopPropagation(); onDeletePage(page.id); }}
                style={{ background: "none", color: t.muted, padding: 2, borderRadius: 4, opacity: 0.55, lineHeight: 0 }}>
                <Icon name="trash" size={11} />
              </button>
            )}
          </div>
        ))}

        <button className="btn-base sidebar-item" onClick={onAddPage}
          style={{ display: "flex", alignItems: "center", gap: 7, padding: "5px 10px", fontSize: 13, color: t.muted, background: "none", width: "100%", textAlign: "left", marginTop: 2 }}>
          <Icon name="plus" size={13} /> New page
        </button>
      </div>

      {/* MindEase banner */}
      <div style={{ margin: "12px 12px 14px", padding: "13px 14px", borderRadius: 12, background: t.dark ? "rgba(91,138,240,0.09)" : "rgba(91,138,240,0.06)", border: `1px solid ${t.dark ? "rgba(91,138,240,0.18)" : "rgba(91,138,240,0.14)"}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
          <span style={{ fontSize: 15 }}>🌿</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: t.accent }}>MindEase</span>
        </div>
        <p style={{ fontSize: 11.5, color: t.muted, lineHeight: 1.5, marginBottom: 9 }}>
          Feeling overwhelmed? Your wellness companion is here to listen.
        </p>
        <button className="btn-base" onClick={onOpenChat}
          style={{ fontSize: 11.5, background: t.accent, color: "#fff", padding: "5px 12px", borderRadius: 7, fontWeight: 500, width: "100%" }}>
          Open Chat 💬
        </button>
      </div>
    </div>
  );
}
