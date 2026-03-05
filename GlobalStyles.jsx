export function GlobalStyles({ dark }) {
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { height: 100%; font-family: 'Geist', sans-serif; }

    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: ${dark ? "#2e2e2e" : "#d8d8d6"}; border-radius: 4px; }

    input, textarea, button { font-family: 'Geist', sans-serif; }
    textarea { resize: none; }
    button { cursor: pointer; border: none; outline: none; }

    .sidebar-item { transition: background 0.12s; cursor: pointer; border-radius: 7px; }
    .sidebar-item:hover { background: ${dark ? "#222" : "#ebebea"}; }
    .sidebar-item.active { background: ${dark ? "rgba(91,138,240,0.14)" : "rgba(91,138,240,0.09)"}; }

    .task-card { transition: transform 0.15s, box-shadow 0.15s; }
    .task-card:hover { transform: translateY(-2px); }

    .btn-base { transition: all 0.15s; }
    .btn-base:hover { opacity: 0.85; }
    .btn-base:active { transform: scale(0.97); }

    .fade-in  { animation: fadeIn  0.3s ease; }
    .slide-up { animation: slideUp 0.35s cubic-bezier(0.16,1,0.3,1); }
    .pop-in   { animation: popIn   0.3s cubic-bezier(0.175,0.885,0.32,1.275); }

    @keyframes fadeIn  { from { opacity: 0; }                        to { opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes popIn   { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }

    .chat-bubble { animation: bubbleIn 0.22s ease; }
    @keyframes bubbleIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

    .typing-dot { animation: typingBounce 1.3s infinite ease-in-out; }
    .typing-dot:nth-child(2) { animation-delay: 0.18s; }
    .typing-dot:nth-child(3) { animation-delay: 0.36s; }
    @keyframes typingBounce { 0%,60%,100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-4px); opacity: 1; } }

    .page-content h1 { font-size: 1.85rem; font-weight: 700; margin: 20px 0 10px; font-family: 'Lora', serif; }
    .page-content h2 { font-size: 1.25rem; font-weight: 600; margin: 18px 0 8px; }
    .page-content h3 { font-size: 1.05rem; font-weight: 600; margin: 14px 0 6px; }
    .page-content p  { margin-bottom: 7px; line-height: 1.72; }
    .page-content ul, .page-content ol { padding-left: 22px; margin-bottom: 8px; }
    .page-content li { margin-bottom: 4px; line-height: 1.65; }
    .page-content blockquote { border-left: 3px solid #5b8af0; padding-left: 14px; opacity: 0.75; font-style: italic; margin: 12px 0; }
    .page-content strong { font-weight: 600; }

    .priority-high   { background: rgba(248,113,113,0.14); color: #f87171; }
    .priority-medium { background: rgba(251,191,36,0.14);  color: #fbbf24; }
    .priority-low    { background: rgba(74,222,128,0.14);  color: #4ade80; }

    .auth-input:focus { border-color: #5b8af0 !important; box-shadow: 0 0 0 3px rgba(91,138,240,0.15) !important; }

    .gradient-text {
      background: linear-gradient(135deg, #5b8af0, #c084fc);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  `;
  return <style>{css}</style>;
}
