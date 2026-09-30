import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMisPedidos, getProductos, solicitarArrepentimiento } from '../services/api';

export default function Arrepentimiento() {
  const { pedidoId } = useParams();
  const navigate = useNavigate();
  
  const [pedido, setPedido] = useState(null);
  const [productosMap, setProductosMap] = useState({});
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [codigoReembolso, setCodigoReembolso] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // 1. Traemos los pedidos
        const dataPedidos = await getMisPedidos();
        const listaPedidos = Array.isArray(dataPedidos) ? dataPedidos : (dataPedidos.items || []);
        const encontrado = listaPedidos.find(p => p.id.toString() === pedidoId);
        
        if (!encontrado) {
          setError("No se encontró el pedido especificado.");
          return;
        }
        setPedido(encontrado);

        // 2. Traemos los productos para armar un diccionario (ID -> Nombre, Precio)
        const dataProductos = await getProductos({ limit: 1000 });
        const listaProductos = Array.isArray(dataProductos) ? dataProductos : (dataProductos.items || []);
        const mapa = {};
        listaProductos.forEach(p => { mapa[p.id] = p; });
        setProductosMap(mapa);

        // 3. Seleccionamos el primer producto por defecto
        if (encontrado.items && encontrado.items.length > 0) {
          setProductoSeleccionado(encontrado.items[0].producto_id || encontrado.items[0].id);
        }
      } catch (err) {
        setError(err.message || "Error al cargar los datos.");
      }
    };
    cargarDatos();
  }, [pedidoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productoSeleccionado) return;

    const confirmar = window.confirm("¿Estás seguro de que querés arrepentirte de este producto? Se te reembolsará el dinero y se devolverá el stock.");
    if (!confirmar) return;

    setIsLoading(true);
    setError(null);

    try {
      // Aquí llamamos a la API (que ahora sí apunta a /revocacion)
      const respuesta = await solicitarArrepentimiento(pedidoId, productoSeleccionado);
      // El backend devuelve { codigo: "...", pedido_id: ..., creada_en: ... }
      setCodigoReembolso(respuesta.codigo || respuesta.codigo_arrepentimiento || "AR-REEMBOLSADO");
    } catch (err) {
      setError(err.message || "Error al procesar el arrepentimiento.");
    } finally {
      setIsLoading(false);
    }
  };

  // Pantalla de éxito con el código
  if (codigoReembolso) {
    return (
      <main className="pt-24 md:pt-32 px-4 max-w-[700px] mx-auto mb-24">
        <div className="bg-[#F9FBF8] border border-[#E9EBE8] rounded-[2rem] p-8 md:p-12 shadow-sm text-center flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-6xl text-[#2e7d32]">check_circle</span>
          <h1 className="font-display text-3xl font-bold text-[#1b5e20]">¡Arrepentimiento Exitoso!</h1>
          <p className="text-on-surface-variant">
            Tu solicitud fue procesada. El stock fue devuelto y el reembolso está en camino.
          </p>
          <div className="bg-[#e8f5e9] border border-[#a5d6a7] p-4 rounded-xl w-full my-4">
            <p className="text-sm font-bold text-[#2e7d32] mb-1">Tu código de arrepentimiento es:</p>
            <p className="text-3xl font-display font-bold text-[#1b5e20] tracking-wider">{codigoReembolso}</p>
          </div>
          <button onClick={() => navigate('/mis-pedidos')} className="w-full bg-primary text-on-primary font-bold py-3.5 rounded-full hover:bg-primary-container transition-colors mt-2">
            Volver a Mis Pedidos
          </button>
        </div>
      </main>
    );
  }

  if (error && !pedido) return <div className="text-center pt-32 text-error font-bold">{error}</div>;
  if (!pedido) return <div className="text-center pt-32 text-on-surface-variant font-bold">Cargando información del pedido...</div>;

  return (
    <main className="pt-24 md:pt-32 px-4 max-w-[700px] mx-auto mb-24">
      <div className="bg-[#F9FBF8] border border-[#E9EBE8] rounded-[2rem] p-8 md:p-12 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <span className="material-symbols-outlined text-3xl text-secondary-container">assignment_return</span>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-on-surface">Boton de Arrepentimiento</h1>
        </div>

        <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
          Conforme a la legislación vigente, tenés derecho a revocar la compra. Seleccioná el producto del pedido <strong>#{pedido.id}</strong> del cual querés arrepentirte.
        </p>

        {error && (
          <div className="bg-error/10 text-error p-3 rounded-xl text-sm mb-6 text-center font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-bold text-sm text-on-surface">Seleccioná el producto</label>
            <select 
              value={productoSeleccionado}
              onChange={(e) => setProductoSeleccionado(e.target.value)}
              className="w-full h-12 px-4 bg-[#F4F7F2] border-none rounded-[1rem] focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="" disabled>Elegí un producto...</option>
              {pedido.items && pedido.items.map((item, idx) => {
                const prodId = item.producto_id || item.id;
                const productoReal = productosMap[prodId];
                
                // Buscamos el nombre y precio en el diccionario
                const nombreFinal = item.nombre || item.producto?.nombre || (productoReal ? productoReal.nombre : `Producto #${prodId}`);
                const precioFinal = item.precio || item.precio_unitario || (productoReal ? productoReal.precio : '0.00');
                
                return (
                  <option key={idx} value={prodId}>
                    {item.cantidad}x {nombreFinal} - ${precioFinal}
                  </option>
                );
              })}
            </select>
          </div>

          <button 
            type="submit"
            disabled={isLoading || !productoSeleccionado}
            className="w-full bg-[#ba1a1a] text-white font-bold py-3.5 rounded-full hover:bg-[#93000a] transition-colors mt-2 shadow-md disabled:opacity-50"
          >
            {isLoading ? 'Procesando reembolso...' : 'Confirmar Arrepentimiento'}
          </button>
        </form>
      </div>
    </main>
  );
}