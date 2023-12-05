import React,{ useCallback, useEffect, useState } from 'react'
import "./Styles/App.css"
import axios from 'axios';
import store from './Store';
import { useDispatch, useSelector } from 'react-redux'
import {BrowserRouter,Routes, Route, Navigate} from "react-router-dom"
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute.jsx"
import {LandingPage, SignUp, Login,Home,InvalidUrl, CreatePost, 
  UserProfile,
  Messages,
  Search,
  Settings,
  Friends,
  MessagingPage,
  SinglePost,
  EditProfile,
  Saved} from "./Pages/index.jsx"
import {auth,getUser,getPosts,getFriends} from "./Hooks/index.jsx"




function App() {

  const {getAuthToken} = auth()
  const {fetchPostsData} = getPosts();
  const {fetchUserData} = getUser();
  const {fetchFriendsData} = getFriends()

  useEffect(() => {
    const authToken = getAuthToken()
    if(authToken){
      fetchUserData();
      fetchFriendsData()
    }
  }, []);



  return (
    <React.Fragment>
      <BrowserRouter >
        <Routes>
          <Route path="/intro" element={<LandingPage/>} />
          <Route path="/auth/login" element={<Login/>} />
          <Route path="/auth/signup" element={<SignUp />} />
          <Route element={<ProtectedRoute />}>
            <Route exact path="/" element={<Navigate to="/home" />} />
            <Route exact path="/home" element={<Home/>} />
            <Route path="/profile/:userId" element={<UserProfile />} />
            <Route path="/user/userprofile/:userId" element={<UserProfile />} />
            <Route path="/user/createpost" element={<CreatePost />} />
            <Route path="/user/messages" element={<Messages />} />
            <Route path="/messages/mobile/:chatId" element={<MessagingPage />} />
            <Route path="/post/:postId" element={<SinglePost />} />
            <Route path="/search" element={<Search />} />
            <Route path="/user/editprofile" element={<EditProfile />} />
            <Route path="/user/settings" element={<Settings />} />
            <Route path="/user/friends" element={<Friends />} />
            <Route path="/user/saved" element={<Saved />} />
          </Route>
          <Route path="*" element={<InvalidUrl />} />
        </Routes>
      </BrowserRouter>
    </React.Fragment>

  )
}

export default App
