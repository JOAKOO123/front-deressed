const CATEGORY_LABELS = {
  superior:  "Superior",
  inferior:  "Inferior",
  zapatilla: "Zapatilla",
  accesorio: "Accesorio",
};

const CATEGORY_COLORS = {
  superior:  "bg-blue-50 text-blue-600",
  inferior:  "bg-purple-50 text-purple-600",
  zapatilla: "bg-orange-50 text-orange-600",
  accesorio: "bg-green-50 text-green-600",
};

export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
      {/* Imagen */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {/* Badge categoría */}
        <span className={`absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded-full ${CATEGORY_COLORS[product.category]}`}>
          {CATEGORY_LABELS[product.category] || product.category}
        </span>
        {/* Badge sin stock */}
        {!product.in_stock && (
          <span className="absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-500">
            Sin stock
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <p className="text-sm font-semibold text-black leading-tight line-clamp-2">
          {product.name}
        </p>

        {/* Talla y fit */}
        {(product.size || product.fit) && (
          <div className="flex gap-2 flex-wrap">
            {product.size && (
              <span className="text-xs px-2 py-0.5 rounded-full border border-gray-200 text-gray-500">
                Talla {product.size}
              </span>
            )}
            {product.fit && (
              <span className="text-xs px-2 py-0.5 rounded-full border border-gray-200 text-gray-500">
                {product.fit}
              </span>
            )}
          </div>
        )}

        <p className="text-base font-bold text-black">
          ${product.price.toLocaleString("es-CL")}
        </p>

        {/* Link a la prenda */}
        <a
          href={product.product_link}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-auto pt-2 w-full text-center text-xs font-semibold py-2 rounded-lg border transition-colors
            ${product.in_stock
              ? "border-black text-black hover:bg-black hover:text-white"
              : "border-gray-200 text-gray-400 pointer-events-none"
            }`}
        >
          {product.in_stock ? "Ver prenda →" : "Sin stock"}
        </a>
      </div>
    </div>
  );
}