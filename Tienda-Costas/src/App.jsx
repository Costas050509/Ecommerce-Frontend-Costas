import { useState, useEffect } from 'react';
import { getProductos } from './services/api';
import ProductCard from './components/ProductCard';
import './App.css';

export default function App() {
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Paso 2: Nuevos estados
  const [page, setPage] = useState(0);
  const [busqueda, setBusqueda] = useState('');
  const LIMIT = 4; // Cantidad de productos por página

  // Paso 2: useEffect dependiente de [page, busqueda]
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    getProductos({ page, limit: LIMIT, nombre: busqueda })
      .then((data) => {
        setProductos(data);
      })
      .catch((err) => {
        console.error(err);
        setError('No se pudieron cargar los productos. Intente nuevamente más tarde.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [page, busqueda]);

  // Paso 4: Manejador del buscador (resetea la página a 0 al filtrar)
  const handleBusqueda = (e) => {
    setPage(0);
    setBusqueda(e.target.value);
  };

  return (
    <main style={{ padding: '20px' }}>
      <h1>Catálogo de Productos</h1>

      {/* Paso 4: Buscador */}
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
            border: '1px solid #ccc'
          }}
        />
      </div>

      {/* 1. Estado de Carga */}
      {isLoading && <p style={{ fontSize: '1.2rem' }}>Cargando productos...</p>}

      {/* 2. Estado de Error */}
      {error && (
        <p style={{ color: 'red', fontWeight: 'bold', fontSize: '1.1rem' }}>
          {error}
        </p>
      )}

      {/* 3. Estado de Catálogo Vacío */}
      {!isLoading && !error && productos.length === 0 && (
        <p style={{ fontSize: '1.1rem', color: '#666' }}>
          No se encontraron productos en el catálogo.
        </p>
      )}

      {/* 4. Lista con Productos */}
      {!isLoading && !error && productos.length > 0 && (
        <>
          <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
            {productos.map((prod) => (
              <ProductCard key={prod.id} producto={prod} />
            ))}
          </div>

          {/* Paso 3: Botones de Paginación */}
          <div style={{ marginTop: '25px', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              style={{ padding: '8px 16px', cursor: page === 0 ? 'not-allowed' : 'pointer' }}
            >
              Anterior
            </button>

            <span>Página {page + 1}</span>

            <button
              disabled={productos.length < LIMIT}
              onClick={() => setPage(page + 1)}
              style={{ padding: '8px 16px', cursor: productos.length < LIMIT ? 'not-allowed' : 'pointer' }}
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </main>
  );
}