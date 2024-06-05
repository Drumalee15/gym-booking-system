import * as React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import NavigationBar from "./components/Layout/Navbar";
import AuthProvider, { useAuth } from "./contexts/AuthContext";

// Lazy load components
const HomeScreen = React.lazy(() => import("./screens/HomeScreen"));
const ClassDetailScreen = React.lazy(
  () => import("./screens/ClassDetailScreen")
);
const ProfileScreen = React.lazy(() => import("./screens/ProfileScreen"));
const BookingScreen = React.lazy(() => import("./screens/BookingScreen"));
const LoginScreen = React.lazy(() => import("./screens/LoginScreen"));
const RegisterScreen = React.lazy(() => import("./screens/RegisterScreen"));

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <NavigationBar />
        <React.Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <HomeScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/booking/:id"
              element={
                <PrivateRoute>
                  <BookingScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/class/:id"
              element={
                <PrivateRoute>
                  <ClassDetailScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfileScreen />
                </PrivateRoute>
              }
            />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
          </Routes>
        </React.Suspense>
      </Router>
    </AuthProvider>
  );
};

export default App;
