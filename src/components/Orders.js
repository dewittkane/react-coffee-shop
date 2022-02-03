import axios from 'axios';
import { useState, useEffect } from 'react';
import './Orders.css';
import PropTypes from 'prop-types';

function Orders({ items }) {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const ws = new WebSocket(`${(
      window.location.protocol === 'https:' ? 'wss://' : 'ws://'
    )}${window.location.host}/ws-coffee`);
    ws.onopen = () => {
      console.log('connected');
    };
    ws.onerror = (event) => {
      console.error(event);
    };
    ws.onmessage = (message) => {
      const newOrders = JSON.parse(message.data);
      setOrders(newOrders);
    };
    ws.onclose = () => {
      console.log('disconnected');
    };

    return () => {
      ws.close();
    };
  }, []);

  const deleteOrder = ((orderId) => {
    axios.delete(`/api/orders/${orderId}`)
      .catch(console.error);
  });

  return (
    <div className="orders-component">
      {orders.length === 0
        ? (<h2>No Existing Orders</h2>)
        : (
          <>
            <h2>Existing Orders</h2>
            {orders.map((order) => (
              <div className="order" key={order.id}>
                <h3>
                  Order Number
                  {order.id}
                </h3>
                <div>
                  Name:
                  {order.name}
                </div>
                {order.phone && (
                <div>
                  Phone Number:
                  {order.phone}
                </div>
                )}
                <div>
                  Zip Code:
                  {order.zipCode}
                </div>
                <ul>
                  {order.items.map((item) => (
                    <li key={item.id}>
                      Items:
                      {item.quantity}
                      x
                      {items.find((i) => i.id === item.id).title}
                    </li>
                  ))}
                </ul>
                <button type="button" onClick={() => deleteOrder(order.id)}>Delete Order</button>
              </div>
            )) }
          </>
        )}
    </div>
  );
}

Orders.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  })).isRequired,
};

export default Orders;
