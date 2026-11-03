import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Se ejecuta después de cada test para limpiar la "escena"
afterEach(() => {
  cleanup(); // Desmonta los componentes de React
  vi.restoreAllMocks(); // Devuelve las funciones mockeadas a la normalidad
  localStorage.clear(); // Limpia el carrito para que no pase de un test a otro
});