import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import SizeAdjustment from "./pages/SizeAdjustment";
import Products from "./pages/Products";
import MyStyle from "./pages/MyStyle";
import ClothingPreferences from "./pages/ClothingPreferences";
import Favorites from "./pages/Favorites";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<AuthPage defaultTab="login" />} />
      <Route path="/register" element={<AuthPage defaultTab="register" />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="/products" element={<Products />} />
      <Route path="/my-style" element={<MyStyle />} />
      <Route path="/clothing-preferences" element={<ClothingPreferences />} />

      {/* Rutas privadas — requieren sesión activa */}
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/size-adjustment" element={<PrivateRoute><SizeAdjustment /></PrivateRoute>} />
      <Route path="/favorites" element={<PrivateRoute><Favorites /></PrivateRoute>} />
      <Route path="/admin" element={<PrivateRoute><AdminRoute><AdminDashboard /></AdminRoute></PrivateRoute>} />
    </Routes>
  );
}

export default App;