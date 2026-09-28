const API_URL = "http://127.0.0.1:8000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token") || localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    "Authorization": token ? `Bearer ${token}` : "",
  };
};

export const crearPedido = async (items) => {
  // Filtramos para enviar UNICAMENTE producto_id y cantidad al backend
  const payload = {
    items: items.map((item) => ({
      producto_id: item.id || item.producto_id,
      cantidad: item.cantidad,
    })),
  };

  const res = await fetch(`${API_URL}/pedidos/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Tu sesión venció. Por favor, volvé a iniciar sesión.");
    }
    if (res.status === 409) {
      throw new Error(data.detail || "Sin stock suficiente.");
    }
    throw new Error(data.detail || "Ocurrió un error al procesar la compra.");
  }

  return data;
};

export const getMisPedidos = async () => {
  const res = await fetch(`${API_URL}/pedidos/mios`, {
    headers: getAuthHeaders(),
  });

  const data = await res.json().catch(() => ([]));

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Tu sesión venció. Por favor, volvé a iniciar sesión.");
    }
    throw new Error(data.detail || "Error al cargar el historial de pedidos.");
  }

  return data;
};