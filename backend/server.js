const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Database = require("better-sqlite3");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Create / open SQLite DB file
const db = new Database("./data.db");

// Create tables if not exist
db.exec(`
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS cart (
  id TEXT PRIMARY KEY,
  productId TEXT NOT NULL,
  qty INTEGER NOT NULL
);
`);

// Seed sample products only if DB is empty
const productCount = db.prepare(`SELECT COUNT(*) as c FROM products`).get().c;
if (productCount === 0) {
  const stmt = db.prepare(
    `INSERT INTO products (id, name, price) VALUES (?, ?, ?)`
  );
  const sampleProducts = [
    ["p1", "Vibe Jacket", 49.99],
    ["p2", "Pulse Sneakers", 79.99],
    ["p3", "Nebula Sunglasses", 19.99],
    ["p4", "Flux Hoodie", 39.99],
    ["p5", "Orbit Phone Case", 12.99],
  ];
  for (const p of sampleProducts) stmt.run(...p);
}

// Helper to get cart with total
function getCart() {
  const cartItems = db
    .prepare(
      `
    SELECT c.id, c.productId, p.name, p.price, c.qty
    FROM cart c JOIN products p ON c.productId = p.id
  `
    )
    .all();

  let total = 0;
  cartItems.forEach((item) => (total += item.price * item.qty));

  return { items: cartItems, total: Number(total.toFixed(2)) };
}

// Routes
app.get("/api/products", (req, res) => {
  const products = db.prepare(`SELECT * FROM products`).all();
  res.json(products);
});

app.get("/api/cart", (req, res) => {
  res.json(getCart());
});

app.post("/api/cart", (req, res) => {
  const { productId, qty } = req.body;
  if (!productId || qty <= 0)
    return res.status(400).json({ error: "Invalid input" });

  const exists = db
    .prepare(`SELECT * FROM cart WHERE productId=?`)
    .get(productId);
  if (exists) {
    db.prepare(`UPDATE cart SET qty = qty + ? WHERE productId = ?`).run(
      qty,
      productId
    );
  } else {
    db.prepare(`INSERT INTO cart (id, productId, qty) VALUES (?, ?, ?)`).run(
      uuidv4(),
      productId,
      qty
    );
  }
  res.json(getCart());
});

app.delete("/api/cart/:id", (req, res) => {
  db.prepare(`DELETE FROM cart WHERE id = ?`).run(req.params.id);
  res.json(getCart());
});
// Update quantity (+1 / -1)
app.post("/api/cart/update", (req, res) => {
  const { productId, qty } = req.body;
  if (!productId || qty === 0)
    return res.status(400).json({ error: "Invalid input" });

  // Check item exists
  const item = db
    .prepare(`SELECT * FROM cart WHERE productId = ?`)
    .get(productId);

  if (!item) return res.status(400).json({ error: "Item not in cart" });

  // Update qty

  db.prepare(`UPDATE cart SET qty = qty + ? WHERE productId = ?`).run(
    qty,
    productId
  );

  // Remove if qty <= 0
  const updated = db
    .prepare(`SELECT qty FROM cart WHERE productId = ?`)
    .get(productId);

  if (updated.qty <= 0) {
    db.prepare(`DELETE FROM cart WHERE productId = ?`).run(productId);
  }

  res.json(getCart());
});

app.post("/api/checkout", (req, res) => {
  const cart = getCart();
  const receipt = {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    total: cart.total,
    items: cart.items,
  };

  db.prepare(`DELETE FROM cart`).run(); // Clear the cart
  res.json({ receipt });
});

app.listen(4000, () =>
  console.log("✅ Backend running on http://localhost:4000")
);
