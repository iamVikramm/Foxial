import React, { useEffect, useState } from 'react'
import auth from './auth';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import {  addFriend, addNonfriends, addPendingRequests, setLoading,addSentRequests } from '../Store/Slices/index'
import { baseUrl } from '../Constants';

const getFriends = () => {

  const dispatch = useDispatch();
  const { getAuthToken } = auth();

  const fetchFriendsData = async () => {
    const authToken = getAuthToken();
    setLoading({loading:true})
    try {
      const friendsResponse = await axios.get(`${baseUrl}/friendship/getfriendshipsandpendingrequests`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (friendsResponse.status === 200) {
        dispatch(addFriend(friendsResponse.data[0].friendships));
        dispatch(addPendingRequests(friendsResponse.data[0].pendingrequests))
        dispatch(addSentRequests(friendsResponse.data[0].sentrequests))
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
    }finally{
      setLoading({loading:false})
    }
  };

  const fetchNonFriendsData = async () => {
    const authToken = getAuthToken();

    try {
      const friendsResponse = await axios.get(`${baseUrl}/friendship/getnonfriends`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (friendsResponse.status === 200) {
        dispatch(addNonfriends(friendsResponse.data));
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };


  return { fetchFriendsData,fetchNonFriendsData};
}

export default getFriends
