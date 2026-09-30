import React, { useState } from 'react';
import { useCarrito } from '../context/CarritoContext';
import { crearPedido } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Carrito() {
  const { items, agregar, restar, quitar, vaciar, total } = useCarrito();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    
    const token = localStorage.getItem('token') || localStorage.getItem('access_token');
    if (!token) {
      alert('Para finalizar la compra, necesitas iniciar sesión.');
      navigate('/login');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await crearPedido(items);
      alert('¡Compra realizada con éxito! 🥤');
      vaciar();
      navigate('/mis-pedidos');
    } catch (err) {
      setError(err.message || 'Error al procesar la compra.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="pt-24 md:pt-32 px-4 max-w-[1280px] mx-auto mb-24 flex flex-col lg:flex-row gap-8">
      
      <div className="flex-1 bg-[#F9FBF8] border border-[#E9EBE8] rounded-[2rem] p-6">
        <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">shopping_cart</span>
          Tu Carrito
        </h2>
        
        {items.length === 0 ? (
          <p className="text-center py-12 text-on-surface-variant font-medium">
            Tu carrito está vacío. ¡Agregá algunos jugos!
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 py-4 border-b border-surface-variant last:border-0">
                <div className="w-20 h-20 bg-white rounded-[1rem] p-2 drop-shadow-sm flex-shrink-0 flex items-center justify-center">
                  {item.imagen_url ? (
                    <img 
                      src={item.imagen_url} 
                      alt={item.nombre} 
                      className="w-full h-full object-contain" 
                    />
                  ) : (
                    <span className="material-symbols-outlined text-3xl text-on-surface-variant/40">local_drink</span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-on-surface">{item.nombre}</h3>
                  <p className="text-primary font-bold">${item.precio}</p>
                </div>
                <div className="flex items-center gap-3 bg-surface-container-low rounded-full px-3 py-1">
                  <button 
                    onClick={() => restar(item.id)}
                    className="text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">remove</span>
                  </button>
                  <span className="font-bold w-4 text-center">{item.cantidad}</span>
                  <button 
                    onClick={() => agregar(item, 1)}
                    className="text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                  </button>
                </div>
                <button 
                  onClick={() => quitar(item.id)}
                  className="ml-2 text-error hover:bg-error/10 p-2 rounded-full transition-colors"
                  title="Eliminar del carrito"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="w-full lg:w-[400px] h-fit bg-surface-container-low rounded-[2rem] p-6 md:p-8">
        <h3 className="font-display text-xl font-bold mb-6">Resumen</h3>
        <div className="flex justify-between mb-4 text-on-surface-variant">
          <span>Subtotal</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-6 text-on-surface-variant">
          <span>Envío</span>
          <span>Gratis</span>
        </div>
        <div className="flex justify-between items-center mb-8 border-t border-[#d1d1cc] pt-4">
          <span className="font-bold text-lg">Total</span>
          <span className="font-display text-2xl font-bold text-primary">${total.toFixed(2)}</span>
        </div>

        {error && (
          <div className="bg-error/10 text-error p-3 rounded-xl text-sm mb-4 text-center font-semibold">
            {error}
          </div>
        )}

        <button 
          onClick={handleCheckout}
          disabled={items.length === 0 || isLoading}
          className="w-full bg-primary text-on-primary font-bold py-4 rounded-full hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
              Procesando...
            </>
          ) : (
            'Finalizar Compra'
          )}
        </button>
      </div>

    </main>
  );
}