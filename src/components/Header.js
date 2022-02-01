import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import CartIcon from '../images/cart.svg';
import './Header.css';

function Header({ cart }) {
  const cartQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
  return (
    <header>
      <h1><Link to="/">Coffee Shop</Link></h1>
      <a
        className="cart"
        href="#todo"
      >
        <img src={CartIcon} alt="Cart" />
        <div className="badge">{cartQuantity}</div>
      </a>
    </header>
  );
}

Header.propTypes = {
  cart: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
  })).isRequired,
};

export default Header;
