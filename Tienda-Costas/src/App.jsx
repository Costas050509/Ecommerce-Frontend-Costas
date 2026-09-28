import { useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';

import ProductCard from './components/ProductCard';
import { CarritoProvider, useCarrito } from './context/CarritoContext';
import Carrito from './pages/Carrito';
import Login from './pages/Login';
import MisPedidos from './pages/MisPedidos';
import Register from './pages/Register';
import { getProductos } from './services/api';

function Navbar() {
  const { items } = useCarrito();
  const totalItems = items.reduce((acc, item) => acc + item.cantidad, 0);
  const token =
    localStorage.getItem('token') || localStorage.getItem('access_token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('access_token');
    window.location.href = '/';
  };

  return (
    <nav
      style={{
        display: 'flex',
        gap: '20px',
        padding: '15px 20px',
        backgroundColor: '#222',
        color: '#fff',
        alignItems: 'center',
      }}
    >
      <Link
        to="/"
        style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}
      >
        Catálogo
      </Link>
      <Link to="/carrito" style={{ color: '#fff', textDecoration: 'none' }}>
        Carrito 🛒 ({totalItems})
      </Link>

      {token ? (
        <>
          <Link
            to="/mis-pedidos"
            style={{ color: '#fff', textDecoration: 'none' }}
          >
            Mis Pedidos
          </Link>
          <button
            onClick={handleLogout}
            style={{
              marginLeft: 'auto',
              padding: '6px 12px',
              backgroundColor: '#dc3545',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Cerrar Sesión
          </button>
        </>
      ) : (
        <div
          style={{
            marginLeft: 'auto',
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
          }}
        >
          <Link
            to="/login"
            style={{
              color: '#fff',
              textDecoration: 'none',
              backgroundColor: '#007bff',
              padding: '6px 12px',
              borderRadius: '4px',
            }}
          >
            Iniciar Sesión
          </Link>
          <Link
            to="/register"
            style={{
              color: '#fff',
              textDecoration: 'none',
              backgroundColor: '#28a745',
              padding: '6px 12px',
              borderRadius: '4px',
            }}
          >
            Registrarse
          </Link>
        </div>
      )}
    </nav>
  );
}

function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(0);
  const [busqueda, setBusqueda] = useState('');
  const LIMIT = 4;

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    getProductos({ page, limit: LIMIT, nombre: busqueda })
      .then((data) => setProductos(data))
      .catch((err) => {
        console.error(err);
        setError(
          'No se pudieron cargar los productos. Intente nuevamente más tarde.',
        );
      })
      .finally(() => setIsLoading(false));
  }, [page, busqueda]);

  const handleBusqueda = (e) => {
    setPage(0);
    setBusqueda(e.target.value);
  };

  return (
    <main style={{ padding: '20px' }}>
      <h1>Catálogo de Productos</h1>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Buscar producto por nombre..."
          value={busqueda}
          onChange={handleBusqueda}
          style={{
            padding: '10px',
            width: '100%',
            maxWidth: '400px',
            fontSize: '1rem',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
      </div>

      {isLoading && (
        <p style={{ fontSize: '1.2rem' }}>Cargando productos...</p>
      )}

      {error && (
        <p style={{ color: 'red', fontWeight: 'bold', fontSize: '1.1rem' }}>
          {error}
        </p>
      )}

      {!isLoading && !error && productos.length === 0 && (
        <p style={{ fontSize: '1.1rem', color: '#666' }}>
          No se encontraron productos en el catálogo.
        </p>
      )}

      {!isLoading && !error && productos.length > 0 && (
        <>
          <div
            style={{
              display: 'grid',
              gap: '16px',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            }}
          >
            {productos.map((prod) => (
              <ProductCard key={prod.id} producto={prod} />
            ))}
          </div>

          <div
            style={{
              marginTop: '25px',
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
            }}
          >
            <button
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              style={{
                padding: '8px 16px',
                cursor: page === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              Anterior
            </button>
            <span>Página {page + 1}</span>
            <button
              disabled={productos.length < LIMIT}
              onClick={() => setPage(page + 1)}
              style={{
                padding: '8px 16px',
                cursor: productos.length < LIMIT ? 'not-allowed' : 'pointer',
              }}
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </main>
  );
}

export default function App() {
  return (
    <CarritoProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Catalogo />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/mis-pedidos" element={<MisPedidos />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </CarritoProvider>
  );
}