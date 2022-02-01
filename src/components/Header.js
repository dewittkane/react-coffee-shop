import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header>
      <h1><Link to="/">Coffee Shop</Link></h1>
    </header>
  );
}

export default Header;
