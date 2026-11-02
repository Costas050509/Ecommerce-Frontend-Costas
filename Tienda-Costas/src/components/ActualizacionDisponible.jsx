import { useRegisterSW } from 'virtual:pwa-register/react';

export default function ActualizacionDisponible() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-[#F9FBF8] text-on-surface p-4 rounded-xl shadow-2xl border border-[#E9EBE8] z-[100] flex flex-col gap-3 max-w-sm">
      <p className="font-bold text-sm">Hay una versión nueva de la tienda.</p>
      <div className="flex gap-2 justify-end">
        <button
          onClick={() => setNeedRefresh(false)}
          className="text-on-surface-variant text-sm font-bold px-3 py-1 hover:bg-surface-variant rounded-full transition-colors"
        >
          Cerrar
        </button>
        <button
          onClick={() => updateServiceWorker(true)}
          className="bg-primary text-white text-sm font-bold px-4 py-1.5 rounded-full hover:bg-primary-container transition-colors"
        >
          Actualizar
        </button>
      </div>
    </div>
  );
}