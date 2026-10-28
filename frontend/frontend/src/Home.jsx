import "./App.css";

function Home() {
  return (
    <div className="website">
      <header className="navbar">
        <a href="#home" className="logo">
          CHICKEN <span>INN</span>
          <small>GOOD FOOD. GOOD MOOD.</small>
        </a>
        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#menu">Our Menu</a>
          <a href="#deals">Deals</a>
          <a href="#about">About Us</a>
        </nav>
        <a href="#menu" className="order-button">
          Order Now <span>→</span>
        </a>
      </header>

      <main></main>
    </div>
  );
}
