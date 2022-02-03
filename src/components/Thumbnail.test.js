import { render, screen } from '@testing-library/react';
import { MemoryRouter as Router } from 'react-router-dom';
import Thumbnail from './Thumbnail';
import { itemImages } from '../items';

// Jest looks for actual user interactable elements, not things like ID
describe('Thumbnail', () => {
  it('Displays Thumbnail', () => {
    render(
      <Router>
        <Thumbnail id="apple" title="Apple" image={itemImages.apple} />
      </Router>,
    );
    screen.getByText('Apple');
    screen.getByAltText('Apple');
  });
});
