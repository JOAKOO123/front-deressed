import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import Assistant from "./Assistant";

export default function AppLayout({ children }) {
  return (
    <div className="h-screen bg-gray-100">
      <div className="w-full h-full bg-white flex flex-col overflow-hidden">
        <TopBar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
          <Assistant />
        </div>
      </div>
    </div>
  );
}