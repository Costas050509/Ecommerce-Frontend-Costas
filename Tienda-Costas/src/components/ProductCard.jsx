import { useCarrito } from '../context/CarritoContext';

export default function ProductCard({ producto }) {
  const { agregar } = useCarrito();

  if (!producto) return null;

  // Formato seguro de precio para evitar que rompa con undefined/null
  const precioFormateado =
    producto.precio != null
      ? Number(producto.precio).toLocaleString('es-AR', {
          minimumFractionDigits: 2,
        })
      : '0.00';

  const stockDisponible = producto.stock ?? 0;

  return (
    <div
      style={{
        border: '1px solid #ccc',
        padding: '15px',
        borderRadius: '8px',
        backgroundColor: '#fff',
      }}
    >
      <h3>{producto.nombre || 'Producto sin nombre'}</h3>
      <p>{producto.descripcion || 'Sin descripción'}</p>
      <p>
        <strong>Precio:</strong> ${precioFormateado}
      </p>
      <p>
        <small>Stock disponible: {stockDisponible}</small>
      </p>

      <button
        onClick={() => agregar(producto, 1)}
        disabled={stockDisponible <= 0}
        style={{
          padding: '8px 12px',
          backgroundColor: stockDisponible > 0 ? '#28a745' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: stockDisponible > 0 ? 'pointer' : 'not-allowed',
          marginTop: '10px',
        }}
      >
        {stockDisponible > 0 ? 'Agregar al Carrito' : 'Sin Stock'}
      </button>
    </div>
  );
}