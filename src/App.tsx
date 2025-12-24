import { useEffect, useState } from 'react';
import { ShoppingCart, Lock } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { ProductCard } from './components/ProductCard';
import { Cart } from './components/Cart';
import { CheckoutModal } from './components/CheckoutModal';
import { WhatsAppButton } from './components/WhatsAppButton';
import { AdminPanel } from './pages/AdminPanel';
import { AdminLogin } from './pages/AdminLogin';
import { Carousel } from './components/Carousel';
import { ShippingOption } from './types/shipping';
import { Product } from './types/product';
import { CartItem } from './types/cart';

const API_URL = import.meta.env.VITE_API_URL;
const SHOP_WHATSAPP = '543704091739';

function App() {
  const { session, isAdmin, loading: authLoading } = useAuth();

  const [showAdmin, setShowAdmin] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    let result =
      selectedCategory === 'Todos'
        ? products
        : products.filter(p => p.category === selectedCategory);

    if (search.trim() !== '') {
      result = result.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredProducts(result);
  }, [products, selectedCategory, search]);

  const loadProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      console.error('Error cargando productos', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item._id !== productId));
  };


const [selectedShipping, setSelectedShipping] =
  useState<ShippingOption | null>(null);

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };
  
const handleSubmitOrder = () => {
  if (cartItems.length === 0) return;

  if (!selectedShipping) {
    alert('Debes seleccionar un método de envío para continuar');
    return;
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const total = subtotal + selectedShipping.price;

  const orderId = crypto.randomUUID().slice(0, 8);

  const message = `¡Hola! Acabo de realizar un pedido (#${orderId}) por un total de $${total}.
Método de envío: ${selectedShipping.label}. 
Me gustaría coordinar el pago y la entrega. ¡Gracias!`;

  const whatsappUrl = `https://wa.me/${SHOP_WHATSAPP.replace(
    '+',
    ''
  )}?text=${encodeURIComponent(message)}`;

  // 👉 abre WhatsApp (click real)
  window.open(whatsappUrl, '_blank');

  setIsCheckoutOpen(false);
  setCartItems([]);
  setSelectedShipping(null);
};


  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400" />
      </div>
    );
  }

  if (showAdmin) {
    if (!session) return <AdminLogin />;
    if (isAdmin) return <AdminPanel />;

    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-yellow-400">
        <div className="bg-zinc-900 p-6 rounded shadow text-center">
          <Lock size={48} className="mx-auto mb-4 text-red-500" />
          <p>No tenés permisos de administrador</p>
          <button
            onClick={() => setShowAdmin(false)}
            className="mt-4 bg-yellow-500 text-black px-4 py-2 rounded"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  const categories = ['Todos', ...new Set(products.map(p => p.category))];
  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="min-h-screen bg-black text-yellow-400">
      {/* HEADER */}
      <header className="bg-black border-b border-yellow-500 px-4 py-3">
  {/* FILA SUPERIOR */}
  <div className="flex items-center justify-between">
    {/* LOGO */}
    <div className="flex items-center gap-2">
      <img
        src="/logo.png"
        alt="NHN PRO PARTS"
       className="h-11 md:h-12 scale-125 md:scale-150 object-contain"

      />
      
    </div>

    {/* ACCIONES */}
    <div className="flex items-center gap-3">
      {!session && (
        <button
          onClick={() => setShowAdmin(true)}
          className="hidden md:block bg-yellow-500 text-black px-4 py-2 rounded"
        >
          Login admin
        </button>
      )}

      <button
        onClick={() => setIsCartOpen(true)}
        className="relative bg-yellow-500 text-black p-2 rounded-full"
      >
        <ShoppingCart />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
            {cartCount}
          </span>
        )}
      </button>
    </div>
  </div>

  {/* BUSCADOR */}
  <div className="mt-3 md:mt-0 md:flex md:justify-center">
    <input
      type="text"
      placeholder="Buscar producto..."
      value={search}
      onChange={e => setSearch(e.target.value)}
      className="
        w-full
        md:w-1/2
        px-3
        py-2
        rounded
        text-black
        focus:outline-none
      "
    />
  </div>
</header>


      <Carousel images={['/promo1.svg', '/promo2.svg', '/promo3.svg']} />

      {/* CATEGORÍAS */}
      <div className="p-4 flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded border border-yellow-500 ${
              selectedCategory === cat
                ? 'bg-yellow-500 text-black'
                : 'bg-black text-yellow-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* PRODUCTOS */}
      {loading ? (
        <div className="text-center p-10">Cargando...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          {filteredProducts.map(p => (
            <ProductCard
              key={p._id}
              product={p}
              onAddToCart={() =>
                setCartItems(prev => {
                  const found = prev.find(i => i._id === p._id);
                  if (found)
                    return prev.map(i =>
                      i._id === p._id
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                    );
                  return [...prev, { ...p, quantity: 1 }];
                })
              }
            />
          ))}
        </div>
      )}

      <Cart
        items={cartItems}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
           onSelectShipping={setSelectedShipping}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        items={cartItems}
        onClose={() => setIsCheckoutOpen(false)}
       
        shipping={selectedShipping} 
        onSubmitOrder={handleSubmitOrder}
      />

      <WhatsAppButton phoneNumber={SHOP_WHATSAPP} />
    </div>
  );
}

export default App;
