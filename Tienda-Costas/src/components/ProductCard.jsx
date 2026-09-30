import React from 'react';
import { useCarrito } from '../context/CarritoContext';
import { getImageUrl } from '../services/api';

export default function ProductCard({ producto }) {
  const { agregar } = useCarrito();
  
  // Usamos el helper para obtener la URL real de la imagen
  const imagenUrl = getImageUrl(producto.imagen_url); 
  
  const tieneStock = producto.stock !== undefined;
  const agotado = tieneStock && producto.stock <= 0;

  return (
    <article className="bg-[#F9FBF8] border border-[#E9EBE8] rounded-[1rem] p-4 flex flex-col gap-4 relative group hover:shadow-lg transition-shadow">
      <div className="h-48 w-full -mt-8 mb-4 relative z-10 transition-transform duration-300 group-hover:-translate-y-2 flex items-center justify-center">
        {imagenUrl ? (
          <img 
            src={imagenUrl} 
            alt={producto.nombre} 
            className="w-full h-full object-contain drop-shadow-md" 
          />
        ) : (
          // Placeholder si no hay imagen en el backend
          <div className="w-full h-full bg-surface-container-low rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/40">local_drink</span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 flex-1 z-0">
        <h3 className="font-display text-xl font-bold text-on-surface leading-tight">
          {producto.nombre}
        </h3>
        <p className="font-sans text-sm text-on-surface-variant line-clamp-2">
          {producto.descripcion || "Jugo natural prensado en frío."}
        </p>
      </div>
      <div className="flex items-center justify-between mt-auto z-0">
        <div className="flex flex-col">
          <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-bold text-sm w-fit">
            ${producto.precio}
          </span>
          {tieneStock && (
            <span className={`text-xs mt-1 font-semibold ${agotado ? 'text-error' : 'text-primary'}`}>
              {agotado ? 'Agotado' : `Stock: ${producto.stock}`}
            </span>
          )}
        </div>
        
        <button 
          onClick={() => agregar(producto)}
          disabled={agotado}
          title={agotado ? "Sin stock" : "Agregar al carrito"}
          className="bg-primary text-on-primary h-10 w-10 rounded-full flex items-center justify-center hover:bg-primary-container transition-colors shadow-[0_4px_12px_rgba(45,212,97,0.15)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined icon-fill text-[20px]">add_shopping_cart</span>
        </button>
      </div>
    </article>
  );
}