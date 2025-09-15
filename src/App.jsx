import React, { createContext, useContext, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import "./index.css";

const CartContext = createContext();
function useCart() {
  return useContext(CartContext);
}
function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("pn_cart")) || {};
    } catch {
      return {};
    }
  });
  useEffect(() => {
    localStorage.setItem("pn_cart", JSON.stringify(items));
  }, [items]);

  function addToCart(product) {
    setItems((prev) => ({
      ...prev,
      [product.id]: prev[product.id]
        ? { product, qty: prev[product.id].qty + 1 }
        : { product, qty: 1 },
    }));
  }
  function updateQty(id, qty) {
    setItems((prev) => {
      const copy = { ...prev };
      if (!copy[id]) return prev;
      if (qty <= 0) delete copy[id];
      else copy[id].qty = qty;
      return copy;
    });
  }
  function removeItem(id) {
    setItems((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  }
  function clearCart() {
    setItems({});
  }

  const totalItems = Object.values(items).reduce((s, it) => s + it.qty, 0);
  const totalPrice = Object.values(items).reduce(
    (s, it) => s + it.qty * it.product.price,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQty,
        removeItem,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

const plants = [
  {
    id: "p1",
    name: "Fiddle Leaf Fig",
    category: "Tree",
    price: 49.99,
    img: "https://picsum.photos/id/1011/300/200",
  },
  {
    id: "p2",
    name: "Snake Plant",
    category: "Succulents",
    price: 19.99,
    img: "https://picsum.photos/id/102/300/200",
  },
  {
    id: "p3",
    name: "Monstera Deliciosa",
    category: "Tropical",
    price: 39.99,
    img: "https://picsum.photos/id/103/300/200",
  },
  {
    id: "p4",
    name: "Pothos",
    category: "Vines",
    price: 14.99,
    img: "https://picsum.photos/id/104/300/200",
  },
  {
    id: "p5",
    name: "String of Pearls",
    category: "Succulents",
    price: 24.99,
    img: "https://picsum.photos/id/105/300/200",
  },
  {
    id: "p6",
    name: "Peace Lily",
    category: "Flowering",
    price: 22.5,
    img: "https://picsum.photos/id/106/300/200",
  },
];

function Header() {
  const { totalItems } = useCart();
  const loc = useLocation();
  return (
    <header className="site-header">
      <div className="brand">
        <Link to="/">Paradise Nursery</Link>
      </div>
      <nav>
        {loc.pathname !== "/products" && <Link to="/products">Products</Link>}
        {loc.pathname !== "/cart" && <Link to="/cart">Cart</Link>}
      </nav>
      <Link to="/cart" className="cart-link">
        🧺 <span className="cart-count">{totalItems}</span>
      </Link>
    </header>
  );
}

function ProductCard({ product }) {
  const { addToCart } = useCart();
  return (
    <article className="product-card">
      <img src={product.img} alt={product.name} className="thumb" />
      <h3>{product.name}</h3>
      <p className="price">${product.price.toFixed(2)}</p>
      <button onClick={() => addToCart(product)}>Add to Cart</button>
    </article>
  );
}

function CartItem({ item }) {
  const { updateQty, removeItem } = useCart();
  const { product, qty } = item;
  return (
    <div className="cart-item">
      <img src={product.img} alt={product.name} className="thumb" />
      <div className="info">
        <h4>{product.name}</h4>
        <p>Unit: ${product.price.toFixed(2)}</p>
        <p>Subtotal: ${(product.price * qty).toFixed(2)}</p>
        <div className="qty-controls">
          <button onClick={() => updateQty(product.id, qty - 1)}>-</button>
          <span>{qty}</span>
          <button onClick={() => updateQty(product.id, qty + 1)}>+</button>
          <button onClick={() => removeItem(product.id)}>Delete</button>
        </div>
      </div>
    </div>
  );
}

function Landing() {
  return (
    <section className="landing">
      <div className="hero">
        <h1>Paradise Nursery</h1>
        <p>
          Welcome to Paradise Nursery — your friendly local shop for beautiful
          houseplants.
        </p>
        <Link to="/products" className="btn">
          Get Started
        </Link>
      </div>
    </section>
  );
}

function Products() {
  const categories = Array.from(new Set(plants.map((p) => p.category)));
  return (
    <section className="products-page">
      {categories.map((cat) => (
        <div key={cat} className="category">
          <h2>{cat}</h2>
          <div className="grid">
            {plants
              .filter((p) => p.category === cat)
              .map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
          </div>
        </div>
      ))}
    </section>
  );
}

function CartPage() {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const rows = Object.values(items);
  return (
    <section className="cart-page">
      <h2>Your Cart</h2>
      <p>
        Total items: <strong>{totalItems}</strong>
      </p>
      <p>
        Total price: <strong>${totalPrice.toFixed(2)}</strong>
      </p>
      <div className="cart-list">
        {rows.length === 0 && (
          <p>
            Your cart is empty. <Link to="/products">Continue shopping</Link>
          </p>
        )}
        {rows.map((it) => (
          <CartItem key={it.product.id} item={it} />
        ))}
      </div>
      <div className="cart-actions">
        <Link to="/products" className="btn">
          Continue shopping
        </Link>
        <button
          className="btn primary"
          onClick={() => alert("Proceed to checkout")}
        >
          Checkout
        </button>
        <button className="btn" onClick={clearCart}>
          Clear cart
        </button>
      </div>
    </section>
  );
}

function App() {
  return (
    <div className="app-root">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <CartProvider>
      <App />
    </CartProvider>
  </BrowserRouter>
);

export default App;
