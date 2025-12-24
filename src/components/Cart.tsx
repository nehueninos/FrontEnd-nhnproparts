import { X, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ShippingOption } from '../types/shipping';
import { CartItem } from '../types/cart';

interface CartProps {
  items: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
    onCheckout: (shipping: ShippingOption) => void;
   onSelectShipping: (shipping: ShippingOption) => void;
}

/* ======================
   DISTANCIAS DESDE FORMOSA
====================== */
const DISTANCES_KM: Record<string, number> = {
  Formosa: 0,
  Chaco: 200,
  Corrientes: 350,
  Misiones: 600,
  SantaFe: 900,
  EntreRios: 1050,
  BuenosAires: 1200,
  Cordoba: 1100,
  LaPampa: 1500,
};

/* ======================
   HELPERS
====================== */
const getProvinceFromCP = (cp: string): string | null => {
  if (cp.startsWith('36')) return 'Formosa';
  if (cp.startsWith('35')) return 'Chaco';
  if (cp.startsWith('34')) return 'Corrientes';
  if (cp.startsWith('33')) return 'Misiones';
  if (cp.startsWith('31')) return 'SantaFe';
  if (cp.startsWith('30')) return 'EntreRios';
  if (cp.startsWith('10') || cp.startsWith('11') || cp.startsWith('12'))
    return 'BuenosAires';
  if (cp.startsWith('50')) return 'Cordoba';
  if (cp.startsWith('54')) return 'LaPampa';
  return null;
};

const getEstimatedDays = (km: number) => {
  if (km < 400) return '3 días hábiles';
  if (km < 800) return '4 días hábiles';
  if (km < 1200) return '5 días hábiles';
  return '6 días hábiles';
};

export function Cart({
  items,
  isOpen,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onSelectShipping,
}: CartProps) {
  const [postalCode, setPostalCode] = useState('');
  const [selectedShipping, setSelectedShipping] = useState<any>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const calculateShipping = () => {
    const province = getProvinceFromCP(postalCode);
    if (!province) return [];

    const km = DISTANCES_KM[province];
    const base = 3500;
    const perKm = 6;

    const retiroSucursal = Math.round(base + km * perKm);
    const envioDomicilio = Math.round(retiroSucursal * 1.45);

    return [
      {
        id: 'local',
        label: 'Retirar por local',
        description: 'Av. 25 de Mayo 737 – Formosa',
        price: 0,
        days: 'Disponible hoy',
      },
      {
        id: 'correo_sucursal',
        label: 'Correo Argentino - Retiro por sucursal',
        price: retiroSucursal,
        days: getEstimatedDays(km),
      },
      {
        id: 'correo_domicilio',
        label: 'Correo Argentino - Envío a domicilio',
        price: envioDomicilio,
        days: getEstimatedDays(km),
      },
    ];
  };

  const shippingOptions = calculateShipping();
  const total = subtotal + (selectedShipping?.price || 0);

  const handleCheckoutClick = () => {
  if (!postalCode) {
    alert('⚠️ Por favor ingresá tu código postal para calcular el envío');
    return;
  }

  if (!selectedShipping) {
    alert('⚠️ Debes seleccionar un método de envío para continuar');
    return;
  }

  onCheckout(selectedShipping);
};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto p-4">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-black">Mi carrito</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* ITEMS */}
        {items.map(item => (
          <div key={item._id} className="border-b py-4">
            <div className="flex gap-3">
              <img
                src={item.image_url}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-bold text-black">{item.name}</h3>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() =>
                      onUpdateQuantity(item._id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                    className="border px-3"
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      onUpdateQuantity(item._id, item.quantity + 1)
                    }
                    className="border px-3"
                  >
                    +
                  </button>

                  <button
                    onClick={() => onRemoveItem(item._id)}
                    className="ml-auto text-black"
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>

              <p className="font-bold text-black">
                ${(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          </div>
        ))}

        {/* SUBTOTAL */}
        <div className="flex justify-between font-bold my-4 text-black">
          <span>Subtotal (Sin envío)</span>
          <span>${subtotal.toLocaleString()}</span>
        </div>

        {/* MENSAJE */}
        <div className="bg-gray-100 p-3 font-semibold text-sm rounded mb-4 text-black">
          Para tu seguridad queremos aclararte que el envío es 100% seguro.
          Tiene una demora aproximada de 2 a 6 días hábiles y no depende de
          nosotros el tiempo de llegada.
        </div>

        {/* ENVÍO */}
        <h3 className="font-bold mb-2 text-black">Medios de envío</h3>

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="Tu código postal"
            value={postalCode}
            onChange={e => setPostalCode(e.target.value)}
            className="border px-3 py-2 flex-1"
          />
        </div>

        {shippingOptions.map(option => (
          <label
            key={option.id}
            className="border p-3 mb-2 flex gap-3 cursor-pointer"
          >
            <input
  type="radio"
  name="shipping"
  onChange={() => {
    setSelectedShipping(option);
    onSelectShipping(option);
  }}
/>
            <div className="flex-1">
              <p className="font-bold text-black">{option.label}</p>

              {option.description && (
                <p className="text-sm text-gray-700">
                  {option.description}
                </p>
              )}

              <p className="text-sm text-gray-600">
                Entrega estimada: {option.days}
              </p>
            </div>

            <span className="font-bold text-black">
              {option.price === 0
                ? 'Gratis'
                : `$${option.price.toLocaleString()}`}
            </span>
          </label>
        ))}

        {/* TOTAL */}
        <div className="flex justify-between text-xl font-bold my-4 text-black">
          <span>Total</span>
          <span>${total.toLocaleString()}</span>
        </div>

       <button
  onClick={handleCheckoutClick}
  className="w-full bg-black text-white py-3 font-bold"
>
  Realizar compra
</button>


      </div>
    </div>
  );
}
