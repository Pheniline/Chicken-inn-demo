import { useState } from "react";
import "./App.css";

function Checkout({ cart, onBackToCart, onPlaceOrder }) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    county: "",
    town: "",
    estate: "",
    building: "",
    instructions: "",
  });

  const deliveryFee = 200;

  // Calculate order subtotal
  const subtotal = cart.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0,
  );

  // Calculate final total
  const total = subtotal + deliveryFee;

  // Handle input changes
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  // Handle checkout submission
  function handleSubmit(event) {
    event.preventDefault();

    if (!cart.length) {
      alert("Your cart is empty.");
      return;
    }

    const orderDetails = {
      customer: formData,
      items: cart,
      subtotal,
      deliveryFee,
      total,
    };

    onPlaceOrder(orderDetails);
  }

  return (
    <main className="checkout-page">
      <div className="checkout-heading">
        <p className="section-eyebrow">ALMOST THERE!</p>
        <h1>
          Complete Your <span>Order</span>
        </h1>
        <p>Enter your delivery details and get ready to enjoy your meal.</p>
      </div>

      <div className="checkout-layout">
        {/* Delivery information */}
        <section className="checkout-form-section">
          <h2>Delivery Information</h2>

          <form onSubmit={handleSubmit}>
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />

            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="e.g. 0712345678"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <label>County</label>
            <input
              type="text"
              name="county"
              placeholder="e.g. Nakuru"
              value={formData.county}
              onChange={handleChange}
              required
            />

            <label>Town</label>
            <input
              type="text"
              name="town"
              placeholder="e.g. Nakuru Town"
              value={formData.town}
              onChange={handleChange}
              required
            />

            <label>Estate / Neighbourhood</label>
            <input
              type="text"
              name="estate"
              placeholder="Enter your estate or neighbourhood"
              value={formData.estate}
              onChange={handleChange}
              required
            />

            <label>Building / Street / House Number</label>
            <input
              type="text"
              name="building"
              placeholder="Enter your exact delivery location"
              value={formData.building}
              onChange={handleChange}
              required
            />

            <label>Additional Instructions (Optional)</label>
            <textarea
              name="instructions"
              placeholder="Landmarks, gate instructions, etc."
              value={formData.instructions}
              onChange={handleChange}
              rows="3"
            />

            <button type="submit" className="checkout-button">
              Place Order — KSh {total.toLocaleString("en-KE")}
            </button>
          </form>
        </section>

        {/* Order summary */}
        <aside className="checkout-summary">
          <h2>Your Order</h2>

          {cart.map((item) => (
            <div className="checkout-item" key={item.id}>
              <div>
                <h3>{item.name}</h3>
                <p>Quantity: {item.quantity || 1}</p>
              </div>

              <strong>
                KSh{" "}
                {(item.price * (item.quantity || 1)).toLocaleString("en-KE")}
              </strong>
            </div>
          ))}

          <div className="summary-row">
            <span>Subtotal</span>
            <strong>KSh {subtotal.toLocaleString("en-KE")}</strong>
          </div>

          <div className="summary-row">
            <span>Delivery Fee</span>
            <strong>KSh {deliveryFee.toLocaleString("en-KE")}</strong>
          </div>

          <div className="summary-total">
            <span>Total</span>
            <strong>KSh {total.toLocaleString("en-KE")}</strong>
          </div>

          <p className="delivery-note">
            Your delivery fee is an illustrative demo charge. Actual delivery
            fees would depend on the delivery location.
          </p>

          <button
            type="button"
            className="continue-shopping"
            onClick={onBackToCart}
          >
            ← Back to Cart
          </button>
        </aside>
      </div>
    </main>
  );
}

export default Checkout;
