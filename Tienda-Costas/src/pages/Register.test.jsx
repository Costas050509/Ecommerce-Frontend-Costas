import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom"; // Necesario por useNavigate
import Register from "./Register";


describe("Register", () => {
  it("no deja crear la cuenta sin el consentimiento", async () => {
    const usuario = userEvent.setup();
    
    // Envolvemos en MemoryRouter por el useNavigate
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const boton = screen.getByRole("button", { name: /registrarme/i });
    const casilla = screen.getByRole("checkbox", { name: /tratamiento de mis datos/i });

    // Verificamos que arranca desmarcado y deshabilitado
    expect(casilla).not.toBeChecked();
    expect(boton).toBeDisabled();

    // Hacemos clic en la casilla
    await usuario.click(casilla);
    
    // Ahora el botón debería estar habilitado
    expect(boton).toBeEnabled();
  });
});