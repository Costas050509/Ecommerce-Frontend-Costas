import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductCard from './components/ProductCard';
import { CarritoProvider } from './context/CarritoContext';
import Arrepentimiento from './pages/Arrepentimiento';
import Carrito from './pages/Carrito';
import Login from './pages/Login';
import MisDatos from './pages/MisDatos';
import MisPedidos from './pages/MisPedidos';
import Register from './pages/Register';
import { getProductos } from './services/api';

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
      .then((data) => {
        if (Array.isArray(data)) {
          setProductos(data);
        } else if (data && Array.isArray(data.items)) {
          setProductos(data.items);
        } else {
          setProductos([]);
        }
      })
      .catch((err) => {
        console.error(err);
        setError('No se pudieron cargar los productos. Intente nuevamente más tarde.');
      })
      .finally(() => setIsLoading(false));
  }, [page, busqueda]);

  const handleBusqueda = (e) => {
    setPage(0);
    setBusqueda(e.target.value);
  };

  const listaProductos = Array.isArray(productos) ? productos : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-variant pb-4">
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-on-surface">
          Catálogo de Productos
        </h1>

        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
            search
          </span>
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={handleBusqueda}
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-surface-variant rounded-full text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-12 text-on-surface-variant font-medium flex items-center justify-center gap-2">
          <span className="material-symbols-outlined animate-spin">refresh</span>
          Cargando productos...
        </div>
      )}

      {error && (
        <div className="bg-error/10 border border-error/20 text-error p-4 rounded-xl text-center font-semibold">
          {error}
        </div>
      )}

      {!isLoading && !error && listaProductos.length === 0 && (
        <p className="text-center py-12 text-on-surface-variant font-medium">
          No se encontraron productos en el catálogo.
        </p>
      )}

      {!isLoading && !error && listaProductos.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {listaProductos.map((prod) => (
              <ProductCard key={prod.id} producto={prod} />
            ))}
          </div>

          <div className="pt-6 flex items-center justify-center gap-4">
            <button
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 border border-surface-variant rounded-full text-sm font-semibold hover:bg-surface-variant/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
            <span className="text-sm font-semibold text-on-surface-variant">
              Página {page + 1}
            </span>
            <button
              disabled={listaProductos.length < LIMIT}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 border border-surface-variant rounded-full text-sm font-semibold hover:bg-surface-variant/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <CarritoProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-surface text-on-surface">
          <Navbar />

          <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 md:px-8 max-w-[1280px] mx-auto w-full">
            <Routes>
              <Route path="/" element={<Catalogo />} />
              <Route path="/carrito" element={<Carrito />} />
              <Route path="/mis-pedidos" element={<MisPedidos />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/arrepentimiento/:pedidoId" element={<Arrepentimiento />} />
              <Route path="/mis-datos" element={<MisDatos />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </CarritoProvider>
  );
}