import React from "react";

export default function Header() {
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
      <Link to="/cart" className="cart-link" aria-label="View cart">
        🧺 <span className="cart-count">{totalItems}</span>
      </Link>
    </header>
  );
}
