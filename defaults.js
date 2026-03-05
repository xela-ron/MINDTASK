export const DEFAULT_PAGES = [
  {
    id: "p1",
    title: "Welcome to MindTask 🌱",
    icon: "🌱",
    content: "# Welcome to MindTask\n\nThis is your personal productivity space with a mental wellness companion.\n\n## Getting Started\n\n- Create pages for your notes and ideas\n- Manage your tasks with the Task Board\n- Chat with MindEase whenever you feel stressed\n\n> **Tip:** Click the 💬 button in the bottom right to open your wellness companion anytime.",
    type: "page",
  },
  {
    id: "p2",
    title: "My Notes",
    icon: "📝",
    content: "# My Notes\n\nUse this page to jot down your thoughts, ideas, and reflections.\n\n## Today's Focus\n\n- What's the most important thing to accomplish?\n- What can I let go of?\n- How am I feeling right now?\n\n> Small consistent steps lead to big changes. 🌿",
    type: "page",
  },
  {
    id: "p3",
    title: "My Tasks",
    icon: "✅",
    content: "",
    type: "tasks",
  },
];

export const DEFAULT_TASKS = [
  { id: "t1", title: "Review project requirements", status: "done",        priority: "high",   tag: "Planning" },
  { id: "t2", title: "Set up development environment", status: "done",     priority: "high",   tag: "Dev" },
  { id: "t3", title: "Design UI wireframes",           status: "in-progress", priority: "high", tag: "Design" },
  { id: "t4", title: "Build authentication system",    status: "todo",     priority: "high",   tag: "Dev" },
  { id: "t5", title: "Integrate AI chatbot API",       status: "todo",     priority: "medium", tag: "AI" },
  { id: "t6", title: "Write unit tests",               status: "todo",     priority: "low",    tag: "QA" },
];
