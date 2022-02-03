import { screen, render } from '@testing-library/react';
import { MemoryRouter as Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import Cart from './Cart';
import { items } from '../items';
import server from '../mocks/server';

describe('Cart Errors', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    console.error.mockRestore();
  });
  it('Shows Checkout Failure Error', async () => {
    const testErrorMessage = 'Coffee Shop is Closed';
    server.use(
      rest.post('/api/orders', async (req, res, ctx) => (
        res(ctx.status(500), ctx.json({ error: testErrorMessage }))
      )),
    );
    const cart = [{ id: items[0].id, quantity: 1 }];
    const dispatch = jest.fn(() => {});
    render(
      <div id="root">
        <Router>
          <Cart cart={cart} dispatch={dispatch} items={items} />
        </Router>
      </div>,
    );
    expect(screen.getByRole('button', { name: 'Place Order' })).toBeDisabled();
    userEvent.type(screen.getByLabelText(/Name/), 'Big Nerd Ranch');
    userEvent.type(screen.getByLabelText(/Zip Code/), '30307');
    expect(screen.getByRole('button', { name: 'Place Order' })).toBeEnabled();
    userEvent.click(screen.getByRole('button', { name: 'Place Order' }));
    await screen.findByText(/There was an error/);
    screen.getByText(new RegExp(`${testErrorMessage}`, 'i'));
    userEvent.click(screen.getByRole('button', { name: 'Ok' }));
    expect(screen.queryByText(/There was an error/)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Place Order' })).toBeEnabled();
    expect(dispatch).not.toHaveBeenCalled();
  });
});
