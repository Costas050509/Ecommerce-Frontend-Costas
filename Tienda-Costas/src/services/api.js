const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Verificación temporal (Paso 4)
console.log("BASE_URL cargada:", BASE_URL);

export async function getProductos({ page = 1, limit = 12, nombre = "" } = {}) {
  const params = new URLSearchParams({ page, limit });
  if (nombre) params.set("nombre", nombre);

  const res = await fetch(`${BASE_URL}/productos/?${params}`);
  if (!res.ok) throw new Error(`Error ${res.status} al pedir los productos`);
  return res.json();
}

export async function getProductoById(id) {
  const res = await fetch(`${BASE_URL}/productos/${id}`);
  if (!res.ok) throw new Error(`Error ${res.status} al obtener el detalle del producto`);
  return res.json();
}