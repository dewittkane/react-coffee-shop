import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import { useCallback } from 'react';
import './App.css';
import Header from './components/Header';
import Home from './components/Home';
import NotFound from './components/NotFound';
import Details from './components/Details';
import { items } from './items';
import { CartTypes, useCartReducer } from './reducers/cartReducer';

function App() {
  const [cart, dispatch] = useCartReducer();
  const addToCart = useCallback(
    (itemId) => dispatch({ type: CartTypes.ADD, itemId }),
    [dispatch],
  );

  return (
    <Router>
      <Header cart={cart} />
      <Routes>
        <Route
          path="/details/:id"
          element={<Details addToCart={addToCart} items={items} />}
        />
        <Route path="/" element={<Home items={items} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
