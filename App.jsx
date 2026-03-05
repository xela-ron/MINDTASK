import { useAuth } from "./context/AuthContext";
import { useTheme } from "./context/ThemeContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { GlobalStyles } from "./styles/GlobalStyles";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";

function AppInner() {
  const { currentUser } = useAuth();
  const { dark } = useTheme();

  return (
    <>
      <GlobalStyles dark={dark} />
      {currentUser ? <Dashboard /> : <AuthPage />}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </ThemeProvider>
  );
}
