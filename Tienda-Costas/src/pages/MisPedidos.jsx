import { useEffect, useState } from 'react';
import { getMisPedidos } from '../api';

export default function MisPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMisPedidos()
      .then((data) => {
        setPedidos(data);
        setCargando(false);
      })
      .catch((err) => {
        setError(err.message);
        setCargando(false);
      });
  }, []);

  if (cargando) {
    return (
      <div style={{ padding: '20px' }}>Cargando historial de pedidos...</div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>
    );
  }

  if (pedidos.length === 0) {
    return (
      <div style={{ padding: '20px' }}>No tenés ningún pedido realizado aún.</div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: '0 auto' }}>
      <h2>Mis Pedidos</h2>
      {pedidos.map((pedido) => (
        <div
          key={pedido.id}
          style={{
            border: '1px solid #ccc',
            padding: '15px',
            marginBottom: '15px',
            borderRadius: '8px',
          }}
        >
          <div>
            <strong>Pedido #{pedido.id}</strong>
          </div>
          <div>Estado: {pedido.estado}</div>
          <div>Total: ${Number(pedido.total).toFixed(2)}</div>
          <div style={{ marginTop: '10px' }}>
            <strong>Ítems:</strong>
            <ul>
              {pedido.items.map((item) => (
                <li key={item.producto_id}>
                  Producto ID {item.producto_id} - Cantidad: {item.cantidad}{' '}
                  (Precio unitario: ${item.precio_unitario})
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}