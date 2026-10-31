import "./App.css";

function Cart({ cart, setCart, onCheckout, onContinueShopping }) {
  // Increase or decrease the quantity of an item
  function updateQuantity(id, change) {
    setCart((previousCart) =>
      previousCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: (item.quantity || 1) + change }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  // Remove an item from the cart
  function removeItem(id) {
    setCart((previousCart) => previousCart.filter((item) => item.id !== id));
  }

  // Calculate the total price
  const subtotal = cart.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0,
  );

  return (
    <main className="cart-page">
      <section className="cart-heading">
        <p className="section-eyebrow">YOUR ORDER</p>
        <h1>
          Your <span>Cart</span>
        </h1>
        <p>Review your delicious selections before checkout.</p>
      </section>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet.</p>

          <button className="cart-continue-button" onClick={onContinueShopping}>
            Explore Menu
          </button>
        </div>
      ) : (
        <section className="cart-layout">
          <div className="cart-items">
            {cart.map((item) => (
              <article className="cart-item" key={item.id}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-image"
                />

                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p className="cart-item-description">{item.description}</p>

                  <p className="cart-item-price">
                    KSh {item.price.toLocaleString("en-KE")}
                  </p>

                  <div className="quantity-controls">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      aria-label={`Decrease ${item.name} quantity`}
                    >
                      −
                    </button>

                    <span>{item.quantity || 1}</span>

                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      aria-label={`Increase ${item.name} quantity`}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  className="remove-item"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
              </article>
            ))}
          </div>

          <aside className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Items</span>
              <span>
                {cart.reduce((total, item) => total + (item.quantity || 1), 0)}
              </span>
            </div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>KSh {subtotal.toLocaleString("en-KE")}</span>
            </div>

            <p className="delivery-note">
              Delivery fee will be calculated at checkout.
            </p>

            <div className="summary-total">
              <span>Total</span>
              <strong>KSh {subtotal.toLocaleString("en-KE")}</strong>
            </div>

            <button className="checkout-button" onClick={onCheckout}>
              Proceed to Checkout
            </button>

            <button className="continue-shopping" onClick={onContinueShopping}>
              Continue Shopping
            </button>
          </aside>
        </section>
      )}
    </main>
  );
}

export default Cart;
