import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Arrepentimiento from "./Arrepentimiento";
import * as api from "../services/api"; // Importamos todo para mockearlo

// Mockeamos las funciones de la API
vi.mock("../services/api", () => ({
  getMisPedidos: vi.fn(),
  getProductos: vi.fn(),
  solicitarArrepentimiento: vi.fn(),
}));

describe("Arrepentimiento", () => {
  it("muestra el código de reembolso al confirmar", async () => {
    const usuario = userEvent.setup();
    // Simulamos el window.confirm para que devuelva true automáticamente
    vi.spyOn(window, "confirm").mockReturnValue(true);

    // Configuramos qué van a devolver las APIs falsas
    api.getMisPedidos.mockResolvedValue([
      { id: 12, estado: "pendiente", items: [{ producto_id: 1, cantidad: 1, precio_unitario: 500 }] }
    ]);
    api.getProductos.mockResolvedValue([
      { id: 1, nombre: "Jugo Test", precio: 500 }
    ]);
    api.solicitarArrepentimiento.mockResolvedValue({ codigo: "AR-7F3A" });

    // Renderizamos en una ruta específica para que useParams() funcione
    render(
      <MemoryRouter initialEntries={["/arrepentimiento/12"]}>
        <Routes>
          <Route path="/arrepentimiento/:pedidoId" element={<Arrepentimiento />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      // Esperamos a que aparezca el botón único de la página
      expect(screen.getByRole("button", { name: /confirmar arrepentimiento/i })).toBeInTheDocument();
    });

    // Hacemos clic en el botón de confirmar
    const boton = screen.getByRole("button", { name: /confirmar arrepentimiento/i });
    await usuario.click(boton);

    // Verificamos que aparezca el código en pantalla
    await waitFor(() => {
      expect(screen.getByText("AR-7F3A")).toBeInTheDocument();
    });
  });
});