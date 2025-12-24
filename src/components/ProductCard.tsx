import { useState } from 'react';
import { ShoppingCart, X } from 'lucide-react';
import { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [openModal, setOpenModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleAdd = () => {
    onAddToCart(product);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
      setOpenModal(false);
    }, 1800);
  };

  return (
    <>
      {/* CARD */}
      <div
        onClick={() => setOpenModal(true)}
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      >
        <div className="relative h-64 overflow-hidden bg-gray-200">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />

          {product.stock < 5 && product.stock > 0 && (
            <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
              ¡Últimas {product.stock} unidades!
            </span>
          )}

          {product.stock === 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              Agotado
            </span>
          )}
        </div>

        <div className="p-4">
          <span className="text-xs text-blue-600 font-semibold uppercase">
            {product.category}
          </span>

          <h3 className="mt-2 text-lg font-bold text-gray-800">
            {product.name}
          </h3>

          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-2xl font-bold text-green-600">
              ${product.price}
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAdd();
              }}
              disabled={product.stock === 0}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              <ShoppingCart size={18} />
              Agregar
            </button>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div
            className="bg-white rounded-lg max-w-3xl w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold text-black">{product.name}</h2>
              <button onClick={() => setOpenModal(false)}>
                <X />
              </button>
            </div>

            <div className="p-6 grid md:grid-cols-2 gap-6">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-80 object-cover rounded-lg"
              />

              <div className="space-y-4">
                <p className="text-black">{product.description}</p>

                <p className="text-3xl font-bold text-green-600">
                  ${product.price}
                </p>

                <button
                  onClick={handleAdd}
                  disabled={product.stock === 0}
                  className="w-full bg-black text-white py-3 font-bold rounded hover:bg-gray-900 disabled:bg-gray-400"
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ALERTA */}
      {showAlert && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="bg-black text-white px-6 py-4 rounded-lg shadow-lg text-lg font-semibold animate-bounce">
            ✅ Producto agregado al carrito
          </div>
        </div>
      )}
    </>
  );
}
