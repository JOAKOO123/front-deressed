import { api } from "./api";

export const productService = {
  async getProducts({ category, size, inStock, page = 0, pageSize = 20, sort } = {}) {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("pageSize", pageSize);
    if (category && category !== "all") params.append("category", category);
    if (size) params.append("size", size);
    if (inStock != null) params.append("inStock", inStock);
    if (sort) params.append("sort", sort);

    const data = await api(`/api/catalog/products?${params.toString()}`);
    return (data?.content ?? []).map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      category: p.category,
      image: p.imageUrl,
      link: p.productLink,
    }));
  },
};