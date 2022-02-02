import axios from 'axios';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header';
import Home from './components/Home';
import NotFound from './components/NotFound';
import Details from './components/Details';
import Cart from './components/Cart';
import { CartTypes, useCartReducer } from './reducers/cartReducer';

function App() {
  const [cart, dispatch] = useCartReducer();
  const [items, setItems] = useState([]);
  const addToCart = useCallback(
    (itemId) => dispatch({ type: CartTypes.ADD, itemId }),
    [dispatch],
  );
  useEffect(() => {
    axios.get('/api/items')
      .then((result) => setItems(result.data))
      .catch(console.error);
  }, []);
  return (
    <Router>
      <Header cart={cart} />
      <Routes>
        <Route
          path="/details/:id"
          element={<Details addToCart={addToCart} items={items} />}
        />
        <Route path="/cart" element={<Cart cart={cart} items={items} dispatch={dispatch} />} />
        <Route path="/" element={<Home items={items} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
