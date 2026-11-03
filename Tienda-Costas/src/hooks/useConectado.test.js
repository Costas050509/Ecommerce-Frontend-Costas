import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useConectado } from "./useConectado";

describe("useConectado", () => {
  it("arranca conectado y se entera cuando se corta", () => {
    const { result } = renderHook(() => useConectado());
    
    // Al inicio, como jsdom asume que hay internet, debe ser true
    expect(result.current).toBe(true);

    // Simulamos que se corta el internet
    act(() => window.dispatchEvent(new Event("offline")));
    expect(result.current).toBe(false);

    // Simulamos que vuelve el internet
    act(() => window.dispatchEvent(new Event("online")));
    expect(result.current).toBe(true);
  });
});