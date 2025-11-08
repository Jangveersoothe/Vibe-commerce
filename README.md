# Vibe Commerce 🛒

A simple and clean e-commerce demo application where users can browse products, add items to cart, update quantities, remove items, and complete a mock checkout.  
This project is built for learning full-stack fundamentals and demonstrating REST API + React state flow.

---

## 🚀 Tech Stack

| Layer | Technology |
|------|------------|
| Frontend | React (Vite), React Router, Fetch API |
| Backend | Node.js, Express.js |
| Database | SQLite (better-sqlite3) |
| Styling | Default Vite styling + custom CSS |

---

## 📦 Project Structure

🔗 API Endpoints (Backend)
Method	Endpoint	Description
GET	/products	Fetch all products
GET	/cart	Get current cart items
POST	/cart/add	Add item to cart
POST	/cart/update	Update quantity
POST	/checkout	Clear cart & return receipt

This is Vibe Commerce, a minimal e-commerce demo built using React and Express. Users can view products, add them to cart, update quantities, and complete a mock checkout. The backend uses SQLite for storage and provides REST APIs. The goal of this project is to demonstrate clean state handling in React and CRUD functionality with Express.
