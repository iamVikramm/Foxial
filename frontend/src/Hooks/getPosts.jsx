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
    setLoading({ loading: true });
  
    try {
      const response = await fetch(`${baseUrl}/post/getallposts`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
  
      if (response.ok) {
        const posts = await response.json();
        dispatch(addPosts({ posts:posts.posts }));
      } else {
        console.error('Error fetching posts:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading({ loading: false });
    }
  };
  

  const fetchUserPostsData = async (userId) => {
    const authToken = getAuthToken();
  
    try {
      const response = await fetch(`${baseUrl}/post/getuserposts/${userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
  
      if (response.ok) {
        return await response.json();
      } else {
        console.error('Error fetching posts:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      return null;
    }
  };
  
  const fetchSavedPosts = async () => {
    const authToken = getAuthToken();
  
    try {
      const response = await fetch(`${baseUrl}/post/getusersavedposts`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        dispatch(addSavedPosts({ posts: data.savedPosts }));
      } else {
        console.error('Error fetching saved posts:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error fetching saved posts:', error);
      return null;
    }
  };
  

  return { fetchPostsData,fetchUserPostsData, fetchSavedPosts };
}

export default getPosts
