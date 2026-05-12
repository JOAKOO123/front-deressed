export default function Spinner({ text = "Cargando..." }) {
  return (
    <div className="flex flex-col items-center gap-3 text-gray-400">
      <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
      <p className="text-sm">{text}</p>
    </div>
  );
}