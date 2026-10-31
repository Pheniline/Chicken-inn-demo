import { useState, useContext } from "react";
import Home from "./Home";
import Menu from "./Menu";
import AuthModal from "./AuthModal";
import Cart from "./Cart";
import { AuthContext } from "./Context/AuthContext";
import Checkout from "./Checkout";
import OrderConfirmation from "./OrderConfirmation";

function App() {
  const { customer, login, logout } = useContext(AuthContext);

  const [cart, setCart] = useState([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState("home");
  const [currentOrder, setCurrentOrder] = useState(null);

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
    login(customerDetails);

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

  // Handle customer logout
  function handleLogout() {
    logout();
    setCurrentPage("home");
    setCart([]);
  }

  // Account section shared by Menu and Cart navbars
  function AccountActions() {
    return (
      <div className="nav-actions">
        {customer ? (
          <>
            <span className="customer-name">Hi, {customer.name}</span>

            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <button className="login-button" onClick={() => setIsAuthOpen(true)}>
            Sign In
          </button>
        )}
      </div>
    );
  }
  function handlePlaceOrder(orderDetails) {
    const newOrder = {
      ...orderDetails,
      orderNumber: `CI-${Date.now()}`,
      status: "Order Received",
      createdAt: new Date().toLocaleString(),
    };

    setCurrentOrder(newOrder);
    setCart([]);
    setCurrentPage("confirmation");
  }

  return (
    <>
      {/* Homepage */}
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

            <div className="nav-actions">
              <AccountActions />

              <button
                className="order-button"
                onClick={() => setCurrentPage("cart")}
              >
                View Cart →
              </button>
            </div>
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

            <AccountActions />
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
      <Checkout
        cart={cart}
        onBackToCart={() => setCurrentPage("cart")}
        onPlaceOrder={handlePlaceOrder}
      />
      {currentPage === "confirmation" && (
        <OrderConfirmation
          order={currentOrder}
          onContinueShopping={() => setCurrentPage("menu")}
        />
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
