import "./App.css";
import { useMemo, useState } from "react"; // useState remembers the selected category and search text

const menuItem = [
  // Menutem stores our sample food data in one place
  {
    id : 1,
    name : "Crispy Chicken",
    description : "Golden,  crispy and full of flavour",
    price : 450,
    category : "Chicken",
    image : 
    "https: //images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=700&auto=format&fit=crop&q=80",
     {
    id: 2,
    name: 'Chicken Burger',
    description: 'A tasty chicken burger for your cravings.',
    price: 550,
    category: 'Burgers',
    image:
      'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=700&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    name: 'Chicken and Chips',
    description: 'A satisfying meal with crispy chips.',
    price: 650,
    category: 'Meals',
    image:
      'https://images.unsplash.com/photo-1562967914-608f82629710?w=700&auto=format&fit=crop&q=80',
  },
  {
    id: 4,
    name: 'French Fries',
    description: 'Golden fries, perfect for sharing.',
    price: 200,
    category: 'Sides',
    image:
      'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=700&auto=format&fit=crop&q=80',
  },
  {
    id: 5,
    name: 'Family Chicken Meal',
    description: 'A generous chicken meal for the family.',
    price: 1500,
    category: 'Meals',
    image:
      'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=700&auto=format&fit=crop&q=80',
  },
  {
    id: 6,
    name: 'Refreshing Drink',
    description: 'A cool drink to go with your meal.',
    price: 150,
    category: 'Drinks',
    image:
      'https://images.unsplash.com/photo-1513558161293-cdaf765edfd4?w=700&auto=format&fit=crop&q=80',
  },
];

const categories = [
  'All',
  'Chicken',
  'Burgers',
  'Meals',
  'Sides',
  'Drinks',
];

function Menu({ onAddToCart }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Show only items matching the selected category and search.
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory =
        activeCategory === 'All' ||
        item.category === activeCategory;

      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm]);

  // For now, send the selected item to the parent component.
  // Authentication will be connected in our next step.
  function handleAddToCart(item) {
    if (onAddToCart) {
      onAddToCart(item);
    } else {
      console.log('Selected menu item:', item.name);
    }
  }

  return (
    <main className="menu-page" id="menu">
      <section className="menu-heading">
        <p className="section-eyebrow">MADE FOR YOUR CRAVINGS</p>

        <h1>
          Explore Our <span>Menu</span>
        </h1>

        <p className="menu-description">
          Discover your favourites, find your next meal,
          and get ready to order.
        </p>

        <div className="menu-search">
          <span aria-hidden="true">⌕</span>

          <input
            type="search"
            placeholder="Search for chicken, burgers, fries..."
            aria-label="Search menu"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </section>

      <section className="menu-content">
        <div className="category-list" aria-label="Food categories">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={
                activeCategory === category
                  ? 'category-button active'
                  : 'category-button'
              }
              onClick={() => setActiveCategory(category)}
              aria-pressed={activeCategory === category}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="menu-results">
          <div className="menu-results-heading">
            <h2>
              {activeCategory === 'All'
                ? 'Our Favourites'
                : activeCategory}
            </h2>

            <p>
              {filteredItems.length}{' '}
              {filteredItems.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          {filteredItems.length > 0 ? (
            <div className="menu-grid">
              {filteredItems.map((item) => (
                <article className="menu-card" key={item.id}>
                  <div className="menu-card-image">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                    />

                    <span className="menu-category-tag">
                      {item.category}
                    </span>
                  </div>

                  <div className="menu-card-content">
                    <h3>{item.name}</h3>

                    <p className="menu-card-description">
                      {item.description}
                    </p>

                    <div className="menu-card-bottom">
                      <p className="menu-price">
                        KSh {item.price.toLocaleString('en-KE')}
                      </p>

                      <button
                        type="button"
                        className="add-to-cart-button"
                        onClick={() => handleAddToCart(item)}
                        aria-label={`Add ${item.name} to cart`}
                      >
                        <span aria-hidden="true">+</span>
                        Add
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="menu-empty">
              <h3>No meals found</h3>
              <p>Try another search or choose a different category.</p>

              <button
                type="button"
                className="menu-button"
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory('All');
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Menu;
  },
];
