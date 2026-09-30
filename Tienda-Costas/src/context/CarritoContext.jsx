import { createContext, useContext, useEffect, useState } from 'react';

const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const guardado = localStorage.getItem('carrito');
      const parseado = guardado ? JSON.parse(guardado) : [];
      return Array.isArray(parseado) ? parseado : [];
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
      const lista = Array.isArray(prev) ? prev : [];
      const index = lista.findIndex((i) => i.id === producto.id);
      if (index >= 0) {
        const copia = [...lista];
        copia[index] = {
          ...copia[index],
          cantidad: (copia[index].cantidad || 0) + cantidad,
        };
        return copia;
      }
      return [...lista, { ...producto, cantidad }];
    });
  };

  const restar = (producto_id) => {
    setItems((prev) => {
      const lista = Array.isArray(prev) ? prev : [];
      const index = lista.findIndex((i) => i.id === producto_id);
      if (index >= 0) {
        const copia = [...lista];
        if (copia[index].cantidad > 1) {
          copia[index].cantidad -= 1;
          return copia;
        } else {
          return lista.filter((i) => i.id !== producto_id);
        }
      }
      return lista;
    });
  };

  const quitar = (producto_id) => {
    setItems((prev) => (Array.isArray(prev) ? prev.filter((i) => i.id !== producto_id) : []));
  };

  const vaciar = () => {
    setItems([]);
  };

  const total = (Array.isArray(items) ? items : []).reduce(
    (acc, item) => acc + Number(item?.precio || 0) * (item?.cantidad || 1),
    0
  );

  return (
    <CarritoContext.Provider 
      value={{ 
        items: Array.isArray(items) ? items : [], 
        agregar, 
        restar,
        quitar, 
        vaciar, 
        total 
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => {
  return useContext(CarritoContext);
};