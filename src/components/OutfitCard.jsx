export default function OutfitCard({ outfit }) {
  return (
    <div className="bg-gray-100 rounded-xl p-4 shadow text-center w-64">
      <img
        src={outfit.image}
        alt={outfit.name}
        className="rounded-lg mb-3 mx-auto"
      />
      <p className="font-semibold">{outfit.name}</p>
      <p className="text-sm text-gray-500">
        {outfit.description}
      </p>
    </div>
  );
}