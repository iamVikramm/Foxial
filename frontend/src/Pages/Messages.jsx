import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { baseUrl, imgBaseUrl } from '../Constants'
import axios from 'axios'
import store from '../Store'
import { getChats, getUser } from '../Hooks'
import { MessageLeftSide } from "../Components/index"
import io from "socket.io-client"
import { addSingleMessage } from '../Store/Slices'

const Messages = () => {
  const user = useSelector(state=>state.users)
  const [messageValue,setMessageValue] = useState("")
  const [messagingUser,setMessagingUser] = useState({})
  const [messages,setMessages] = useState([])
  const {fetchChatsData} = getChats()
  const {fetchUserData} = getUser()
  const ENDPOINT = 'https://foxial.onrender.com'; // Replace with your actual endpoint
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const messageContainerRef = useRef(null);
  const dispatch = useDispatch()
  useEffect(() => {
    // Scroll to the bottom when messages are updated
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);


  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'));

    // Initialize the socket
    const newSocket = io.connect(ENDPOINT);
    setSocket(newSocket);

    // Set up the event listener when the component mounts
    newSocket.emit('setup', user);
    newSocket.on('connected', () => setSocketConnected(true));

    return () => {
      // Remove the event listener and disconnect the socket when the component unmounts
      newSocket.off('message received');
      newSocket.disconnect();
    };
  }, [ENDPOINT]);

  useEffect(()=>{
    fetchUserData()
    fetchChatsData()
  },[])
  
  useEffect(() => {
    // Set up the event listener when the component mounts
    if (socket) {
      socket.on('message received', (receivedMessage) => {
        console.log(receivedMessage);
        if (messagingUser.chatId !== receivedMessage.chat._id) {
          // Do nothing if the received message is not for the current chat
        } else {
          console.log('Else statement:', receivedMessage);
          setMessages((prev) => [...prev, receivedMessage]);
        }
      });
    }

    return () => {
      // Remove the event listener when the component unmounts
      if (socket) {
        socket.off('message received');
      }
    };
  }, [socket, messagingUser.chatId]);
  
  
  const sendMessage = async(e)=>{
    e.preventDefault()
    try {
      const response = await axios({
        method: 'POST',
        url: `${baseUrl}/message`,
        data: {
          chatId: messagingUser.chatId,
          content : messageValue      
        },
        headers: {
          Authorization: `Bearer ${store.getState().authToken.authToken}`,
        },
      });
      socket.emit('new message',response.data)
      setMessages(prev => [...prev,response.data])
      dispatch(addSingleMessage({chatId:messagingUser.chatId,message:response.data,user:messagingUser.user[0]}))
      setMessageValue("")
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <React.Fragment>
      <section className='w-full'>
        <section className='w-full h-[100vh] flex flex-1'>
          <section className='w-full lg:w-[30%] border-r border-1 border-solid border-slate-100'>
            <MessageLeftSide setMessages={setMessages} messagingUser={messagingUser} setMessagingUser={setMessagingUser} socket={socket} />
          </section>
          {
  messagingUser && messagingUser.user ? (
    <section className='hidden lg:block lg:w-[70%] border-l border-solid  border-gray-300'>
      <section className='h-[8%] w-full bg-[#FF6666] flex flex-1 items-center'>
        <div className='pl-4 flex flex-1 items-center gap-2 w-[30%]'>
          <img className='h-12 w-12  rounded-full object-cover' src={`${imgBaseUrl}${messagingUser.user[0].avatar}`} />
          <p className='font-bold text-white'>{messagingUser.user[0].username}</p>
        </div>
      </section>
      <section ref={messageContainerRef} className='h-[84%] w-full p-2 overflow-y-scroll '>
        {
          messages.map(eachMessage=>{
            return(
              <div  key={eachMessage._id} className={`flex flex-1 items-center  m-1 w-full rounded-full ${eachMessage.sender._id === user._id ? "justify-end" : "justify-start" }`}>
                <div className={`${eachMessage.sender._id === user._id ? "bg-[#FF6666] text-white" : "bg-slate-300"} rounded-full pr-2 pl-2 max-w-[60%] break-words`}>
                  <p className='p-2'>{eachMessage.content}</p>
                </div>
              </div>
            )
          })
        }
      </section>
      <section className='h-[8%] w-full p-3 pl-6 pr-6 fixed flex flex-1 items-center bottom-0 bg-white border-t border-solid border-gray-300'>
        <form onSubmit={sendMessage} className='w-full'>
          <div className='w-[55%] ml-[80px] p-2 rounded-md flex items-center'>
              <input className='w-full bg-slate-200 p-2 outline-none rounded-md' onChange={(e)=>setMessageValue(e.target.value)} type='text' value={messageValue} placeholder='Type a message here...' />
              <div className='h-8  flex justify-center items-center ml-3'>
                <label className='h-full flex justify-center items-center bg-[#FF6666] p-2 rounded-md' htmlFor='submitbutton'><FontAwesomeIcon className='text-white' icon={faPaperPlane} /></label>
              </div>
              <input className='hidden' type='submit' id='submitbutton' />
          </div>
        </form>
      </section>
    </section>
  ) : (
    <section className='hidden lg:block lg:w-[70%]'>
      <div className='h-[8%] bg-[#FF6666] flex justify-center items-center'>
         <p className='text-[30px] font-bold text-white'>Foxial</p>
      </div>
      <div className='h-[84%] w-full flex flex-1 justify-center items-center'>
        <p className='text-[20px] font-semibold text-[#FF6666]'>Enjoy Real time messaging using foxial Messages</p>
      </div>
    </section>
  )
}
        </section>
      </section>
    </React.Fragment>
  )
}

export default Messages
