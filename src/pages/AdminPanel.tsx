import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, LogOut } from 'lucide-react';
import { ProductForm, ProductFormData } from '../components/ProductForm';

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  image_url: string;
  createdAt?: string;
}

export function AdminPanel() {
  const API_URL = import.meta.env.VITE_API_URL;

  if (!API_URL) {
    throw new Error('VITE_API_URL no está definida');
  }

  const token = localStorage.getItem('token');

  if (!token) {
    window.location.href = '/';
    return null;
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [searchTerm, setSearchTerm] = useState('');

  // ======================
  // LOAD PRODUCTS
  // ======================
  const loadProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Error cargando productos');

      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
      alert('Error cargando productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [API_URL, token]);

  // ======================
  // ACTIONS
  // ======================
  const handleAddProduct = () => {
    setSelectedProduct(undefined);
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return;

    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Error eliminando producto');

      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (error) {
      console.error(error);
      alert('Error al eliminar el producto');
    }
  };

  const handleSubmitForm = async (formData: ProductFormData) => {
    try {
      const url = selectedProduct
        ? `${API_URL}/products/${selectedProduct._id}`
        : `${API_URL}/products`;

      const method = selectedProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Error guardando producto');

      const data = await res.json();

      setProducts(prev =>
        selectedProduct
          ? prev.map(p => (p._id === data._id ? data : p))
          : [data, ...prev]
      );

      setShowForm(false);
    } catch (error) {
      console.error(error);
      alert('Error al guardar producto');
    }
  };

  // ======================
  // LOGOUT
  // ======================
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  // ======================
  // FILTER
  // ======================
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ======================
  // RENDER
  // ======================
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Panel de Administración</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between gap-4 mb-6">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />

            <button
              onClick={handleAddProduct}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus size={20} />
              Nuevo Producto
            </button>
          </div>

          {loading ? (
            <p className="text-center py-10">Cargando productos...</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Producto</th>
                  <th className="text-left p-2">Categoría</th>
                  <th className="text-left p-2">Precio</th>
                  <th className="text-left p-2">Stock</th>
                  <th className="text-left p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product._id} className="border-b">
                    <td className="p-2 flex items-center gap-2">
                      <img
                        src={product.image_url || '/placeholder.png'}
                        className="w-10 h-10 rounded object-cover"
                      />
                      {product.name}
                    </td>
                    <td className="p-2">{product.category}</td>
                    <td className="p-2 text-green-600">${product.price}</td>
                    <td className="p-2">{product.stock}</td>
                    <td className="p-2 flex gap-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showForm && (
        <ProductForm
          product={selectedProduct}
          onSubmit={handleSubmitForm}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
