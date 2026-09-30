const BASE_URL = "http://127.0.0.1:8000";

// Helper interno para obtener token
const getToken = () => localStorage.getItem("token") || localStorage.getItem("access_token");

// --- ENDPOINTS DE PEDIDOS ---

// 1. Checkout (POST /pedidos/)
export const checkout = async (datosPedido) => {
  const token = getToken();
  const response = await fetch(`${BASE_URL}/pedidos/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(datosPedido),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Error al procesar la compra");
  }
  return data;
};

// 2. Mis Pedidos (GET /pedidos/mios)
export const getMisPedidos = async () => {
  const token = getToken();
  const response = await fetch(`${BASE_URL}/pedidos/mios`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("No se pudo obtener el historial de pedidos");
  }

  return await response.json();
};

// 3. Obtener Pedido por ID (GET /pedidos/{pedido_id})
export const getPedidoById = async (pedidoId) => {
  const token = getToken();
  const response = await fetch(`${BASE_URL}/pedidos/${pedidoId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("No se pudo obtener el detalle del pedido");
  }

  return await response.json();
};

// 4. Revocar pedido / Arrepentimiento (POST /pedidos/{pedido_id}/revocacion)
export const revocarPedido = async (pedidoId) => {
  const token = getToken();
  const response = await fetch(`${BASE_URL}/pedidos/${pedidoId}/revocacion`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Error al procesar la solicitud de arrepentimiento");
  }

  return data;
};

// --- ENDPOINTS DE USUARIOS / DERECHOS ---

// Obtener Mis Datos
export const getMisDatos = async () => {
  const token = getToken();
  const response = await fetch(`${BASE_URL}/usuarios/me/datos`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("No se pudieron cargar tus datos");
  return await response.json();
};

// Descargar JSON de mis datos (Blob)
export const descargarMisDatos = async () => {
  const token = getToken();
  const response = await fetch(`${BASE_URL}/usuarios/me/exportar`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Error al exportar los datos");

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "mis_datos_ecommerce.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

// Darse de baja (Eliminar cuenta)
export const eliminarMiCuenta = async () => {
  const token = getToken();
  const response = await fetch(`${BASE_URL}/usuarios/me`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || "Error al eliminar la cuenta");
  }

  return true;
};