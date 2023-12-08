import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, setLoading } from '../Store/Slices/index';
import axios from 'axios';
import auth from './auth';
import { baseUrl } from '../Constants';

const getUser = () => {
  const dispatch = useDispatch();
  const { getAuthToken } = auth();

  const fetchUserData = async () => {
    const authToken = getAuthToken();
    setLoading({ loading: true });

    try {
      const userResponse = await axios.get(`${baseUrl}/user/details`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (userResponse.status === 200) {
        console.log(userResponse)
        const userData = {
          _id: userResponse.data.user._id,
          username: userResponse.data.user.username,
          email: userResponse.data.user.email,
          avatar: userResponse.data.user.avatar,
          bio:userResponse.data.user.bio,
          isPrivate:userResponse.data.user.isPrivate,
          saved:userResponse.data.user.saved
        };
        sessionStorage.setItem('user',JSON.stringify(userData));
        dispatch(addUser({ users: userData }));
      }
    } catch (error) {
      console.error('Error in fetching user data:', error);
    } finally {
      setLoading({ loading: false });
    }
  };

  const fetchUserById = async (userId) => {
    const authToken = getAuthToken();

    try {
      const response = await axios.get(`${baseUrl}/user/searchbyid/${userId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error in fetching user data by ID:', error);
      return null; // Handle error gracefully, return null or throw an exception based on your use case
    }
  };

  return { fetchUserData, fetchUserById };
};

export default getUser;
