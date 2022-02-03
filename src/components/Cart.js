import './Cart.css';
import axios from 'axios';
import {
  useState,
  useRef,
  useMemo,
  useEffect,
} from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { CartTypes } from '../reducers/cartReducer';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    color: '#000',
  },
};

function Cart({ cart, items, dispatch }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [thankYouOpen, setThankYouOpen] = useState(false);
  const [apiError, setApiError] = useState('');
  const zipRef = useRef();
  const navigate = useNavigate();
  useEffect(() => {
    Modal.setAppElement('#root');
  }, []);

  const removeItem = (itemId) => dispatch({ type: CartTypes.REMOVE, itemId });
  const subtractItem = (itemId) => dispatch({ type: CartTypes.SUBTRACT, itemId });
  const handleSubtractClick = (itemId, itemQty) => {
    if (itemQty === 1) {
      removeItem(itemId);
    } else {
      subtractItem(itemId);
    }
  };
  const calcSubTotal = cart.reduce((acc, item) => {
    const details = items.find((i) => i.id === item.id);
    return item.quantity * details.price + acc;
  }, 0);

  const taxRate = useMemo(
    () => {
      const taxPercentage = parseInt(zipCode.substring(0, 1) || '0', 10) + 1;
      return taxPercentage / 100;
    },
    [zipCode],
  );

  const tax = calcSubTotal * taxRate;

  const formValid = zipCode.length === 5 && name.trim();
  const updatePhoneNumber = (newNumber) => {
    const digits = newNumber.replace(/\D/g, '');
    let formatted = digits.substring(0, 3);
    if (digits.length === 3 && newNumber[3] === '-') {
      formatted = `${formatted}-`;
    } else if (digits.length > 3) {
      formatted = `${formatted}-${digits.substring(3, 6)}`;
    }
    if (digits.length === 6 && newNumber[7] === '-') {
      formatted = `${formatted}-`;
    } else if (digits.length > 6) {
      formatted = `${formatted}-${digits.substring(6, 10)}`;
    }
    setPhone(formatted);

    if (digits.length === 10) {
      zipRef.current.focus();
    }
  };

  const submitOrder = (event) => {
    event.preventDefault();
    axios.post('/api/orders', {
      items: cart,
      name,
      phone,
      zipCode,
    }).then(() => {
      dispatch({ type: CartTypes.EMPTY });
      setThankYouOpen(true);
    }).catch((error) => {
      console.error(error);
      setApiError(error?.response?.data?.error || 'Unknown Error');
    });
  };

  const closeThankYouModal = () => {
    setThankYouOpen(false);
    navigate('/');
  };
  const closeApiErrorModal = () => {
    setApiError('');
    zipRef.current.focus();
  };

  return (
    <div className="cart-component">
      <Modal
        isOpen={thankYouOpen}
        onRequestClose={closeThankYouModal}
        style={customStyles}
        contentLabel="Thanks for your order"
      >
        <p>Thanks for your order!</p>
        <button onClick={closeThankYouModal} type="button">
          Return Home
        </button>
      </Modal>
      <Modal
        isOpen={!!apiError}
        onRequestClose={closeApiErrorModal}
        style={customStyles}
        contentLabel="There was an error"
      >
        <p>There was an error submitting your order.</p>
        <p>{ apiError }</p>
        <p>Please try again.</p>
        <button onClick={closeApiErrorModal} type="button">Ok</button>
      </Modal>
      <h2>Your Cart</h2>
      {(cart.length === 0
        ? <div>Your Cart is Empty</div>
        : (
          <>
            <table>
              <thead>
                <tr>
                  <th>Quantity</th>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Total Price</th>
                  <th> + </th>
                  <th> - </th>
                  <th>Remove?</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => {
                  const itemDetail = items.find((i) => i.id === item.id);
                  return (
                    <tr key={item.id}>
                      <td>{item.quantity}</td>
                      <td>{items.find((i) => i.id === item.id).title}</td>
                      <td>{`$${itemDetail.price.toFixed(2)}`}</td>
                      <td>{`$${(item.quantity * itemDetail.price).toFixed(2)}`}</td>
                      <td><button type="button" onClick={() => removeItem(item.id)}>+</button></td>
                      <td><button type="button" onClick={() => handleSubtractClick(item.id, item.quantity)}>-</button></td>
                      <td><button type="button" onClick={() => removeItem(item.id)}>Remove</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div>
              Sub-total: $
              { calcSubTotal.toFixed(2) }
            </div>
            { zipCode.length === 5
              ? (
                <>
                  <div>
                    Tax: $
                    { tax.toFixed(2) }
                  </div>
                  <div>
                    Total: $
                    { (calcSubTotal + tax).toFixed(2) }
                  </div>
                </>
              )
              : <div>Please enter your zip code to see total.</div> }
            <h3>Checkout</h3>
            <form onSubmit={submitOrder}>
              <label htmlFor="name">
                Name:
                {/* eslint-disable jsx-a11y/no-autofocus */}
                <input
                  autoFocus
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </label>
              <label htmlFor="phone">
                Phone Number:
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => updatePhoneNumber(event.target.value)}
                />
              </label>
              <label htmlFor="zipcode">
                Zip Code:
                <input
                  id="zipcode"
                  type="number"
                  maxLength="5"
                  ref={zipRef}
                  required
                  value={zipCode}
                  onChange={(event) => setZipCode(event.target.value)}
                />
              </label>
              <button type="submit" disabled={!formValid}>
                Place Order
              </button>
            </form>
          </>
        ))}
    </div>
  );
}

Cart.propTypes = {
  dispatch: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    imageId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  })).isRequired,
  cart: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
  })).isRequired,
};

export default Cart;
