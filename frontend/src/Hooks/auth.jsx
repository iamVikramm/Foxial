// Auth.js
import { useDispatch } from 'react-redux';
import { addToken } from '../Store/Slices/index';


const getTokenFromCookies = () => {
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find((cookie) => cookie.trim().startsWith('foxialAuthToken='));
  return tokenCookie ? tokenCookie.split('=')[1] : '';
};

const auth = () => {
  const dispatch = useDispatch();

  const getAuthToken = () => {
    const jwtToken = getTokenFromCookies();
    if (jwtToken) {
      dispatch(addToken({ authToken: jwtToken }));
      return jwtToken;
    }
    return null;
  };

  return { getAuthToken };
};

export default auth;
