const API_URL = 'http://127.0.0.1:8000'; 

const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
};

export const getProductos = async ({ page = 0, limit = 4, nombre = '' } = {}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (nombre) params.append('nombre', nombre);

  const res = await fetch(`${API_URL}/productos?${params.toString()}`);
  if (!res.ok) throw new Error('Error al obtener productos de la API');
  return await res.json();
};

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
    if (res.status === 401) throw new Error('Tu sesión venció. Por favor, volvé a iniciar sesión.');
    if (res.status === 409) throw new Error(data.detail || 'Sin stock suficiente.');
    throw new Error(data.detail || 'Error al procesar la compra.');
  }
  return data;
};

export const getMisPedidos = async () => {
  const res = await fetch(`${API_URL}/pedidos/mios`, { headers: getAuthHeaders() });
  const data = await res.json().catch(() => []);
  if (!res.ok) {
    if (res.status === 401) throw new Error('Tu sesión venció.');
    throw new Error(data.detail || 'Error al cargar el historial.');
  }
  return data;
};

export const loginUser = async (username, password) => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || 'Usuario o contraseña incorrectos');

  const token = data.access_token || data.token;
  if (token) localStorage.setItem('token', token);
  return data;
};

export const registerUser = async (email, password) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      nombre: email.split('@')[0],
      email: email,
      password: password,
      acepto_tratamiento: true
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || 'Error al crear la cuenta');
  return data;
};

export const solicitarArrepentimiento = async (pedidoId, productoId) => {
  const res = await fetch(`${API_URL}/pedidos/${pedidoId}/revocacion`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ producto_id: productoId }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || 'Error al procesar el arrepentimiento.');
  return data;
};

export const getMiPerfil = async () => {
  const res = await fetch(`${API_URL}/auth/me`, { headers: getAuthHeaders() }); // Este sí está en /auth
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401) throw new Error('Tu sesión venció. Por favor, volvé a iniciar sesión.');
    throw new Error(data.detail || 'Error al cargar el perfil.');
  }
  return data;
};

// CORRECCIÓN: La ruta es /usuarios/me, no /auth/me
export const darDeBajaCuenta = async () => {
  const res = await fetch(`${API_URL}/usuarios/me`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401) throw new Error('Tu sesión venció.');
    throw new Error(data.detail || 'Error al dar de baja la cuenta.');
  }
  return data;
};

// NUEVO: Exportar datos del usuario
export const exportarMisDatos = async () => {
  const res = await fetch(`${API_URL}/usuarios/me/exportar`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error('Tu sesión venció.');
    throw new Error('Error al exportar los datos.');
  }
  // Devolvemos el texto crudo en lugar de JSON, porque el backend devuelve un string
  return await res.text();
};

export const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};