import "./App.css";

const deals = [
  {
    id: 101,
    name: "Solo Chicken Deal",
    description:
      "Enjoy crispy chicken with golden fries and a refreshing drink.",
    price: 650,
    oldPrice: 800,
    image:
      "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=700&auto=format&fit=crop&q=80",
    tag: "POPULAR",
  },
  {
    id: 102,
    name: "Burger Combo",
    description: "A delicious chicken burger served with fries and a drink.",
    price: 750,
    oldPrice: 900,
    image:
      "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=700&auto=format&fit=crop&q=80",
    tag: "SPECIAL OFFER",
  },
  {
    id: 103,
    name: "Family Feast",
    description: "A generous chicken meal to share with family and friends.",
    price: 1800,
    oldPrice: 2200,
    image:
      "https://images.unsplash.com/photo-1562967914-608f82629710?w=700&auto=format&fit=crop&q=80",
    tag: "FAMILY DEAL",
  },
];

function Deals({ onAddToCart }) {
  return (
    <main className="deals-page">
      <section className="deals-hero">
        <p className="section-eyebrow">GREAT FOOD. GREAT VALUE.</p>

        <h1>Deals You Don't Want to Miss!</h1>

        <p>
          Enjoy delicious meals and exciting offers. There's always something
          tasty waiting for you.
        </p>
      </section>

      <section className="deals-section">
        <div className="deals-heading">
          <div>
            <p className="section-eyebrow">SPECIAL OFFERS</p>
            <h2>Today's Best Deals</h2>
          </div>
        </div>

        <div className="deals-grid">
          {deals.map((deal) => (
            <article className="deal-card" key={deal.id}>
              <div className="deal-image">
                <img src={deal.image} alt={deal.name} />

                <span className="deal-tag">{deal.tag}</span>
              </div>

              <div className="deal-content">
                <h3>{deal.name}</h3>

                <p>{deal.description}</p>

                <div className="deal-price">
                  <strong>KSh {deal.price.toLocaleString("en-KE")}</strong>

                  <span>KSh {deal.oldPrice.toLocaleString("en-KE")}</span>
                </div>

                <button
                  className="deal-button"
                  onClick={() => onAddToCart(deal)}
                >
                  Add to Cart →
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Deals;
