import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';

export default function Navbar() {
  const { items } = useCarrito();
  const totalItems = items.reduce((acc, item) => acc + item.cantidad, 0);
  const token =
    localStorage.getItem('token') || localStorage.getItem('access_token');

  return (
    <nav
      style={{
        display: 'flex',
        gap: '20px',
        padding: '15px 20px',
        backgroundColor: '#222',
        color: '#fff',
        alignItems: 'center',
      }}
    >
      <Link
        to="/"
        style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}
      >
        Catálogo
      </Link>
      <Link to="/carrito" style={{ color: '#fff', textDecoration: 'none' }}>
        Carrito 🛒 ({totalItems})
      </Link>
      {token && (
        <Link
          to="/mis-pedidos"
          style={{ color: '#fff', textDecoration: 'none' }}
        >
          Mis Pedidos
        </Link>
      )}
    </nav>
  );
}