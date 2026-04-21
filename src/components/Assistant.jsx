import { useState } from "react";

export default function Assistant() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Panel del asistente */}
      <div
        className={`
          fixed bottom-[90px] right-6 w-80 bg-white rounded-2xl shadow-2xl
          flex flex-col overflow-hidden z-[100] max-h-[480px]
          origin-bottom-right transition-all duration-300
          ${isOpen
            ? "scale-100 opacity-100 pointer-events-auto"
            : "scale-75 opacity-0 pointer-events-none"
          }
        `}
      >
        {/* Header */}
        <div className="bg-black text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-lg">
              ✨
            </div>
            <span className="font-semibold text-sm">Style Assistant</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white text-xl leading-none hover:text-gray-300 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50">
          <div className="bg-gray-200 text-gray-800 text-xs px-4 py-3 rounded-2xl rounded-tl-sm max-w-[80%]">
            Hi! How can I help you find your style today?
          </div>
          <div className="bg-black text-white text-xs px-4 py-3 rounded-2xl rounded-tr-sm max-w-[80%] self-end">
            I need a winter outfit recommendation
          </div>
        </div>

        {/* Input */}
        <div className="flex border-t border-gray-200 bg-white">
          <input
            type="text"
            placeholder="Ask me anything..."
            className="flex-1 px-4 py-3 text-sm outline-none"
          />
          <button className="bg-black text-white px-4 text-base hover:bg-gray-800 transition-colors">
            →
          </button>
        </div>
      </div>

      {/* Burbuja flotante */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-black text-white text-2xl
                   flex items-center justify-center z-[101]
                   shadow-lg hover:scale-110 hover:shadow-xl
                   transition-all duration-200"
        title="Style Assistant"
      >
        {isOpen ? "×" : "✨"}
      </button>
    </>
  );
}