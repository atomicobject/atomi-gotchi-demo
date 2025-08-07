import { ROUTES } from "@/types/navigation";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { SignUpPage } from "./pages/SignUpPage";
import { CookingPage } from "./pages/games/CookingPage";
import { SimonSaysPage } from "@/pages/games/SimonSaysPage";
import { HigherLowerPage } from "@/pages/games/HigherOrLower";

import { RockPaperScissors } from "@/pages/games/RockPaperScissors";

// Simple auth state management
const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
    setLoading(false);
  }, []);

  return { user, loading };
};

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <Navigate to="/home" replace /> : <>{children}</>;
};

export default function App() {
  return (
    <AnimatedBackground>
      <Routes>
        {/* Public Routes */}
        <Route
          path={ROUTES.signup}
          element={
            <PublicRoute>
              <SignUpPage />
            </PublicRoute>
          }
        />
        <Route
          path={ROUTES.login}
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        {/* Protected Routes */}
        <Route
          path={ROUTES.home}
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.simonSays}
          element={
            <ProtectedRoute>
              <SimonSaysPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.cooking}
          element={
            <ProtectedRoute>
              <CookingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.higherLower}
          element={
            <ProtectedRoute>
              <HigherLowerPage />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.rockPaperScissors}
          element={
            <ProtectedRoute>
              <RockPaperScissors />
            </ProtectedRoute>
          }
        />
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AnimatedBackground>
  );
}
