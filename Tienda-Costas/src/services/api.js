const API_URL = 'http://127.0.0.1:8000'; // O '/api' si usás proxy en vite.config.js

const getAuthHeaders = () => {
  const token =
    localStorage.getItem('token') || localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
};

// 1. Obtener catálogo
export const getProductos = async ({
  page = 0,
  limit = 4,
  nombre = '',
} = {}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (nombre) {
    params.append('nombre', nombre);
  }

  const res = await fetch(`${API_URL}/productos?${params.toString()}`);

  if (!res.ok) {
    throw new Error('Error al obtener productos de la API');
  }

  return await res.json();
};

// 2. Crear Pedido (Checkout)
export const crearPedido = async (items) => {
  const payload = {
    items: items.map((item) => ({
      producto_id: item.id || item.producto_id,
      cantidad: item.cantidad,
    })),
  };

  const res = await fetch(`${API_URL}/pedidos/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Tu sesión venció. Por favor, volvé a iniciar sesión.');
    }
    if (res.status === 409) {
      throw new Error(data.detail || 'Sin stock suficiente.');
    }
    throw new Error(data.detail || 'Error al procesar la compra.');
  }

  return data;
};

// 3. Historial de pedidos
export const getMisPedidos = async () => {
  const res = await fetch(`${API_URL}/pedidos/mios`, {
    headers: getAuthHeaders(),
  });

  const data = await res.json().catch(() => []);

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Tu sesión venció.');
    }
    throw new Error(data.detail || 'Error al cargar el historial.');
  }

  return data;
};
// 4. Iniciar Sesión (Login)
export const loginUser = async (username, password) => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  // ⚠️ Cambiá '/login/' por el nombre exacto que viste en http://127.0.0.1:8000/docs
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.detail || 'Usuario o contraseña incorrectos');
  }

  const token = data.access_token || data.token;
  if (token) {
    localStorage.setItem('token', token);
  }

  return data;
};

// 5. Registrar Usuario
export const registerUser = async (username, password) => {
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.detail || 'Error al crear la cuenta');
  }

  return data;
};