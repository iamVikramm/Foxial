import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { baseUrl, imgBaseUrl } from '../Constants';
import io from "socket.io-client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { getChats } from '../Hooks';
import { addMessages, addSingleMessage } from '../Store/Slices';
import store from '../Store';

const ENDPOINT = 'https://foxial.onrender.com';

const MessagingPage = () => {
  const { chatId } = useParams();
  const authToken = store.getState().authToken.authToken;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true); 
  const dispatch = useDispatch();
  const user = JSON.parse(sessionStorage.getItem('user'));
  const [socket, setSocket] = useState(null);
  const [chat, setChat] = useState({});
  const [messageValue, setMessageValue] = useState("");
  const messageContainerRef = useRef(null);
  const { fetchChatsData } = getChats();
  const chats = useSelector(state => state.chats);

  const fetchMessages = async () => {
    try {
      const authToken = store.getState().authToken.authToken;
      const res = await axios({
        method: "GET",
        url: `${baseUrl}/message/${chatId}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      dispatch(addMessages({ chatId: chatId, messages: res.data }));
      setMessages(res.data);
      socket.emit("join chat", chatId);
    } catch (error) {
      console.log(error);
    }
  };

  const initializeSocket = () => {
    const newSocket = io.connect(ENDPOINT);
    setSocket(newSocket);

    newSocket.emit('setup', user);

    newSocket.on('connected', () => {
      console.log('Socket connected');
    });

    newSocket.on('error', (error) => {
      console.error('Socket connection error:', error);
    });

    return () => {
      newSocket.disconnect();
    };
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      const response = await axios({
        method: 'POST',
        url: `${baseUrl}/message`,
        data: {
          chatId: chatId,
          content: messageValue,
        },
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      socket.emit('new message', response.data);
      setMessages(prev => [...prev, response.data]);
      dispatch(addSingleMessage({ chatId, message: response.data, user: chat.user[0] }));
      setMessageValue("");
    } catch (error) {
      console.log(error);
    }
  };

  
  useEffect(()=>{
    setChat(chats.find(c=>c.chatId === chatId))
  },[chats])

  useEffect(() => {
    // Set up the event listener when the component mounts
    if (socket) {
      socket.on('message received', (receivedMessage) => {
        console.log(receivedMessage);
        if (chat.chatId !== receivedMessage.chat._id) {
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
  }, [socket, chat.chatId]);


    useEffect(() => {
    const fetchDataAndInitializeSocket = async () => {
      try {
        if(!socket){
            initializeSocket();
        }
        if(socket){
            await fetchChatsData();
            await fetchMessages();
            setLoading(false);
        } // Set loading to false when everything is done
      } catch (error) {
        console.error('Error during initialization:', error);
        setLoading(false); // Set loading to false in case of an error
      }
    };

    fetchDataAndInitializeSocket();
  }, [socket]);

  if (loading) {
    return <div>Loading...</div>; // Render a loading state while waiting for data
  }
    return (
            <section className='w-full border-l border-solid  border-gray-300'>
            <section className='h-[8%] w-full bg-[#FF6666] flex flex-1 items-center'>
              <div className='pl-4 flex flex-1 p-1 items-center gap-2 w-[30%]'>
                <img className='h-10 w-10  rounded-full object-cover' src={`${imgBaseUrl}${chat?.user[0]?.avatar}`} alt={`Avatar of ${chat?.user[0]?.username}`} />
                <p className='font-bold text-white'>{chat?.user[0]?.username}</p>
              </div>
            </section>
            <section ref={messageContainerRef} className='h-[84%] w-full p-2 overflow-y-scroll '>
              {messages.map(eachMessage => (
                <div key={eachMessage._id} className={`flex flex-1 items-center  m-1 w-full rounded-full ${eachMessage.sender._id === user._id ? "justify-end" : "justify-start"}`}>
                  <div className={`${eachMessage.sender._id === user._id ? "bg-[#FF6666] text-white" : "bg-slate-300"} rounded-full pr-2 pl-2 max-w-[60%] break-words`}>
                    <p className='p-2'>{eachMessage.content}</p>
                  </div>
                </div>
              ))}
            </section>
            <section className='h-[8%] w-full p-3  pr-6 fixed flex flex-1 items-center bottom-0 bg-white border-t border-solid border-gray-300'>
              <form onSubmit={sendMessage} className='w-full flex flex-1 justify-center items-center '>
                <div className='w-[80%]  rounded-md flex items-center'>
                  <input className='w-full bg-slate-200 p-2 outline-none rounded-md' onChange={(e) => setMessageValue(e.target.value)} type='text' value={messageValue} placeholder='Type a message here...' />
                  <div className='h-8  flex justify-center items-center ml-3'>
                    <label className='h-full flex justify-center items-center bg-[#FF6666] p-2 rounded-md' htmlFor='submitbutton'>
                      <FontAwesomeIcon className='text-white' icon={faPaperPlane} />
                    </label>
                  </div>
                  <input className='hidden' type='submit' id='submitbutton' />
                </div>
              </form>
            </section>
          </section>
    
      );
}

export default MessagingPage;

