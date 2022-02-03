import { useContext, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import './Login.css';

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

Modal.setAppElement('#root');

function Login() {
  const { setUserDetails } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const login = (event) => {
    event.preventDefault();
    axios.post('/api/auth/login', {
      username,
      password,
    }).then((res) => {
      console.log('response', res);
      setUserDetails(res.data);
      navigate('/');
    }).catch((error) => {
      console.error(error);
      setApiError(error?.response?.data?.error || 'Unknown Error');
    });
  };

  const closeApiErrorModal = () => {
    setApiError('');
    setPassword('');
  };
  return (
    <div className="login-component">
      <Modal
        isOpen={!!apiError}
        onRequestClose={closeApiErrorModal}
        style={customStyles}
        contentLabel="Login Error"
      >
        <p>There was an error submitting logging in.</p>
        <p>{ apiError }</p>
        <p>Please try again.</p>
        <button onClick={closeApiErrorModal} type="button">Ok</button>
      </Modal>
      <form onSubmit={login}>
        <label htmlFor="username">
          Username:
          <input
            id="username"
            type="text"
            required
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </label>
        <label htmlFor="password">
          Password:
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <button type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
