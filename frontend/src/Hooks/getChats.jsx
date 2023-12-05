import React, { useEffect, useState } from 'react'
import auth from './auth';
import axios from 'axios';
import { baseUrl } from '../Constants';
import { addChats } from '../Store/Slices/index';
import { useDispatch, useSelector } from 'react-redux';
import store from '../Store';

const getChats = ()=>{
    const { getAuthToken } = auth();
    const dispatch = useDispatch()
    const userId = useSelector(state=>state.users._id)
    const fetchChatsData = async()=>{
        const authToken = getAuthToken();
        try {
            axios.get(`${baseUrl}/chat/`,{
                headers : {
                  Authorization : `Bearer ${authToken}`
                }
              }).then(res=>{dispatch(addChats({userId,chats:res.data}))}).catch(err=>console.log(err))
        } catch (error) {
            console.log(error)
        }
    }

    return {fetchChatsData}
}

export default getChats;