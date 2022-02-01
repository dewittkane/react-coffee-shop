import './Cart.css';
import PropTypes from 'prop-types';
import { CartTypes } from '../reducers/cartReducer';

// eslint-disable-next-line no-unused-vars
function Cart({ cart, items, dispatch }) {
  const removeItem = (itemId) => dispatch({ type: CartTypes.REMOVE, itemId });
  const calcSubTotal = cart.reduce((acc, item) => {
    const details = items.find((i) => i.id === item.id);
    return item.quantity * details.price + acc;
  }, 0);

  return (
    <div className="cart-component">
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
