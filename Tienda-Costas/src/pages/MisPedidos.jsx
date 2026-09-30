import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMisPedidos, getProductos } from '../services/api';

export default function MisPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [productosMap, setProductosMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // 1. Traemos los pedidos del backend
        const dataPedidos = await getMisPedidos();
        const listaPedidos = Array.isArray(dataPedidos) ? dataPedidos : (dataPedidos.items || []);
        setPedidos(listaPedidos);

        // 2. Traemos TODOS los productos para hacer un diccionario (ID -> Nombre, Precio)
        // Pedimos un límite alto para asegurarnos de traer todos los productos
        const dataProductos = await getProductos({ limit: 1000 }); 
        const listaProductos = Array.isArray(dataProductos) ? dataProductos : (dataProductos.items || []);
        
        const mapa = {};
        listaProductos.forEach(p => {
          mapa[p.id] = p;
        });
        setProductosMap(mapa);

      } catch (err) {
        setError(err.message || 'Error al cargar los datos');
      } finally {
        setIsLoading(false);
      }
    };

    cargarDatos();
  }, []);

  if (isLoading) return <div className="text-center pt-32 text-on-surface-variant font-bold">Cargando pedidos...</div>;
  if (error) return <div className="text-center pt-32 text-error font-bold">{error}</div>;

  return (
    <main className="pt-24 md:pt-32 px-4 max-w-[900px] mx-auto mb-24">
      <div className="flex items-center gap-3 mb-8">
        <span className="material-symbols-outlined text-3xl text-primary">local_shipping</span>
        <h1 className="font-display text-3xl font-bold text-on-surface">Mis Pedidos</h1>
      </div>

      {pedidos.length === 0 ? (
        <div className="bg-[#F9FBF8] border border-[#E9EBE8] rounded-[2rem] p-12 text-center text-on-surface-variant">
          <span className="material-symbols-outlined text-5xl mb-3 opacity-40">package_2</span>
          <p className="text-lg">Aún no realizaste ningún pedido.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {pedidos.map((pedido) => (
            <article key={pedido.id} className="bg-[#F9FBF8] border border-[#E9EBE8] rounded-[1.5rem] p-6 flex flex-col gap-4 shadow-sm">
              <div className="flex flex-wrap justify-between items-center gap-2 pb-4 border-b border-surface-variant">
                <div>
                  <span className="font-bold text-lg text-on-surface">Pedido #{pedido.id}</span>
                  <p className="text-xs text-on-surface-variant">Fecha: {pedido.fecha || pedido.creado_en || 'Reciente'}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${pedido.estado === 'cancelado' ? 'bg-[#ffdad6] text-[#93000a]' : 'bg-[#e8f5e9] text-[#2e7d32]'}`}>
                  {pedido.estado || 'Entregado'}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {pedido.items && pedido.items.map((item, idx) => {
                  // Buscamos el producto en nuestro diccionario local usando el producto_id
                  const prodId = item.producto_id || item.id;
                  const productoReal = productosMap[prodId];
                  
                  // Si el backend no manda nombre, usamos el del diccionario
                  const nombreFinal = item.nombre || item.producto?.nombre || (productoReal ? productoReal.nombre : `Producto #${prodId}`);
                  const precioFinal = item.precio || item.precio_unitario || (productoReal ? productoReal.precio : '0.00');
                  
                  return (
                    <div key={idx} className="flex justify-between text-sm text-on-surface">
                      <span>{item.cantidad}x {nombreFinal}</span>
                      <span className="text-on-surface-variant">${precioFinal}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap justify-between items-center pt-3 border-t border-surface-variant gap-4">
                <span className="font-display text-xl font-bold text-primary">
                  Total: ${pedido.total || '0.00'}
                </span>
                
                {/* Solo mostramos el botón de arrepentimiento si el pedido NO está cancelado */}
                {pedido.estado !== 'cancelado' && (
                  <button 
                    onClick={() => navigate(`/arrepentimiento/${pedido.id}`)}
                    className="bg-[#ba1a1a] text-white text-sm font-bold px-4 py-2 rounded-full hover:bg-[#93000a] transition-colors"
                  >
                    Arrepentirme de un producto
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}