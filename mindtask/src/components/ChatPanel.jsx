import { useState, useRef, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import Icon from "./Icon";

const QUICK_PROMPTS = [
  "I'm overwhelmed 😔",
  "Need a break 😮‍💨",
  "Feeling anxious 😟",
  "Feeling good! 🌟",
  "Can't focus 🎯",
];

export default function ChatPanel({ onClose }) {
  const t = useTheme();
  const { currentUser } = useAuth();

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: `Hey ${currentUser?.name?.split(" ")[0] || "there"}! 🌿 I'm MindEase, your wellness companion. How are you feeling today? Whether you're stressed, overwhelmed, or just need to talk — I'm here.`,
    },
  ]);

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // ✅ CONNECTED TO GEMINI BACKEND
  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg) return;

    setInput("");

    // Add user message
    setMessages((m) => [...m, { role: "user", text: msg }]);
    setTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: msg }),
      });

      const data = await res.json();

      setTyping(false);

      // Add AI response
      setMessages((m) => [
        ...m,
        { role: "assistant", text: data.reply || "I'm here to listen 💬" },
      ]);
    } catch (error) {
      console.error(error);
      setTyping(false);

      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: "⚠️ MindEase is currently unavailable. Please try again.",
        },
      ]);
    }
  };

  return (
    <div
      className="pop-in"
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        width: 370,
        height: 540,
        background: t.chatBg,
        border: `1px solid ${t.border}`,
        borderRadius: 18,
        display: "flex",
        flexDirection: "column",
        zIndex: 300,
        boxShadow: t.shadowLg,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 16px",
          borderBottom: `1px solid ${t.border}`,
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: t.dark ? "#161616" : "#f5f5f3",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #4ade80, #5b8af0)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 17,
            flexShrink: 0,
          }}
        >
          🌿
        </div>

        <div style={{ flex: 1 }}>
          <div
            style={{
              fontWeight: 600,
              fontSize: 14,
              color: t.text,
            }}
          >
            MindEase
          </div>

          <div
            style={{
              fontSize: 11.5,
              color: "#4ade80",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#4ade80",
              }}
            />
            Here for you
          </div>
        </div>

        <button
          className="btn-base"
          onClick={onClose}
          style={{
            background: "none",
            color: t.muted,
            padding: 5,
            borderRadius: 7,
          }}
        >
          <Icon name="x" size={15} />
        </button>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "14px 14px 6px",
          display: "flex",
          flexDirection: "column",
          gap: 11,
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className="chat-bubble"
            style={{
              display: "flex",
              justifyContent:
                msg.role === "user" ? "flex-end" : "flex-start",
              alignItems: "flex-end",
              gap: 8,
            }}
          >
            {msg.role === "assistant" && (
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #4ade80, #5b8af0)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  flexShrink: 0,
                  marginBottom: 2,
                }}
              >
                🌿
              </div>
            )}

            <div
              style={{
                maxWidth: "78%",
                padding: "9px 13px",
                borderRadius:
                  msg.role === "user"
                    ? "16px 16px 4px 16px"
                    : "16px 16px 16px 4px",
                background:
                  msg.role === "user" ? t.userBubble : t.aiBubble,
                fontSize: 13.5,
                lineHeight: 1.55,
                color: t.text,
                border: `1px solid ${
                  msg.role === "user" ? "transparent" : t.border
                }`,
              }}
            >
              {msg.text}
            </div>

            {msg.role === "user" && (
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background:
                    currentUser?.color || t.accent,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#fff",
                  flexShrink: 0,
                  marginBottom: 2,
                }}
              >
                {currentUser?.avatar}
              </div>
            )}
          </div>
        ))}

        {typing && (
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, #4ade80, #5b8af0)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
              }}
            >
              🌿
            </div>

            <div
              style={{
                background: t.aiBubble,
                border: `1px solid ${t.border}`,
                borderRadius: "16px 16px 16px 4px",
                padding: "11px 14px",
                display: "flex",
                gap: 4,
              }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="typing-dot"
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: t.muted,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Quick prompts */}
      <div
        style={{
          padding: "6px 12px",
          display: "flex",
          gap: 6,
          overflowX: "auto",
        }}
      >
        {QUICK_PROMPTS.map((p) => (
          <button
            key={p}
            className="btn-base"
            onClick={() => send(p)}
            style={{
              background: t.dark
                ? "rgba(91,138,240,0.1)"
                : "rgba(91,138,240,0.07)",
              color: t.accent,
              border: `1px solid ${
                t.dark
                  ? "rgba(91,138,240,0.2)"
                  : "rgba(91,138,240,0.15)"
              }`,
              borderRadius: 20,
              padding: "4px 11px",
              fontSize: 11.5,
              whiteSpace: "nowrap",
              fontWeight: 500,
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input */}
      <div
        style={{
          padding: "8px 12px 14px",
          display: "flex",
          gap: 8,
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Share how you're feeling..."
          style={{
            flex: 1,
            background: t.inputBg,
            border: `1px solid ${t.border}`,
            borderRadius: 11,
            padding: "9px 13px",
            color: t.text,
            fontSize: 13,
            outline: "none",
          }}
        />

        <button
          className="btn-base"
          onClick={() => send()}
          style={{
            background:
              "linear-gradient(135deg, #5b8af0, #c084fc)",
            color: "#fff",
            width: 38,
            height: 38,
            borderRadius: 11,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="send" size={14} />
        </button>
      </div>
    </div>
  );
}