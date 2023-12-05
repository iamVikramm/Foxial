import React, { useEffect, useState } from 'react'
import auth from './auth';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {addPosts, addSavedPosts, addUserPosts} from '../Store/Slices/index'
import { setLoading } from '../Store/Slices/loading';
import { baseUrl } from '../Constants';

const getPosts = () => {
  
  const dispatch = useDispatch();
  const { getAuthToken } = auth();

  const fetchPostsData = async () => {
    const authToken = getAuthToken();
    setLoading({loading:true})
    try {
      const postsResponse = await axios.get(`${baseUrl}/post/getallposts`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (postsResponse.status === 200) {
        dispatch(addPosts({ posts: postsResponse.data.posts }));
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }finally{
      // setLoading({loading:false})
    }
  };

  const fetchUserPostsData = async (userId) => {
    const authToken = getAuthToken();
    try {
      const postsResponse = await axios.get(`${baseUrl}/post/getuserposts/${userId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      return postsResponse
    } catch (error) {
      console.error('Error fetching posts:', error);
      return null
    }
  };

  const fetchSavedPosts = async()=>{
    const authToken = getAuthToken();
    try {
      await axios.get(`${baseUrl}/post/getusersavedposts`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then(res=>{
        dispatch(addSavedPosts({posts:res.data.savedPosts}))
      })
    } catch (error) {
      console.error('Error fetching posts:', error);
      return null
    }
  }

  return { fetchPostsData,fetchUserPostsData, fetchSavedPosts };
}

export default getPosts
