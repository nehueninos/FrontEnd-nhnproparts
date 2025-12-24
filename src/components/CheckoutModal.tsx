import { useState } from 'react';
import { X, CreditCard, Building2, Smartphone, Truck } from 'lucide-react';
import { enviarPedido } from '../utils/EnviarPedido';
import { CartItem } from '../types/cart';
import { ShippingOption } from '../types/shipping';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onSubmitOrder: (form: OrderFormData) => void;
  shipping: ShippingOption | null;
}

export interface OrderFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export function CheckoutModal({
  isOpen,
  onClose,
  items,
  shipping,
  onSubmitOrder,
}: CheckoutModalProps) {
  const [formData, setFormData] = useState<OrderFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  if (!isOpen) return null;

  /* ======================
     VALIDAR ENVÍO
  ====================== */
  if (!shipping) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg max-w-sm text-center text-black">
          <p className="font-bold mb-4 text-black">
            Debes seleccionar un método de envío para continuar
          </p>
          <button
            onClick={onClose}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Volver al carrito
          </button>
        </div>
      </div>
    );
  }

  /* ======================
     TOTALES
  ====================== */
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const total = subtotal + shipping.price;

  /* ======================
     SUBMIT
  ====================== */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmitOrder(formData);

    enviarPedido({
      orderId: crypto.randomUUID(),

      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      customerAddress: formData.address,

      items: items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),

      shipping: {
        method: shipping.label,
        price: shipping.price,
        estimated: shipping.days,
      },

      total,
    }).catch(console.error);

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto text-black">
        {/* HEADER */}
        <div className="border-b p-4 flex justify-between items-center text-black">
          <h2 className="text-2xl font-bold text-black">Finalizar Pedido</h2>
          <button onClick={onClose} className="text-black">
            <X />
          </button>
        </div>

        <div className="p-6 space-y-6 text-black">
          {/* RESUMEN */}
          <div className="bg-gray-100 rounded p-4 space-y-2 text-black">
            {items.map(item => (
              <div key={item._id} className="flex justify-between text-sm text-black">
                <span>
                  {item.name} x{item.quantity}
                </span>
                <span>
                  ${(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}

            <div className="border-t pt-2 flex justify-between text-black">
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString()}</span>
            </div>

            {/* ENVÍO */}
            <div className="flex justify-between items-center text-sm text-black">
              <span className="flex items-center gap-1">
                <Truck size={16} /> Envío
              </span>
              <span>
                {shipping.label} — ${shipping.price.toLocaleString()}
              </span>
            </div>

            <div className="border-t pt-2 flex justify-between font-bold text-lg text-black">
              <span>Total</span>
              <span>${total.toLocaleString()}</span>
            </div>

            <p className="text-xs text-black">
              Entrega estimada: {shipping.days}
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4 text-black">
            <input
              required
              placeholder="Nombre completo"
              value={formData.name}
              onChange={e =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border px-3 py-2 rounded text-black"
            />

            <input
              required
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={e =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full border px-3 py-2 rounded text-black"
            />

            <input
              required
              placeholder="Teléfono"
              value={formData.phone}
              onChange={e =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full border px-3 py-2 rounded text-black"
            />

            <textarea
              required
              placeholder="Dirección completa"
              rows={3}
              value={formData.address}
              onChange={e =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full border px-3 py-2 rounded text-black"
            />

            {/* PAGOS */}
            <div className="bg-gray-50 p-3 rounded text-sm space-y-2 text-black">
              <div className="flex gap-2">
                <CreditCard size={16} /> Transferencia
              </div>
              <div className="flex gap-2">
                <Building2 size={16} /> Depósito
              </div>
              <div className="flex gap-2">
                <Smartphone size={16} /> Efectivo
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 font-bold"
            >
              Confirmar Pedido
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
