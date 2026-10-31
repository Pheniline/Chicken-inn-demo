import "./App.css";

function About() {
  return (
    <main className="about-page">
      {/* Hero section */}
      <section className="about-hero">
        <p className="section-eyebrow">OUR STORY</p>

        <h1>It's More Than Just Chicken.</h1>

        <p>
          Great food, memorable moments and the joy of sharing delicious meals
          with the people you love.
        </p>
      </section>

      {/* Brand introduction */}
      <section className="about-intro">
        <div className="about-image">
          <img
            src="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=900&auto=format&fit=crop&q=80"
            alt="Crispy fried chicken"
          />
        </div>

        <div className="about-text">
          <p className="section-eyebrow">WHO WE ARE</p>

          <h2>Welcome to Chicken Inn</h2>

          <p>
            Chicken Inn is a familiar name in Kenya's quick-service restaurant
            scene, known for its chicken meals and casual dining experience.
          </p>

          <p>
            Whether you're enjoying a meal on your own, catching up with friends
            or sharing a family meal, there's always a reason to enjoy good
            food.
          </p>

          <p>
            Our goal with this digital experience is to make discovering meals
            and placing orders simple and convenient.
          </p>
        </div>
      </section>

      {/* Values section */}
      <section className="about-values">
        <div className="about-values-heading">
          <p className="section-eyebrow">WHAT MATTERS TO US</p>
          <h2>Our Values</h2>
        </div>

        <div className="values-grid">
          <article className="value-card">
            <span>01</span>
            <h3>Quality</h3>
            <p>Making every meal an enjoyable food experience.</p>
          </article>

          <article className="value-card">
            <span>02</span>
            <h3>Convenience</h3>
            <p>Making it easier for customers to discover meals and order.</p>
          </article>

          <article className="value-card">
            <span>03</span>
            <h3>Togetherness</h3>
            <p>Celebrating the moments that bring people together over food.</p>
          </article>
        </div>
      </section>

      {/* Closing section */}
      <section className="about-closing">
        <h2>Good Food. Great Moments.</h2>

        <p>Your next favourite meal is just a few clicks away.</p>
      </section>
    </main>
  );
}

export default About;
