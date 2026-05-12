import { useEffect, useState, useMemo } from "react";
import AppLayout from "../components/AppLayout";
import Spinner from "../components/Spinner";
import ProductCard from "../components/ProductCard";
import { productService } from "../services/productService";

const CATEGORIES = [
  { value: "all",       label: "Todos"      },
  { value: "superior",  label: "Superior"   },
  { value: "inferior",  label: "Inferior"   },
  { value: "zapatilla", label: "Zapatillas" },
  { value: "accesorio", label: "Accesorios" },
];

const PRICE_MAX = 100000;

export default function Products() {
  const [products, setProducts]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [activeCategory, setCategory] = useState("all");
  const [priceRange, setPriceRange]   = useState([0, PRICE_MAX]);

  useEffect(() => {
    productService.getProducts()
      .then(setProducts)
      .catch(() => setError("No se pudieron cargar los productos. Intenta de nuevo."))
      .finally(() => setLoading(false));
  }, []);

  const dataMin = useMemo(() => Math.min(...products.map((p) => p.price), 0), [products]);
  const dataMax = useMemo(() => Math.max(...products.map((p) => p.price), PRICE_MAX), [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const catOk   = activeCategory === "all" || p.category === activeCategory;
      const priceOk = p.price >= priceRange[0] && p.price <= priceRange[1];
      return catOk && priceOk;
    });
  }, [products, activeCategory, priceRange]);

  return (
    <AppLayout>
      <div className="flex h-full overflow-hidden">

        {/* Panel de filtros */}
        <aside className="w-56 flex-shrink-0 border-r border-gray-100 p-6 flex flex-col gap-6 overflow-y-auto">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Tipo de prenda
            </p>
            <div className="flex flex-col gap-1">
              {CATEGORIES.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setCategory(value)}
                  className={`text-left px-3 py-2 rounded-lg text-sm transition-colors
                    ${activeCategory === value
                      ? "bg-black text-white font-semibold"
                      : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Precio</p>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>${priceRange[0].toLocaleString("es-CL")}</span>
                <span>${priceRange[1].toLocaleString("es-CL")}</span>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400">Mínimo</label>
                <input type="range" min={dataMin} max={dataMax} step={1000} value={priceRange[0]}
                  onChange={(e) => { const val = Number(e.target.value); if (val <= priceRange[1]) setPriceRange([val, priceRange[1]]); }}
                  className="w-full accent-black" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400">Máximo</label>
                <input type="range" min={dataMin} max={dataMax} step={1000} value={priceRange[1]}
                  onChange={(e) => { const val = Number(e.target.value); if (val >= priceRange[0]) setPriceRange([priceRange[0], val]); }}
                  className="w-full accent-black" />
              </div>
            </div>
            <button onClick={() => { setCategory("all"); setPriceRange([dataMin, dataMax]); }}
              className="text-xs text-gray-400 hover:text-black transition-colors underline underline-offset-2 text-left mt-1">
              Limpiar filtros
            </button>
          </div>
        </aside>

        {/* Grid de productos */}
        <section className="flex-1 overflow-y-auto p-6">
          <div className="mb-5">
            <h1 className="text-2xl font-bold mb-1">Ropa</h1>
            <p className="text-sm text-gray-400">
              {loading ? "Cargando..." : `${filtered.length} producto${filtered.length !== 1 ? "s" : ""} encontrado${filtered.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-20">
              <Spinner text="Cargando productos..." />
            </div>
          )}

          {!loading && error && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center flex flex-col gap-3">
                <p className="text-gray-500 text-sm">{error}</p>
                <button onClick={() => window.location.reload()} className="text-sm font-semibold underline underline-offset-2">
                  Reintentar
                </button>
              </div>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center flex flex-col gap-2">
                <p className="text-2xl">🔍</p>
                <p className="font-semibold text-gray-700">Sin resultados</p>
                <p className="text-sm text-gray-400">Prueba ajustando los filtros</p>
              </div>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}