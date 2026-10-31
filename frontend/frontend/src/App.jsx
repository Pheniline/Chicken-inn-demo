import { useState } from "react";
import Home from "./Home";
import Menu from "./Menu";

function App() {
  const [cart, setCart] = useState([]);

  function handleAddCart(item) {
    setCart((previousCart) => [...previousCart, item]);

    console.log("Cart : ", item);
  }
  return (
    <>
      <Home />
      <Menu onAddToCart={handleAddCart} />;
      {/*That function will check whether
      the customer is signed in. If not, it will open our sign-in/register
      popup; after successful sign-in, it will add the selected item to the
      cart.*/}
    </>
  );
}

export default App;
