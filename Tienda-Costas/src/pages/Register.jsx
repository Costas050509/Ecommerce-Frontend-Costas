import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true);

    try {
      await registerUser(email, password);
      alert('¡Cuenta creada con éxito! Ahora podés iniciar sesión.');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Error al crear la cuenta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="pt-28 md:pt-36 px-4 min-h-screen flex justify-center items-start mb-16">
      <div className="bg-[#F9FBF8] border border-[#E9EBE8] rounded-[2rem] p-8 md:p-12 w-full max-w-lg shadow-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-primary mb-2">Crear Cuenta</h1>
          <p className="text-on-surface-variant text-sm">Sumate a FreshMix y empezá a disfrutar de la mejor energía natural.</p>
        </div>

        {error && (
          <div className="bg-error/10 text-error p-3 rounded-xl text-sm mb-6 text-center font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="font-bold text-sm text-on-surface">Email (será tu usuario)</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-12 px-4 bg-[#F4F7F2] border-none rounded-[1rem] focus:ring-2 focus:ring-primary outline-none" 
              placeholder="tu@email.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold text-sm text-on-surface">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-12 px-4 bg-[#F4F7F2] border-none rounded-[1rem] focus:ring-2 focus:ring-primary outline-none" 
              placeholder="••••••••"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold text-sm text-on-surface">Confirmar Contraseña</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full h-12 px-4 bg-[#F4F7F2] border-none rounded-[1rem] focus:ring-2 focus:ring-primary outline-none" 
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-on-primary font-bold py-3.5 rounded-full hover:bg-primary-container hover:text-on-primary-container transition-colors mt-4 shadow-md disabled:opacity-50"
          >
            {isLoading ? 'Creando cuenta...' : 'Registrarme'}
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-on-surface-variant">
          ¿Ya tenés cuenta? <Link to="/login" className="text-primary font-bold hover:underline">Iniciá sesión</Link>
        </p>
      </div>
    </main>
  );
}