import { useTheme } from "../context/ThemeContext";
import { renderMarkdown } from "../utils/markdown";

const RANDOM_EMOJIS = ["📄","📋","🌱","✨","💡","🎯","📝","🔖","⚡","🧠","💙","🌿","🎨","🔬","📊","🚀","🌸","🍃"];

export default function PageEditor({ page, onUpdate }) {
  const t = useTheme();

  const shuffleEmoji = () => {
    const emoji = RANDOM_EMOJIS[Math.floor(Math.random() * RANDOM_EMOJIS.length)];
    onUpdate(page.id, "icon", emoji);
  };

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", width: "100%", padding: "48px 60px 80px" }}>
      {/* Emoji */}
      <button className="btn-base" onClick={shuffleEmoji} title="Click to change icon"
        style={{ fontSize: 46, background: "none", marginBottom: 10, display: "block", lineHeight: 1, padding: "4px 0" }}>
        {page.icon}
      </button>

      {/* Title */}
      <input
        value={page.title}
        onChange={e => onUpdate(page.id, "title", e.target.value)}
        placeholder="Untitled"
        style={{ width: "100%", fontSize: "2.3rem", fontWeight: 700, fontFamily: "'Lora', serif", background: "none", border: "none", color: t.text, lineHeight: 1.2, marginBottom: 18, outline: "none" }}
      />

      {/* Editor */}
      <textarea
        value={page.content}
        onChange={e => onUpdate(page.id, "content", e.target.value)}
        placeholder="Start writing... Use # for headings, - for bullets, > for quotes, **bold**"
        style={{ width: "100%", minHeight: "calc(100vh - 280px)", background: "none", border: "none", color: t.text, fontSize: 15, lineHeight: 1.75, outline: "none", resize: "none", fontFamily: "'Geist', sans-serif" }}
      />

      {/* Preview hint */}
      <div style={{ marginTop: 32, borderTop: `1px solid ${t.border}`, paddingTop: 24, opacity: 0.5 }}>
        <div style={{ fontSize: 11.5, color: t.muted, marginBottom: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.07em" }}>Preview</div>
        <div className="page-content" style={{ color: t.text, fontSize: 14.5 }}>
          {renderMarkdown(page.content)}
        </div>
      </div>
    </div>
  );
}
