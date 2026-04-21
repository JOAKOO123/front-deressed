// Servicio de productos — reemplaza la simulación con tu backend real

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const MOCK_PRODUCTS = [
  { id: 1,  name: "Polera Oversize Blanca",   price: 14990, category: "superior",   image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80",  link: "https://example.com/polera-oversize-blanca"  },
  { id: 2,  name: "Polera Striped Navy",       price: 12990, category: "superior",   image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&q=80",  link: "https://example.com/polera-striped-navy"     },
  { id: 3,  name: "Hoodie Negro Básico",       price: 24990, category: "superior",   image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=80",  link: "https://example.com/hoodie-negro"            },
  { id: 4,  name: "Camisa Lino Beige",         price: 19990, category: "superior",   image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80",  link: "https://example.com/camisa-lino-beige"       },
  { id: 5,  name: "Jeans Slim Azul",           price: 29990, category: "inferior",   image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80",  link: "https://example.com/jeans-slim-azul"         },
  { id: 6,  name: "Pantalón Cargo Khaki",      price: 34990, category: "inferior",   image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&q=80",  link: "https://example.com/pantalon-cargo-khaki"    },
  { id: 7,  name: "Jogger Gris Melange",       price: 22990, category: "inferior",   image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400&q=80",  link: "https://example.com/jogger-gris"             },
  { id: 8,  name: "Short Deportivo Negro",     price: 16990, category: "inferior",   image: "https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=400&q=80",  link: "https://example.com/short-deportivo"         },
  { id: 9,  name: "Nike Air Force 1 Blancas",  price: 84990, category: "zapatilla",  image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400&q=80",  link: "https://example.com/air-force-1"             },
  { id: 10, name: "Adidas Stan Smith",         price: 74990, category: "zapatilla",  image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&q=80",  link: "https://example.com/stan-smith"              },
  { id: 11, name: "Converse Chuck Taylor",     price: 59990, category: "zapatilla",  image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",  link: "https://example.com/converse-chuck"          },
  { id: 12, name: "New Balance 574 Gris",      price: 89990, category: "zapatilla",  image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&q=80",  link: "https://example.com/nb-574-gris"             },
  { id: 13, name: "Gorro Beanie Negro",        price: 8990,  category: "accesorio",  image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400&q=80",  link: "https://example.com/gorro-beanie"            },
  { id: 14, name: "Cinturón Cuero Café",       price: 12990, category: "accesorio",  image: "https://images.unsplash.com/photo-1624222247344-550fb60fe8ff?w=400&q=80",  link: "https://example.com/cinturon-cuero"          },
  { id: 15, name: "Mochila Canvas Gris",       price: 39990, category: "accesorio",  image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",  link: "https://example.com/mochila-canvas"          },
  { id: 16, name: "Gafas de Sol Cuadradas",    price: 18990, category: "accesorio",  image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80",  link: "https://example.com/gafas-cuadradas"         },
];

export const productService = {
  async getProducts() {
    await delay(700);
    // Aquí va tu llamada real al backend, por ejemplo:
    // const res = await fetch("/api/productos");
    // if (!res.ok) throw new Error("No se pudieron cargar los productos.");
    // return res.json();

    return MOCK_PRODUCTS;
  },
};