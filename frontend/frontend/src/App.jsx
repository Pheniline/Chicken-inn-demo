import { useState } from "react";
import Home from "./Home";
import Menu from "./Menu";
import AuthModal from "./AuthModal";
import Cart from "./Cart";

function App() {
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState("home");

  // Calculate total cart quantity
  const cartCount = cart.reduce(
    (total, item) => total + (item.quantity || 1),
    0,
  );

  // Handle adding food to cart
  function handleAddCart(item) {
    if (!customer) {
      setSelectedItem(item);
      setIsAuthOpen(true);
      return;
    }

    setCart((previousCart) => [...previousCart, { ...item, quantity: 1 }]);
  }

  // Handle successful demo sign-in or registration
  function handleLogin(customerDetails) {
    setCustomer(customerDetails);

    if (selectedItem) {
      setCart((previousCart) => [
        ...previousCart,
        { ...selectedItem, quantity: 1 },
      ]);

      setSelectedItem(null);
    }

    setIsAuthOpen(false);
    setCurrentPage("cart");
  }

  return (
    <>
      {/* Homepage and its navigation */}
      {currentPage === "home" && (
        <Home onNavigate={setCurrentPage} cartCount={cartCount} />
      )}

      {/* Menu page */}
      {currentPage === "menu" && (
        <>
          <header className="navbar">
            <a
              href="#home"
              className="logo"
              onClick={(event) => {
                event.preventDefault();
                setCurrentPage("home");
              }}
            >
              CHICKEN <span>INN</span>
              <small>LUV DAT CHICKEN</small>
            </a>

            <nav className="nav-links">
              <a
                href="#home"
                onClick={(event) => {
                  event.preventDefault();
                  setCurrentPage("home");
                }}
              >
                Home
              </a>

              <a href="#menu">Our Menu</a>

              <a
                href="#cart"
                onClick={(event) => {
                  event.preventDefault();
                  setCurrentPage("cart");
                }}
              >
                Cart ({cartCount})
              </a>
            </nav>

            <button
              className="order-button"
              onClick={() => setCurrentPage("cart")}
            >
              View Cart →
            </button>
          </header>

          <Menu onAddToCart={handleAddCart} />
        </>
      )}

      {/* Cart page */}
      {currentPage === "cart" && (
        <>
          <header className="navbar">
            <a
              href="#home"
              className="logo"
              onClick={(event) => {
                event.preventDefault();
                setCurrentPage("home");
              }}
            >
              CHICKEN <span>INN</span>
              <small>LUV DAT CHICKEN</small>
            </a>

            <nav className="nav-links">
              <a
                href="#home"
                onClick={(event) => {
                  event.preventDefault();
                  setCurrentPage("home");
                }}
              >
                Home
              </a>

              <a
                href="#menu"
                onClick={(event) => {
                  event.preventDefault();
                  setCurrentPage("menu");
                }}
              >
                Our Menu
              </a>

              <a href="#cart">Cart ({cartCount})</a>
            </nav>
          </header>

          <Cart
            cart={cart}
            setCart={setCart}
            onCheckout={() => setCurrentPage("checkout")}
            onContinueShopping={() => setCurrentPage("menu")}
          />
        </>
      )}

      {/* Checkout placeholder */}
      {currentPage === "checkout" && (
        <div className="checkout-placeholder">
          <h1>Checkout</h1>
          <p>We'll build your checkout experience next!</p>

          <button onClick={() => setCurrentPage("cart")}>Back to Cart</button>
        </div>
      )}

      {/* Authentication popup */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => {
          setIsAuthOpen(false);
          setSelectedItem(null);
        }}
        onLogin={handleLogin}
      />
    </>
  );
}

export default App;
