import axios from 'axios';
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import './UserDetails.css';

function UserDetails() {
  const { userDetails, setUserDetails } = useContext(UserContext);
  const navigate = useNavigate();
  const logout = (event) => {
    event.preventDefault();
    axios.post('/api/auth/logout', {})
      .then((res) => {
        console.log('response', res);
        setUserDetails({});
        navigate('/');
      }).catch((error) => {
        console.error(error);
      });
  };
  return (
    <div className="user-details-component">
      { userDetails.username
        ? (
          <div>
            {`Welcome, ${userDetails.username}`}
            <button type="button" onClick={(event) => logout(event)}>Logout</button>
            {userDetails.access === 'associate' && <Link to="/orders">Orders</Link>}
          </div>
        ) : <Link to="/login">Login</Link> }
    </div>
  );
}

export default UserDetails;
