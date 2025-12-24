import { useState } from 'react';
import { X, CheckCircle, AlertTriangle } from 'lucide-react';

/* ======================
   TYPES
====================== */
interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
}

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onClose: () => void;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
}

const CATEGORIES = [
  'Cascos',
  'Guantes',
  'Ropa',
  'Calzado',
  'Seguridad',
  'Accesorios',
];

/* ======================
   MODAL REUSABLE
====================== */
function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-box">
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>

          <h3 className="modal-title">{title}</h3>

          <div>{children}</div>
        </div>
      </div>

      {/* CSS DEL MODAL */}
      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          animation: fadeIn 0.2s ease-out;
        }

        .modal-box {
          background: white;
          border-radius: 12px;
          padding: 24px;
          width: 100%;
          max-width: 420px;
          position: relative;
          animation: scaleIn 0.2s ease-out;
          color: black;
        }

        .modal-title {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 12px;
        }

        .modal-close {
          position: absolute;
          top: 10px;
          right: 10px;
          border-radius: 50%;
          padding: 4px;
        }

        @keyframes fadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}

/* ======================
   PRODUCT FORM
====================== */
export function ProductForm({ product, onSubmit, onClose }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    image_url: product?.image_url || '',
    category: product?.category || 'Accesorios',
    stock: product?.stock || 0,
  });

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(product?.image_url || '');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* FORM */}
      <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center">
        <div className="bg-white max-w-2xl w-full rounded-lg p-6 text-black">
          <h2 className="text-2xl font-bold mb-4">
            {product ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="w-full border px-4 py-2 rounded"
              placeholder="Nombre"
              value={formData.name}
              onChange={e =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <select
              className="w-full border px-4 py-2 rounded"
              value={formData.category}
              onChange={e =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              {CATEGORIES.map(cat => (
                <option key={cat}>{cat}</option>
              ))}
            </select>

            <input
              type="number"
              className="w-full border px-4 py-2 rounded"
              placeholder="Precio"
              value={formData.price}
              onChange={e =>
                setFormData({ ...formData, price: Number(e.target.value) })
              }
            />

            <input
              type="number"
              className="w-full border px-4 py-2 rounded"
              placeholder="Stock"
              value={formData.stock}
              onChange={e =>
                setFormData({ ...formData, stock: Number(e.target.value) })
              }
            />

            <textarea
              className="w-full border px-4 py-2 rounded"
              rows={3}
              placeholder="Descripción"
              value={formData.description}
              onChange={e =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <input
              className="w-full border px-4 py-2 rounded"
              placeholder="URL Imagen"
              value={formData.image_url}
              onChange={e => {
                setFormData({ ...formData, image_url: e.target.value });
                setImagePreview(e.target.value);
              }}
            />

            {imagePreview && (
              <img
                src={imagePreview}
                className="w-full h-48 object-cover rounded"
              />
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border py-2 rounded"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-black text-white py-2 rounded"
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ERROR MODAL */}
      <Modal open={!!error} title="Error" onClose={() => setError(null)}>
        <div className="text-center">
          <AlertTriangle size={40} className="mx-auto mb-3 text-red-500" />
          <p className="mb-4">{error}</p>
          <button
            onClick={() => setError(null)}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Cerrar
          </button>
        </div>
      </Modal>

      {/* SUCCESS MODAL */}
      <Modal open={success} title="Producto guardado" onClose={onClose}>
        <div className="text-center">
          <CheckCircle size={40} className="mx-auto mb-3 text-green-600" />
          <p className="mb-4">El producto se guardó correctamente</p>
          <button
            onClick={onClose}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Aceptar
          </button>
        </div>
      </Modal>
    </>
  );
}
