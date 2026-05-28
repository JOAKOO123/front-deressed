import { useEffect, useState, useMemo, useCallback } from "react";
import AppLayout from "../components/AppLayout";
import Spinner from "../components/Spinner";
import ProductCard from "../components/ProductCard";
import { productService } from "../services/productService";

const CATEGORIES = [
  { value: "all", label: "Todos" },
  { value: "JEANS", label: "Jeans" },
  { value: "POLERAS", label: "Poleras" },
  { value: "ZAPATILLAS", label: "Zapatillas" },
  { value: "ACCESORIOS", label: "Accesorios" },
];

const PAGE_SIZE = 20;
const PRICE_MAX = 150000;

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, PRICE_MAX]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchProducts = useCallback((pageNum, category) => {
    setLoading(true);
    setError("");
    productService.getProductsPaginated({
      category: category !== "all" ? category : undefined,
      page: pageNum,
      pageSize: PAGE_SIZE,
    })
      .then(({ products: data, totalPages: tp, totalElements: te }) => {
        setProducts(data);
        setTotalPages(tp);
        setTotalElements(te);
      })
      .catch(() => setError("No se pudieron cargar los productos. Intenta de nuevo."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchProducts(page, activeCategory);
  }, [page, activeCategory, fetchProducts]);

  const handleCategory = (cat) => {
    setCategory(cat);
    setPage(0);
  };

  const dataMin = useMemo(() => Math.min(...products.map((p) => p.price), 0), [products]);
  const dataMax = useMemo(() => Math.max(...products.map((p) => p.price), PRICE_MAX), [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      return p.price >= priceRange[0] && p.price <= priceRange[1];
    });
  }, [products, priceRange]);

  const pages = Array.from({ length: totalPages }, (_, i) => i);
  const visiblePages = pages.filter(
    (p) => p === 0 || p === totalPages - 1 || Math.abs(p - page) <= 2,
  );

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
        <section className="flex-1 overflow-y-auto p-6 flex flex-col">
          <div className="mb-5">
            <h1 className="text-2xl font-bold mb-1">Ropa</h1>
            <p className="text-sm text-gray-400">
              {loading
                ? "Cargando..."
                : `${totalElements} producto${totalElements !== 1 ? "s" : ""} · página ${page + 1} de ${totalPages}`}
            </p>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-20 flex-1">
              <Spinner text="Cargando productos..." />
            </div>
          )}

          {!loading && error && (
            <div className="flex items-center justify-center py-20 flex-1">
              <div className="text-center flex flex-col gap-3">
                <p className="text-gray-500 text-sm">{error}</p>
                <button onClick={() => fetchProducts(page, activeCategory)}
                  className="text-sm font-semibold underline underline-offset-2">
                  Reintentar
                </button>
              </div>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="flex items-center justify-center py-20 flex-1">
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

          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 mt-8 pb-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-30 hover:bg-gray-100 transition-colors"
              >
                ←
              </button>

              {visiblePages.map((p, i) => {
                const prev = visiblePages[i - 1];
                const showEllipsis = prev !== undefined && p - prev > 1;
                return (
                  <span key={p} className="flex items-center gap-1">
                    {showEllipsis && <span className="px-1 text-gray-400">...</span>}
                    <button
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors
                        ${page === p
                          ? "bg-black text-white"
                          : "hover:bg-gray-100 text-gray-600"
                        }`}
                    >
                      {p + 1}
                    </button>
                  </span>
                );
              })}

              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className="px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-30 hover:bg-gray-100 transition-colors"
              >
                →
              </button>
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}