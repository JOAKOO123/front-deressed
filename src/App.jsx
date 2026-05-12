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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<AuthPage defaultTab="login" />} />
      <Route path="/register" element={<AuthPage defaultTab="register" />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/dashboard"       element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/profile"         element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/size-adjustment" element={<PrivateRoute><SizeAdjustment /></PrivateRoute>} />
      <Route path="/products"        element={<PrivateRoute><Products /></PrivateRoute>} />
      <Route path="/my-style"        element={<PrivateRoute><MyStyle /></PrivateRoute>} />
      <Route path="/clothing-preferences" element={<PrivateRoute><ClothingPreferences /></PrivateRoute>} />
      <Route path="/favorites" element={<PrivateRoute><Favorites /></PrivateRoute>} />
    </Routes>
  );
}

export default App;