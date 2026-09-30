import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-surface-container-low border-t border-surface-variant py-8 px-6 mt-auto">
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <div>
          <h2 className="font-display font-bold text-lg text-primary">FreshMix</h2>
          <p className="text-xs text-on-surface-variant">Energía pura y natural en cada sorbo.</p>
        </div>

        <div className="flex gap-6 text-sm font-medium text-on-surface-variant">
          <Link to="/" className="hover:text-primary transition-colors">Catálogo</Link>
          <Link to="/arrepentimiento" className="hover:text-primary transition-colors">Arrepentimiento</Link>
          <Link to="/mis-datos" className="hover:text-primary transition-colors">Mis Datos</Link>
        </div>

        <p className="text-xs text-on-surface-variant opacity-70">
          © {new Date().getFullYear()} FreshMix. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}