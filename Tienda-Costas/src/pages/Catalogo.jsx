import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { getProductos, getImageUrl } from '../services/api';

export default function Catalogo() {
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
        // Blindaje por si viene paginado o array directo
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

  return (
    <main className="pt-24 md:pt-32 px-4 md:px-16 max-w-[1280px] mx-auto flex flex-col gap-12 mb-24">
      {/* Hero Section */}
      <section className="relative bg-surface-container-low rounded-[2rem] overflow-hidden flex flex-col md:flex-row items-center gap-8 min-h-[400px]">
        <div className="flex-1 p-8 md:p-16 flex flex-col gap-6 z-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-on-surface">
            Salud en cada sorbo
          </h1>
          <p className="font-sans text-lg text-on-surface-variant max-w-md">
            Descubre nuestra línea de jugos naturales prensados en frío. Energía pura y frescura inigualable para tu día.
          </p>
          <button className="bg-primary text-on-primary font-bold text-sm rounded-full px-8 py-4 w-fit hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-[0_12px_32px_rgba(45,212,97,0.12)]">
            Explorar productos
          </button>
        </div>
        <div className="w-full md:w-1/2 h-64 md:h-full absolute md:relative inset-0 md:inset-auto opacity-20 md:opacity-100 flex items-center justify-center">
          {/* Si hay productos cargados, mostramos el primero como imagen decorativa. Si no, dejamos un placeholder con icono */}
          {productos[0]?.imagen_url ? (
            <img
              src={getImageUrl(productos[0].imagen_url)}
              alt="Jugos frescos"
              className="w-full h-full object-contain p-8"
            />
          ) : (
            <span className="material-symbols-outlined text-[180px] text-primary/20">local_drink</span>
          )}
        </div>
      </section>

      {/* Buscador */}
      <section className="flex flex-col gap-6">
        <div className="relative max-w-xl w-full">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input
            type="text"
            placeholder="Buscar jugos..."
            value={busqueda}
            onChange={handleBusqueda}
            className="w-full h-[56px] pl-12 pr-4 bg-[#F4F7F2] border-none rounded-[1rem] font-sans text-on-surface focus:ring-2 focus:ring-primary outline-none transition-shadow"
          />
        </div>
      </section>

      {/* Estados */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {error && <p className="text-error font-bold text-center bg-[#ffdad6] p-4 rounded-[1rem]">{error}</p>}
      {!isLoading && !error && productos.length === 0 && (
        <div className="text-center py-12 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-2 opacity-50">search_off</span>
          <p className="text-lg">No se encontraron productos.</p>
        </div>
      )}

      {/* Grilla */}
      {!isLoading && !error && productos.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productos.map((prod) => (
              <ProductCard key={prod.id} producto={prod} />
            ))}
          </div>

          {/* Paginación */}
          <div className="mt-8 flex justify-center items-center gap-4">
            <button
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              className="flex items-center gap-2 px-6 py-2 rounded-full bg-surface-container-low text-on-surface hover:bg-surface-variant disabled:opacity-50 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Anterior
            </button>
            <span className="font-bold text-on-surface-variant">Página {page + 1}</span>
            <button
              disabled={productos.length < LIMIT}
              onClick={() => setPage(page + 1)}
              className="flex items-center gap-2 px-6 py-2 rounded-full bg-surface-container-low text-on-surface hover:bg-surface-variant disabled:opacity-50 transition-colors"
            >
              Siguiente
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </>
      )}
    </main>
  );
}