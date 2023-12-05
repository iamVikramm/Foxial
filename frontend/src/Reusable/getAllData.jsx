import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { imgBaseUrl } from '../Constants';

const getAllData = () => {
  const [userDetails, setUserDetails] = useState({});
  const [posts, setPosts] = useState([]);
  const [friendships, setFriendships] = useState([]);
  const [pendingFriendRequest, setPendingFriendRequest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authToken, setAuthToken] = useState('');
  const baseUrl = `${imgBaseUrl}/foxial/api`

  const getTokenFromCookies = () => {
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find((cookie) => cookie.trim().startsWith('foxialAuthToken='));

    return tokenCookie ? tokenCookie.split('=')[1] : '';
  };

  const fetchFriendshipsAndPendingRequests = async (token)=>{
    try {
      const response = await axios.get(`${baseUrl}/friendship/getfriendshipsandpendingrequests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {

        setFriendships(response.data.friendships);
        setPendingFriendRequest(response.data.pendingrequests);

      }
    } catch (error) {
      console.error("Error in getting user details:", error);
    }
  }


  const fetchUserData = async (token) => {
    try {
      const response = await axios.get(`${baseUrl}/user/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setUserDetails(response.data.user);
      }
    } catch (error) {
      console.error("Error in getting user details:", error);
    }
  };

  const fetchPostsData = async (token) => {
    try {
      const apiUrl = `${baseUrl}/post/getallposts`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setPosts(response.data.posts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    const jwtToken = getTokenFromCookies();

    if (jwtToken) {
      setAuthToken(jwtToken);

      // Fetch user data first
      fetchUserData(jwtToken)
        .then(() => {
          // Fetch posts only after user data is fetched
          fetchPostsData(jwtToken)
          fetchFriendshipsAndPendingRequests(jwtToken)
          setLoading(false)
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [authToken]);

  return { userDetails, loading, authToken, posts,friendships,pendingFriendRequest };
};

export default getAllData;
