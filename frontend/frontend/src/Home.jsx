import "./App.css";

function Home({ onNavigate, cartCount }) {
  return (
    <div className="website">
      <header className="navbar">
        <a
          href="#home"
          className="logo"
          onClick={(event) => {
            event.preventDefault();
            onNavigate("home");
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
              onNavigate("home");
            }}
          >
            Home
          </a>

          <a
            href="#menu"
            onClick={(event) => {
              event.preventDefault();
              onNavigate("menu");
            }}
          >
            Our Menu
          </a>

          <a
            href="#deals"
            onClick={(event) => {
              event.preventDefault();
              onNavigate("home");
              setTimeout(() => {
                document.getElementById("deals")?.scrollIntoView({
                  behavior: "smooth",
                });
              }, 0);
            }}
          >
            Deals
          </a>

          <a
            href="#about"
            onClick={(event) => {
              event.preventDefault();
              onNavigate("home");
              setTimeout(() => {
                document.getElementById("about")?.scrollIntoView({
                  behavior: "smooth",
                });
              }, 0);
            }}
          >
            About Us
          </a>

          <a
            href="#cart"
            onClick={(event) => {
              event.preventDefault();
              onNavigate("cart");
            }}
          >
            Cart ({cartCount})
          </a>
        </nav>

        <button className="order-button" onClick={() => onNavigate("menu")}>
          Order Now <span>→</span>
        </button>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <p className="eyebrow">
              <span className="eyebrow-line"></span>
              YOUR FAVOURITE CHICKEN SPOT
            </p>

            <h1>
              BIG FLAVOUR.
              <br />
              <span>BIG CRAVINGS.</span>
            </h1>

            <p className="hero-description">
              Crispy chicken, delicious burgers and meals made to turn an
              ordinary day into something special. Your next favourite meal is
              waiting.
            </p>

            <div className="hero-actions">
              <button
                className="primary-button"
                onClick={() => onNavigate("menu")}
              >
                Explore Our Menu →
              </button>

              <a href="#deals" className="secondary-button">
                View Deals
              </a>
            </div>

            <div className="hero-note">
              <span className="note-dot"></span>
              GOOD FOOD. GREAT MOMENTS.
            </div>
          </div>

          <div className="hero-visual">
            <div className="image-backdrop"></div>

            <img
              className="hero-image"
              src="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=1000&q=85"
              alt="Crispy fried chicken"
            />

            <div className="image-label">
              <span className="label-icon">✦</span>
              <div>
                <strong>Made for cravings</strong>
                <small>Every bite hits different.</small>
              </div>
            </div>

            <div className="floating-tag">
              <span>100%</span>
              <small>CRAVE-WORTHY</small>
            </div>
          </div>
        </section>

        <section className="highlights" id="about">
          <div className="highlight-item">
            <span className="highlight-icon">🍗</span>
            <div>
              <strong>Chicken cravings?</strong>
              <p>We've got you covered.</p>
            </div>
          </div>

          <div className="highlight-item">
            <span className="highlight-icon">🍔</span>
            <div>
              <strong>Your favourites</strong>
              <p>Find your next go-to meal.</p>
            </div>
          </div>

          <div className="highlight-item">
            <span className="highlight-icon">🛍️</span>
            <div>
              <strong>Easy ordering</strong>
              <p>Your meal, your way.</p>
            </div>
          </div>
        </section>

        <section className="menu-intro" id="menu-intro">
          <p className="eyebrow">WHAT ARE YOU CRAVING?</p>
          <h2>
            Good food starts <span>here.</span>
          </h2>
          <p>
            Explore the menu, discover your favourites and find something
            delicious for today.
          </p>

          <button className="primary-button" onClick={() => onNavigate("menu")}>
            Discover What's Next →
          </button>
        </section>

        <section className="deals-anchor" id="deals">
          <p>Something delicious is coming next.</p>
        </section>
      </main>
    </div>
  );
}

export default Home;
