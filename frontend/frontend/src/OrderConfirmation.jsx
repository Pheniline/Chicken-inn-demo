import "./App.css";

function OrderConfirmation({ order, onContinueShopping }) {
  if (!order) {
    return <p>No order information found.</p>;
  }

  return (
    <main className="confirmation-page">
      <div className="confirmation-card">
        <div className="success-icon">✓</div>

        <p className="section-eyebrow">THANK YOU FOR YOUR ORDER</p>

        <h1>Order Received!</h1>

        <p>
          Thank you, {order.customer.fullName}. Your order has been received
          successfully.
        </p>

        <div className="order-reference">
          <span>Order Reference</span>
          <strong>{order.orderNumber}</strong>
        </div>

        <div className="confirmation-details">
          <h2>Delivery Details</h2>

          <p>{order.customer.fullName}</p>
          <p>{order.customer.phone}</p>
          <p>
            {order.customer.building}, {order.customer.estate},
            {order.customer.town}, {order.customer.county}
          </p>

          <h2>Order Summary</h2>

          {order.items.map((item) => (
            <div className="checkout-item" key={item.id}>
              <span>
                {item.name} × {item.quantity || 1}
              </span>

              <strong>
                KSh{" "}
                {(item.price * (item.quantity || 1)).toLocaleString("en-KE")}
              </strong>
            </div>
          ))}

          <div className="summary-row">
            <span>Subtotal</span>
            <strong>KSh {order.subtotal.toLocaleString("en-KE")}</strong>
          </div>

          <div className="summary-row">
            <span>Delivery Fee</span>
            <strong>KSh {order.deliveryFee.toLocaleString("en-KE")}</strong>
          </div>

          <div className="summary-total">
            <span>Total</span>
            <strong>KSh {order.total.toLocaleString("en-KE")}</strong>
          </div>

          <div className="order-status">
            <span>Order Status</span>
            <strong>{order.status}</strong>
          </div>

          <p className="delivery-note">
            This is a demonstration order. No actual payment or restaurant
            submission has taken place.
          </p>

          <button className="checkout-button" onClick={onContinueShopping}>
            Continue Shopping
          </button>
        </div>
      </div>
    </main>
  );
}

export default OrderConfirmation;
