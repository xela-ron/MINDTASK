import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Sidebar from "../components/Sidebar";
import PageEditor from "../components/PageEditor";
import TaskBoard from "../components/TaskBoard";
import ChatPanel from "../components/ChatPanel";
import Icon from "../components/Icon";

export default function Dashboard() {
  const { currentUser, getUserData, updatePages, updateTasks } = useAuth();
  const t = useTheme();
  const [activePageId, setActivePageId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);

  const userData = getUserData();
  const pages = userData?.pages || [];
  const tasks = userData?.tasks || [];

  const activePage = pages.find(p => p.id === activePageId) || pages[0];

  const addPage = () => {
    const id = `${currentUser.id}-p${Date.now()}`;
    const page = { id, title: "Untitled", icon: "📄", content: "# Untitled\n\nStart writing here...", type: "page" };
    updatePages(prev => [...prev, page]);
    setActivePageId(id);
  };

  const deletePage = (id) => {
    updatePages(prev => prev.filter(p => p.id !== id));
    if (activePage?.id === id) {
      const remaining = pages.filter(p => p.id !== id);
      setActivePageId(remaining[0]?.id || null);
    }
  };

  const updatePageField = (id, field, value) => {
    updatePages(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: t.bg, color: t.text, overflow: "hidden" }}>
      {/* Sidebar */}
      <Sidebar
        pages={pages}
        activePageId={activePage?.id}
        setActivePageId={setActivePageId}
        onAddPage={addPage}
        onDeletePage={deletePage}
        onOpenChat={() => setChatOpen(true)}
        sidebarOpen={sidebarOpen}
      />

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        {/* Topbar */}
        <div style={{ height: 46, borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", padding: "0 16px", gap: 10, background: t.surface, flexShrink: 0 }}>
          <button className="btn-base" onClick={() => setSidebarOpen(v => !v)}
            style={{ background: "none", color: t.muted, padding: 6, borderRadius: 7 }}>
            <Icon name="menu" size={15} />
          </button>

          {/* Breadcrumb */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, fontSize: 13.5, color: t.muted, overflow: "hidden" }}>
            <span style={{ fontSize: 15 }}>{activePage?.icon}</span>
            <span style={{ color: t.text, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {activePage?.title || "Select a page"}
            </span>
          </div>

          {/* Theme toggle */}
          <button className="btn-base" onClick={t.toggle}
            style={{ background: "none", color: t.muted, padding: 7, borderRadius: 7, display: "flex", alignItems: "center" }}>
            <Icon name={t.dark ? "sun" : "moon"} size={14} />
          </button>

          {/* User avatar */}
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: currentUser?.color || t.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0, cursor: "default" }}
            title={currentUser?.name}>
            {currentUser?.avatar}
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, overflow: "auto" }}>
          {activePage?.type === "tasks" ? (
            <TaskBoard tasks={tasks} onUpdateTasks={updateTasks} />
          ) : activePage ? (
            <PageEditor page={activePage} onUpdate={updatePageField} />
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: t.muted, fontSize: 14 }}>
              Select a page from the sidebar or create a new one.
            </div>
          )}
        </div>
      </div>

      {/* Chat FAB */}
      {!chatOpen && (
        <button className="btn-base pop-in" onClick={() => setChatOpen(true)}
          style={{ position: "fixed", bottom: 24, right: 24, width: 54, height: 54, borderRadius: "50%", background: "linear-gradient(135deg, #5b8af0, #c084fc)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 22px rgba(91,138,240,0.45)", zIndex: 200, fontSize: 22, border: "none" }}>
          💬
        </button>
      )}

      {/* Chat panel */}
      {chatOpen && <ChatPanel onClose={() => setChatOpen(false)} />}
    </div>
  );
}
