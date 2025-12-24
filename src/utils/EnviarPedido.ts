const API_URL = import.meta.env.VITE_API_URL;
/* =======================
   TIPOS
======================= */
export interface PedidoPayload {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  shipping: {
    method: string;
    price: number;
    estimated: string;
  };
}

/* =======================
   RESPONSE
======================= */
interface PedidoResponse {
  ok: boolean;
  message: string;
}

/* =======================
   ENVIAR PEDIDO
======================= */
export const enviarPedido = async (
  pedido: PedidoPayload
): Promise<PedidoResponse> => {
  try {
    const response = await fetch(`${API_URL}/pedido`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pedido),
    });

    const data: PedidoResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al enviar el pedido');
    }

    return data;
  } catch (error) {
    console.error('Error al enviar pedido:', error);
    throw error;
  }
};
