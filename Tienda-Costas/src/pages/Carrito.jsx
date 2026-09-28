import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { crearPedido } from '../services/api'; // Si tu api.js está en src/api.js cambiá a: '../api'

export default function Carrito() {
  const { items, vaciar, eliminar } = useCarrito();
  const [isLoading, setIsLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const navigate = useNavigate();

  const total = items.reduce(
    (acc, item) => acc + (item.precio || 0) * item.cantidad,
    0,
  );

  const handleComprar = async () => {
    if (items.length === 0) return;

    setIsLoading(true);
    setMensaje(null);

    try {
      await crearPedido(items);
      vaciar();
      setMensaje({
        tipo: 'exito',
        texto: '¡Pedido realizado con éxito!',
      });
      setTimeout(() => navigate('/mis-pedidos'), 1500);
    } catch (err) {
      setMensaje({
        tipo: 'error',
        texto: err.message || 'Error al procesar la compra',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Carrito de Compras</h2>

      {mensaje && (
        <p
          style={{
            color: mensaje.tipo === 'exito' ? 'green' : 'red',
            fontWeight: 'bold',
            fontSize: '1.1rem',
          }}
        >
          {mensaje.texto}
        </p>
      )}

      {items.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid #ccc',
                  paddingBottom: '10px',
                }}
              >
                <div>
                  <strong>{item.nombre}</strong> — Cantidad: {item.cantidad}
                  <div>
                    Precio unitario: $
                    {Number(item.precio || 0).toLocaleString('es-AR', {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                </div>
                <button
                  onClick={() => eliminar(item.id)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>

          <h3 style={{ marginTop: '20px' }}>
            Total: $
            {total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
          </h3>

          <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
            <button
              onClick={handleComprar}
              disabled={isLoading}
              style={{
                padding: '10px 20px',
                backgroundColor: isLoading ? '#ccc' : '#28a745',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
              }}
            >
              {isLoading ? 'Procesando...' : 'Finalizar Compra'}
            </button>

            <button
              onClick={vaciar}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Vaciar Carrito
            </button>
          </div>
        </>
      )}
    </main>
  );
}