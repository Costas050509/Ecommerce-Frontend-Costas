import React from 'react';
import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CarritoProvider, useCarrito } from "./CarritoContext";

// Datos de prueba
const mate = { id: 1, nombre: "Mate", precio: 1000 };
const termo = { id: 2, nombre: "Termo", precio: 2500 };

function usarCarrito() {
  return renderHook(() => useCarrito(), { wrapper: CarritoProvider });
}

describe("CarritoContext", () => {
  it("Agregar dos veces el mismo producto suma cantidad, no filas", () => {
    const { result } = usarCarrito();

    // Agregamos el mate dos veces
    act(() => result.current.agregar(mate));
    act(() => result.current.agregar(mate));

    // Verificamos que solo haya 1 ítem en la lista, pero con cantidad 2
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].cantidad).toBe(2);
  });

  it("Calcula el total", () => {
    const { result } = usarCarrito();

    // Agregamos un mate ($1000) y un termo ($2500)
    act(() => result.current.agregar(mate));
    act(() => result.current.agregar(termo));

    // El total tiene que ser 3500
    expect(result.current.total).toBe(3500);
  });

  it("Sobrevive a una recarga", () => {
    // 1. Primer montaje (el usuario está en la página)
    const { result, unmount } = usarCarrito();

    act(() => result.current.agregar(mate));

    // 2. Desmontamos el componente (simula que el usuario cierra la pestaña)
    unmount();

    // 3. Volvemos a montar el hook desde cero (simula que recarga la página)
    // El contexto debería leer el localStorage automáticamente
    const { result: result2 } = usarCarrito();

    // Verificamos que el mate sigue estando ahí
    expect(result2.current.items).toHaveLength(1);
    expect(result2.current.items[0].nombre).toBe("Mate");
  });
});