import { useEffect, useState } from "react";

export default function Products() {
  const [products, setProducts] = useState([]);

  async function loadProducts() {
    const res = await fetch("http://localhost:4000/api/products");
    const data = await res.json();
    setProducts(data);
  }

  async function addToCart(productId) {
    await fetch("http://localhost:4000/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, qty: 1 }),
    });
    alert("Added to cart ✅");
  }

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="grid grid-cols-2 gap-4">
        {products.map((p) => (
          <div key={p.id} className="border p-4 rounded">
            <h2 className="font-semibold">{p.name}</h2>
            <p className="text-gray-600">₹{p.price}</p>
            <button
              onClick={() => addToCart(p.id)}
              className="mt-2 bg-black text-white px-3 py-1 rounded"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
