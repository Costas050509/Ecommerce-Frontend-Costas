import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Carrito from "./Carrito";
import { CarritoProvider } from "../context/CarritoContext";

// 1. Mockeamos el hook de conexión para que devuelva true (simula internet ok)
vi.mock("../hooks/useConectado", () => ({
  useConectado: () => true,
}));

describe("Carrito", () => {
  beforeEach(() => {
    // 2. Preparamos el localStorage: un token falso y un producto en el carrito
    localStorage.setItem("token", "fake-token-de-prueba");
    localStorage.setItem(
      "carrito",
      JSON.stringify([{ id: 1, nombre: "Jugo Test", precio: 1000, cantidad: 1 }])
    );
  });

  it("manda el pedido una sola vez al hacer doble clic", async () => {
    const usuario = userEvent.setup();
    
    // 3. Simulamos el fetch global (la petición al backend)
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ mensaje: "Pedido creado" }),
      })
    );

    // 4. Renderizamos con el Router y el CarritoProvider
    render(
      <MemoryRouter>
        <CarritoProvider>
          <Carrito />
        </CarritoProvider>
      </MemoryRouter>
    );

    // Buscamos el botón de comprar
    const boton = screen.getByRole("button", { name: /finalizar compra/i });
    
    // 5. Hacemos el doble clic
    await usuario.dblClick(boton);

    // 6. Verificamos que el fetch solo se llamó 1 vez
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });
});