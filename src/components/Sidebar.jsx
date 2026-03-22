export default function Sidebar() {
  return (
    <aside className="w-1/5 bg-gray-50 p-6 border-r">
      <div className="flex flex-col items-center mb-6">
        <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
        <p className="mt-3 text-sm font-semibold">
          Profile & Preferences
        </p>
      </div>

      <nav className="space-y-4 text-gray-600">
        <p>My Style</p>
        <p>Clothing Preferences</p>
        <p>Size Adjustment</p>
        <p>Favorites</p>
        <p>Fit Settings</p>
      </nav>
    </aside>
  );
}