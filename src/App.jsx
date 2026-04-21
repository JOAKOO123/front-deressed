import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<AuthPage defaultTab="login" />} />
      <Route path="/register" element={<AuthPage defaultTab="register" />} />
    </Routes>
  );
}

export default App;