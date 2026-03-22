export default function Assistant() {
  return (
    <aside className="w-1/5 bg-gray-50 p-6 border-l flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-semibold mb-4">
          Style Assistant
        </h2>

        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center">
            
          </div>
        </div>

        <div className="bg-gray-200 p-3 rounded-lg text-sm mb-2">
          Hi! How can I help you find your style today?
        </div>

        <div className="bg-blue-100 p-3 rounded-lg text-sm mb-4 ml-auto w-fit">
          I need a winter outfit recommendation
        </div>
      </div>

      <div className="flex">
        <input
          type="text"
          placeholder="Ask me anything..."
          className="flex-1 border rounded-l-lg px-3 py-2 outline-none"
        />
        <button className="bg-black text-white px-4 rounded-r-lg">
          →
        </button>
      </div>
    </aside>
  );
}