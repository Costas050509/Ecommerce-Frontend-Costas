export default function ProductCard({ producto }) {
  const {
    nombre,
    precio_final,
    cuotas_cantidad,
    cuotas_valor,
    garantia_meses,
  } = producto;

  return (
    <div className="product-card">
      <h3>{nombre}</h3>
      <p className="price">${precio_final.toLocaleString('es-AR')}</p>
      <p className="installments">
        {cuotas_cantidad} cuotas sin interés de ${cuotas_valor.toLocaleString('es-AR')}
      </p>
      <p className="warranty">Garantía: {garantia_meses} meses</p>
    </div>
  );
}