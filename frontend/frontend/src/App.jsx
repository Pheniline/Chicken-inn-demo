import Home from "./Home";
import Menu from "./Menu";

function App() {
  return ((<Home />), (<Menu />));
  <Menu onAddToCart={handleAddToCart} />; //That function will check whether the customer is signed in.
  // If not, it will open our sign-in/register popup; after successful sign-in, it will add the selected item to the cart.
}

export default App;
