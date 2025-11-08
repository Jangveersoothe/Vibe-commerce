import { useEffect, useState } from "react";

export default function Cart() {
  const [cart, setCart] = useState({ items: [], total: 0 });

  async function loadCart() {
    const res = await fetch("http://localhost:4000/api/cart");
    const data = await res.json();
    setCart(data);
  }

  // Update quantity (+ or -)
  async function updateQty(id, change) {
    // Find item to know productId
    const item = cart.items.find((i) => i.id === id);
    if (!item) return;

    const newQty = item.qty + change;
    if (newQty <= 0) {
      return removeItem(id); // If qty goes to 0 → remove
    }

    await fetch("http://localhost:4000/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: item.productId, qty: change }),
    });

    loadCart();
  }

  async function removeItem(id) {
    await fetch(`http://localhost:4000/api/cart/${id}`, { method: "DELETE" });
    loadCart();
  }

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {cart.items.length === 0 && <p>Your cart is empty.</p>}

      {cart.items.map((item) => (
        <div key={item.id} className="flex justify-between items-center border-b py-3">
          <div>
            <h2 className="font-semibold">{item.name}</h2>
            <p>₹{item.price}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="px-2 border rounded"
              onClick={() => updateQty(item.id, -1)}
            >
              -
            </button>
            <span>{item.qty}</span>
            <button
              className="px-2 border rounded"
              onClick={() => updateQty(item.id, +1)}
            >
              +
            </button>
            <button
              className="text-red-500 ml-4"
              onClick={() => removeItem(item.id)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <div className="mt-4 text-right font-semibold text-xl">
        Total: ₹{cart.total}
      </div>
    </div>
  );
}
