import { createContext, useContext, useEffect, useState } from 'react';

const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const guardado = localStorage.getItem('carrito');
      return guardado ? JSON.parse(guardado) : [];
    } catch (e) {
      console.error('Error al leer localStorage:', e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(items));
  }, [items]);

  const agregar = (producto, cantidad = 1) => {
    setItems((prev) => {
      const index = prev.findIndex((i) => i.id === producto.id);
      if (index >= 0) {
        const copia = [...prev];
        copia[index] = {
          ...copia[index],
          cantidad: copia[index].cantidad + cantidad,
        };
        return copia;
      }
      return [...prev, { ...producto, cantidad }];
    });
  };

  const quitar = (producto_id) => {
    setItems((prev) => prev.filter((i) => i.id !== producto_id));
  };

  const vaciar = () => {
    setItems([]);
  };

  const total = items.reduce(
    (acc, item) => acc + Number(item.precio || 0) * item.cantidad,
    0,
  );

  return (
    <CarritoContext.Provider value={{ items, agregar, quitar, vaciar, total }}>
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => useContext(CarritoContext);