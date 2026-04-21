import { useNavigate } from "react-router-dom";

export default function TopBar() {
  const navigate = useNavigate();

  return (
    <header className="h-14 flex-shrink-0 border-b border-gray-100 flex items-center justify-center relative bg-white">
      <button
        onClick={() => navigate("/")}
        className="text-xl font-black tracking-[0.25em] uppercase hover:opacity-60 transition-opacity select-none"
      >
        DRESSED
      </button>
    </header>
  );
}