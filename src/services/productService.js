const BFF_URL = import.meta.env.VITE_BFF_URL || "http://localhost:8080";

export const productService = {
  async getProducts({ category, size, inStock, page = 0, pageSize = 20, sort } = {}) {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("pageSize", pageSize);
    if (category && category !== "all") params.append("category", category);
    if (size)     params.append("size", size);
    if (inStock  != null) params.append("inStock", inStock);
    if (sort)     params.append("sort", sort);

    const res = await fetch(`${BFF_URL}/api/catalog/products?${params.toString()}`);
    if (!res.ok) throw new Error("No se pudieron cargar los productos.");

    const data = await res.json();
    return (data.content ?? []).map((p) => ({
      id:       p.id,
      name:     p.name,
      price:    p.price,
      category: p.category,
      image:    p.imageUrl,
      link:     p.productLink,
    }));
  },
};