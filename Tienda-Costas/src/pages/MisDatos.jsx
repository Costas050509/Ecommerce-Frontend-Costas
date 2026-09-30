import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMiPerfil, darDeBajaCuenta, exportarMisDatos } from '../services/api';

export default function MisDatos() {
  const [perfil, setPerfil] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getMiPerfil()
      .then((data) => setPerfil(data))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const handleDarDeBaja = async () => {
    // ¡ACÁ ESTÁ LA MAGIA! Ahora te dice qué email se va a borrar.
    const confirmar = window.confirm(
      `¿Estás 100% seguro de que querés dar de baja la cuenta de: ${perfil.email}? Esta acción no se puede deshacer.`
    );
    if (!confirmar) return;

    try {
      await darDeBajaCuenta();
      alert(`La cuenta ${perfil.email} fue dada de baja.`);
      
      // Limpiamos TODO el localStorage para que no queden tokens viejos dando vueltas
      localStorage.clear(); 
      
      navigate('/');
      window.location.reload();
    } catch (err) {
      alert(err.message || 'Error al dar de baja la cuenta.');
    }
  };

  const handleExportarDatos = async () => {
    setIsExporting(true);
    try {
      const dataString = await exportarMisDatos();
      const blob = new Blob([dataString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `mis-datos-freshmix-${perfil?.email || 'usuario'}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message || 'Error al exportar los datos.');
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) return (
    <main className="pt-32 px-4 flex justify-center">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </main>
  );

  if (error) return (
    <main className="pt-32 px-4 max-w-[800px] mx-auto">
      <div className="bg-error/10 text-error p-4 rounded-xl text-center font-semibold">
        {error}
      </div>
    </main>
  );

  if (!perfil) return null;

  return (
    <main className="pt-24 md:pt-32 px-4 max-w-[800px] mx-auto mb-24">
      <div className="flex items-center gap-4 mb-8">
        <span className="material-symbols-outlined text-4xl text-primary">person</span>
        <h1 className="font-display text-3xl font-bold text-on-surface">Mis Datos</h1>
      </div>

      <div className="bg-[#F9FBF8] border border-[#E9EBE8] rounded-[2rem] p-6 md:p-8 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center pb-4 border-b border-surface-variant">
          <span className="font-bold text-on-surface-variant">Nombre completo</span>
          <span className="text-on-surface font-medium text-lg">
            {perfil.nombre || 'Sin nombre'}
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:justify-between md:items-center pb-4 border-b border-surface-variant">
          <span className="font-bold text-on-surface-variant">Email</span>
          <span className="text-on-surface font-medium text-lg">
            {perfil.email}
          </span>
        </div>

        {perfil.rol && (
          <div className="flex flex-col md:flex-row md:justify-between md:items-center pb-4 border-b border-surface-variant">
            <span className="font-bold text-on-surface-variant">Tipo de cuenta</span>
            <span className="text-on-surface font-medium text-lg capitalize">
              {perfil.rol}
            </span>
          </div>
        )}

        {perfil.activo !== undefined && (
          <div className="flex flex-col md:flex-row md:justify-between md:items-center pb-4 border-b border-surface-variant">
            <span className="font-bold text-on-surface-variant">Estado</span>
            <span className={`font-bold text-sm px-3 py-1 rounded-full w-fit ${perfil.activo ? 'bg-[#e8f5e9] text-[#2e7d32]' : 'bg-[#ffdad6] text-[#93000a]'}`}>
              {perfil.activo ? 'Activa' : 'Inactiva'}
            </span>
          </div>
        )}
        
        <div className="mt-4 flex gap-4 flex-wrap">
          <button 
            onClick={() => alert('Función de edición próximamente 😉')}
            className="bg-primary text-on-primary px-6 py-2 rounded-full font-bold hover:bg-primary-container hover:text-on-primary-container transition-colors"
          >
            Editar Perfil
          </button>
          
          <button 
            onClick={handleExportarDatos}
            disabled={isExporting}
            className="bg-secondary-container text-on-secondary-container px-6 py-2 rounded-full font-bold hover:bg-secondary hover:text-white transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            {isExporting ? 'Exportando...' : 'Exportar Mis Datos'}
          </button>

          <button 
            onClick={handleDarDeBaja}
            className="bg-[#ffdad6] text-[#93000a] px-6 py-2 rounded-full font-bold hover:bg-error hover:text-white transition-colors"
          >
            Dar de baja cuenta
          </button>
        </div>
      </div>
    </main>
  );
}