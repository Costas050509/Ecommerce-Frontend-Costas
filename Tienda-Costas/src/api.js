const API_URL = VITE_API_URL;

export const getProductos = async ({ page = 0, limit = 4, nombre = "" } = {}) => {
  const params = new URLSearchParams();
  params.append("skip", page * limit);
  params.append("limit", limit);
  if (nombre) params.append("nombre", nombre);

  const response = await fetch(`${API_URL}/productos?${params.toString()}`);
  if (!response.ok) throw new Error("Error al obtener los productos");
  return await response.json();
};