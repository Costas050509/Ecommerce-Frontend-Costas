import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';

export default function Navbar() {
  const context = useCarrito();
  const items = context?.items || [];
  const totalItems = items.reduce((acc, item) => acc + (item?.cantidad || 0), 0);
  const navigate = useNavigate();

  const token = localStorage.getItem('token') || localStorage.getItem('access_token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('access_token');
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-[#FAFAD4]/90 backdrop-blur-md border-b border-[#E9EBE8] z-50">
      <nav className="max-w-[1280px] mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        <Link to="/" className="font-display font-bold text-2xl text-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-3xl">local_drink</span>
          FreshMix
        </Link>

        <div className="flex items-center gap-6 font-semibold text-sm text-on-surface">
          <Link to="/" className="hover:text-primary transition-colors">Catálogo</Link>
          
          <Link to="/carrito" className="flex items-center gap-2 bg-primary-container/20 text-primary px-4 py-2 rounded-full hover:bg-primary-container/40 transition-colors">
            <span className="material-symbols-outlined text-lg">shopping_cart</span>
            <span>Carrito</span>
            {totalItems > 0 && (
              <span className="bg-primary text-on-primary text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Link>

          {token ? (
            <>
              <Link to="/mis-pedidos" className="hover:text-primary transition-colors hidden sm:inline">Mis Pedidos</Link>
              <Link to="/mis-datos" className="hover:text-primary transition-colors hidden sm:inline">Mis Datos</Link>
              <button
                onClick={handleLogout}
                className="bg-[#ffdad6] text-[#93000a] font-bold px-4 py-2 rounded-full hover:bg-error hover:text-white transition-colors text-xs"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-primary hover:text-primary-container transition-colors font-bold">
                Ingresar
              </Link>
              <Link to="/register" className="bg-primary text-on-primary font-bold px-5 py-2 rounded-full hover:bg-primary-container transition-colors shadow-sm">
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}