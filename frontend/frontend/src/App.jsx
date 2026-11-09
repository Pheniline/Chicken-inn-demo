import { useState, useContext } from "react";
import axios from "axios";

import Home from "./Home";
import Menu from "./Menu";
import AuthModal from "./AuthModal";
import Cart from "./Cart";
import Checkout from "./Checkout";
import OrderConfirmation from "./OrderConfirmation";
import Contact from "./Contact";
import Deals from "./Deals";
import About from "./About";

import { AuthContext } from "./Context/AuthContext";

function App() {
  const { customer, token, login, logout } = useContext(AuthContext);

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
    if (!customer || !token) {
      setSelectedItem(item);
      setIsAuthOpen(true);
      return;
    }

    setCart((previousCart) => {
      const existingItem = previousCart.find(
        (cartItem) => cartItem.id === item.id,
      );

      if (existingItem) {
        return previousCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        );
      }

      return [...previousCart, { ...item, quantity: 1 }];
    });
  }

  // Handle successful backend login or registration
  function handleLogin(customerDetails, authToken) {
    login(customerDetails, authToken);

    if (selectedItem) {
      setCart((previousCart) => {
        const existingItem = previousCart.find(
          (item) => item.id === selectedItem.id,
        );

        if (existingItem) {
          return previousCart.map((item) =>
            item.id === selectedItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
        }

        return [...previousCart, { ...selectedItem, quantity: 1 }];
      });

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

  // Save order in MongoDB
  async function handlePlaceOrder(orderDetails) {
    try {
      if (!token) {
        alert("Your session has expired. Please sign in again.");
        setIsAuthOpen(true);
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/orders",
        orderDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Get the actual order returned by MongoDB
      const savedOrder = response.data.order;
      const paymentResponse = await axios.post(
        "http://localhost:5000/api/payments/stk-push",
        {
          orderId: savedOrder._id,
          phone: savedOrder.customer.phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("M-Pesa response:", paymentResponse.data);

      // Format it for our existing confirmation page
      const formattedOrder = {
        ...savedOrder,
        orderNumber: `CI-${savedOrder._id.slice(-8)}`,
        customer: savedOrder.customer,
      };

      setCurrentOrder(formattedOrder);
      setCart([]);
      setCurrentPage("confirmation");
    } catch (error) {
      console.error(
        "Order submission error:",
        error.response?.data || error.message,
      );

      alert(
        error.response?.data?.message ||
          "We could not save your order. Please try again.",
      );
    }
  }

  // Shared account navigation
  function AccountActions() {
    return (
      <>
        {customer && token ? (
          <>
            <span className="customer-name">
              Hi, {customer.fullName || customer.name}
            </span>

            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <button className="login-button" onClick={() => setIsAuthOpen(true)}>
            Sign In
          </button>
        )}
      </>
    );
  }

  // Shared navigation bar
  function Navbar() {
    return (
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

          <a
            href="#deals"
            onClick={(event) => {
              event.preventDefault();
              setCurrentPage("deals");
            }}
          >
            Deals
          </a>

          <a
            href="#about"
            onClick={(event) => {
              event.preventDefault();
              setCurrentPage("about");
            }}
          >
            About Us
          </a>

          <a
            href="#contact"
            onClick={(event) => {
              event.preventDefault();
              setCurrentPage("contact");
            }}
          >
            Contact
          </a>

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
    );
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
          <Navbar />
          <Menu onAddToCart={handleAddCart} />
        </>
      )}

      {/* Deals page */}
      {currentPage === "deals" && (
        <>
          <Navbar />
          <Deals onAddToCart={handleAddCart} />
        </>
      )}

      {/* About Us page */}
      {currentPage === "about" && (
        <>
          <Navbar />
          <About />
        </>
      )}

      {/* Contact page */}
      {currentPage === "contact" && (
        <>
          <Navbar />
          <Contact />
        </>
      )}

      {/* Cart page */}
      {currentPage === "cart" && (
        <>
          <Navbar />

          <Cart
            cart={cart}
            setCart={setCart}
            onCheckout={() => setCurrentPage("checkout")}
            onContinueShopping={() => setCurrentPage("menu")}
          />
        </>
      )}

      {/* Checkout page */}
      {currentPage === "checkout" && (
        <>
          <Navbar />

          <Checkout
            cart={cart}
            onBackToCart={() => setCurrentPage("cart")}
            onPlaceOrder={handlePlaceOrder}
          />
        </>
      )}

      {/* Order confirmation page */}
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
