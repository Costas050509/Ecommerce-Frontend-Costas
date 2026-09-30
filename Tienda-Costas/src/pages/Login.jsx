import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await loginUser(username, password);
      // Si el login es exitoso, redirigimos al catálogo
      navigate('/');
      // Recargamos para que el Navbar detecte el token
      window.location.reload(); 
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="pt-32 px-4 min-h-screen flex justify-center items-start">
      <div className="bg-[#F9FBF8] border border-[#E9EBE8] rounded-[2rem] p-8 md:p-12 w-full max-w-md shadow-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-primary mb-2">Bienvenido</h1>
          <p className="text-on-surface-variant">Iniciá sesión para continuar</p>
        </div>
        
        {error && (
          <div className="bg-error/10 text-error p-3 rounded-xl text-sm mb-6 text-center font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-bold text-sm text-on-surface">Usuario</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full h-12 px-4 bg-[#F4F7F2] border-none rounded-[1rem] focus:ring-2 focus:ring-primary outline-none" 
              placeholder="Tu usuario"
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
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-on-primary font-bold py-3 rounded-full hover:bg-primary-container hover:text-on-primary-container transition-colors mt-2 disabled:opacity-50"
          >
            {isLoading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
        
        <p className="text-center text-sm mt-6 text-on-surface-variant">
          ¿No tenés cuenta? <Link to="/register" className="text-primary font-bold hover:underline">Registrate</Link>
        </p>
      </div>
    </main>
  );
}