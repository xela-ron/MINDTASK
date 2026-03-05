import { createContext, useContext, useState } from "react";
import { DEFAULT_PAGES, DEFAULT_TASKS } from "../data/defaults";

const AuthContext = createContext();

// Seed data per user
function createUserData(userId) {
  return {
    pages: DEFAULT_PAGES.map(p => ({ ...p, id: `${userId}-${p.id}`, pageId: `${userId}-${p.id}` })),
    tasks: DEFAULT_TASKS.map(t => ({ ...t, id: `${userId}-${t.id}`, pageId: `${userId}-p3` })),
  };
}

const DEMO_USERS = [
  { id: "u1", name: "Alex Rivera",  email: "alex@mindtask.app",  password: "demo123", avatar: "AR", color: "#5b8af0" },
  { id: "u2", name: "Jamie Lee",    email: "jamie@mindtask.app", password: "demo123", avatar: "JL", color: "#c084fc" },
  { id: "u3", name: "Sam Torres",   email: "sam@mindtask.app",   password: "demo123", avatar: "ST", color: "#4ade80" },
];

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState("");

  // Per-user data store (simulates a DB)
  const [userDataStore, setUserDataStore] = useState(() => {
    const store = {};
    DEMO_USERS.forEach(u => { store[u.id] = createUserData(u.id); });
    return store;
  });

  const login = (email, password) => {
    const user = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      setError("");
      return true;
    }
    setError("Invalid email or password.");
    return false;
  };

  const register = (name, email, password) => {
    if (DEMO_USERS.find(u => u.email === email)) {
      setError("An account with this email already exists.");
      return false;
    }
    const id = `u${Date.now()}`;
    const initials = name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();
    const colors = ["#f87171","#fbbf24","#34d399","#60a5fa","#a78bfa","#f472b6"];
    const newUser = { id, name, email, password, avatar: initials, color: colors[Math.floor(Math.random()*colors.length)] };
    DEMO_USERS.push(newUser);
    setUserDataStore(prev => ({ ...prev, [id]: createUserData(id) }));
    setCurrentUser(newUser);
    setError("");
    return true;
  };

  const logout = () => setCurrentUser(null);

  // Data accessors
  const getUserData = () => currentUser ? userDataStore[currentUser.id] : null;

  const updatePages = (updater) => {
    if (!currentUser) return;
    setUserDataStore(prev => ({
      ...prev,
      [currentUser.id]: {
        ...prev[currentUser.id],
        pages: typeof updater === "function" ? updater(prev[currentUser.id].pages) : updater,
      }
    }));
  };

  const updateTasks = (updater) => {
    if (!currentUser) return;
    setUserDataStore(prev => ({
      ...prev,
      [currentUser.id]: {
        ...prev[currentUser.id],
        tasks: typeof updater === "function" ? updater(prev[currentUser.id].tasks) : updater,
      }
    }));
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, error, setError, getUserData, updatePages, updateTasks, demoUsers: DEMO_USERS }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
