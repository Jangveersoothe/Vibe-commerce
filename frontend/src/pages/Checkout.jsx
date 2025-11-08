import { useState, useEffect } from "react";

export default function Checkout() {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [receipt, setReceipt] = useState(null);

  async function loadCart() {
    const res = await fetch("http://localhost:4000/api/cart");
    const data = await res.json();
    setCart(data);
  }

  useEffect(() => {
    loadCart();
  }, []);

  async function handleCheckout(e) {
    e.preventDefault();
    const res = await fetch("http://localhost:4000/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartItems: cart.items, name, email }),
    });
    const data = await res.json();
    setReceipt(data.receipt);
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {cart.items.length === 0 && <p>Your cart is empty.</p>}

      {/* Form */}
      <form onSubmit={handleCheckout} className="space-y-4">
        <input
          className="border p-2 w-full"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          className="border p-2 w-full"
          placeholder="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="text-right font-semibold text-lg">
          Total: ₹{cart.total}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Place Order
        </button>
      </form>

      {/* Receipt Modal */}
      {receipt && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white text-black p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-3">Order Receipt</h2>

            <p><b>Order ID:</b> {receipt.id}</p>
            <p><b>Date:</b> {new Date(receipt.timestamp).toLocaleString()}</p>
            <p className="mt-2 font-semibold">Items:</p>

            <ul className="list-disc ml-6">
              {receipt.items.map((i) => (
                <li key={i.id}>
                  {i.name} x {i.qty} — ₹{i.price * i.qty}
                </li>
              ))}
            </ul>

            <p className="mt-3 text-lg font-bold">Total: ₹{receipt.total}</p>

            <button
              className="mt-4 w-full bg-black text-white p-2 rounded"
              onClick={() => setReceipt(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
