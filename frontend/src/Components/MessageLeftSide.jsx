import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from 'react-router-dom'
import { faArrowLeft, faXmarkCircle, faSearch } from '@fortawesome/free-solid-svg-icons'
import { baseUrl, imgBaseUrl } from '../Constants'
import store from '../Store'
import axios from 'axios'
import { addMessages } from '../Store/Slices'
import BottomBar from './BottomBar'


const MessageLeftSide = (props) => {
  
  const user = useSelector(state=>state.users)
  const socket = props.socket
  const messagingUser = props.messagingUser
  const setMessages = props.setMessages;
  const setMessagingUser = props.setMessagingUser;
  const [searchName,setSearchName] = useState("")
  const navigate = useNavigate()
  const [searchLoading,setSearchLoading] = useState(false)
  const [search,setSearch] = useState(false)
  const[searchResults,setSearchResults] = useState([]);
  const chats = useSelector(state=>state.chats)
  const dispatch = useDispatch()


  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setSearchLoading(true);
        const response = await axios({
          method: 'GET',
          url: `${baseUrl}/user/search`,
          params: {
            q: searchName, // Assuming `q` is the query parameter name expected by your backend
          },
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${store.getState().authToken.authToken}`,
          },
        });
        if(response.status === 200){
          setSearchResults(response.data.users)
        }
        setSearchLoading(false);
      } catch (error) {
        console.error('Error during search:', error);
        setLoading(false);
      }
    };
    // Debounce the fetchSearchResults function to avoid making too many requests
    const debounceTimeout = setTimeout(() => {
      if (searchName.trim() !== '') {
        fetchSearchResults();
      } else {
        // If searchTerm is empty, clear searchResults
        setSearchResults([]);
      }
    }, 600); // Adjust the debounce delay as needed (e.g., 300 milliseconds)

    // Clear the timeout if the component unmounts or if the searchTerm changes
    return () => clearTimeout(debounceTimeout);
  }, [searchName]);

  const handleMobileChatClick = async(chatDetails)=>{
    try {
      navigate(`/messages/mobile/${chatDetails.chatId}`)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSearchResultClick = async(e)=>{
    try {
      const response = await axios({
        method: 'POST',
        url: `${baseUrl}/chat`,
        data: {
          userId: e.currentTarget.id, // Assuming `q` is the query parameter name expected by your backend
        },
        headers: {
          Authorization: `Bearer ${store.getState().authToken.authToken}`,
        },
      });
      const newUser = response.data.users.filter(i=> i._id !== user._id)
      const newChat = {
        chatId: response.data._id,
        user:newUser
      }
      setSearchResults([])
      setSearchName("")
      setSearch(false)
      handleChatClick(newChat)
    } catch (error) {
      console.log(error)
    }
  }

  const handleChatClick = async (chatDetails)=>{  
    try {
      const res = await axios({
        method:"GET",
        url : `${baseUrl}/message/${chatDetails.chatId}`,
        headers: {
          Authorization: `Bearer ${store.getState().authToken.authToken}`,
        },
      })
      dispatch(addMessages({chatId:chatDetails.chatId,messages:res.data}))
      setMessages(res.data)
      setMessagingUser(chatDetails)
      socket.emit("join chat",chatDetails.chatId)
    } catch (error) {
      console.log(error)
    }
  }

  
  return (
    <React.Fragment>
            <section  className='h-[8%] w-full p-4 bg-[#FF6666] flex items-center text-white border-b border-gray-300'>
              <FontAwesomeIcon onClick={()=>navigate("/home")} className='text-[21px] cursor-pointer' icon={faArrowLeft} />
              <p className='ml-4 text-[25px] font-bold'>Messages</p>
              <div className='w-[10%] fixed right-3 lg:left-[22%] flex justify-center items-center'>
                <FontAwesomeIcon onClick={()=>setSearch(prev=>!prev)} className='text-[20px] font-bold cursor-pointer' icon = {search ? faXmarkCircle : faSearch} />
              </div>
            </section>
            {
              search &&
              <div className='w-[90%] mt-1 mb-1 ml-4  p-1 flex justify-center items-center rounded-lg border border-solid border-gray-300 '>
              <input className='w-[90%] p-2  rounded-md outline-none border-none' onChange={(e)=>setSearchName(e.target.value)} value={searchName} placeholder='Search user...' type='text' />
              {
                searchLoading ?  <div className='w-[7%] h-[19.8px] md:w-[5%] md:h-[20px] border-4 border-solid border-t-4 border-t-[#FF6666] animate-spin rounded-full'></div> :<></>
              }
            </div>
            }
            {
              searchResults.length > 0 && (
              <section className='w-full lg:w-[30%] mt-1 flex flex-col flex-1 fixed justify-start items-center bg-white'>
                <div className='w-[90%] flex justify-end items-center'>
                  <FontAwesomeIcon onClick={()=>{setSearchResults([]),setSearchName("")}} className='text-red-500 p-2 cursor-pointer' icon={faXmarkCircle} />
                </div>
                <section className='w-[90%] p-1 flex flex-col justify-start items-center'>
                  {
                    searchResults.map(person=>{
                      return(
                        <div key={person._id} id={person._id} onClick={handleSearchResultClick} className='w-full p-1 m-1 flex items-center border border-gray-300 rounded-md cursor-pointer hover:bg-[#FF6666] hover:text-white'>
                          <img className='w-12 h-12 rounded-full object-cover' src={`${imgBaseUrl}${person.avatar}`} />
                          <p className='pl-6 pr-2 flex items-center'>{person.username}</p>
                        </div>
                      )
                    })
                  }
                </section>
              </section>
              )
            }
              <section className='w-full'>
              { chats?.length > 0 ?
                chats.map(item=>(
                  <div key={item.chatId}>
                    <div className='hidden lg:block'>
                      <div key={item.chatId} onClick={()=>{handleChatClick(item)}} className='w-full flex flex-1 p-2 cursor-pointer border-b border-solid border-gray-300 hover:bg-[#FF6666] hover:text-white'>
                      <div className='ml-2'><img className='h-14 w-14 rounded-full object-cover' src={`${imgBaseUrl}${item.user[0].avatar}`} /></div>
                      <div className='w-[70%] h-14 flex flex-col ml-4 p-1 items-start justify-center'>
                        <div className=''><p className='font-semibold '>{item.user[0].username}</p></div>
                        <div className='w-full  overflow-hidden'>
                          {
                            item?.latestMessage?.sender?._id === user._id ? 
                            <small className='text-[12px] font-thin w-full overflow-hidden'>You:&nbsp;{item?.latestMessage?.content}</small> :
                            <small>{item.latestMessage?.content}</small>
                          }
                        </div>
                      </div>
                      </div>
                    </div>
                    {/* MObile tab View */}
                    <div key={item.chatId} className='block lg:hidden'>
                        <div key={item.chatId} onClick={()=>{handleMobileChatClick(item)}} className=' w-full flex flex-1 p-2 cursor-pointer border-b border-solid border-gray-300 hover:bg-[#FF6666] hover:text-white'>
                        <div className='ml-2'><img className='h-14 w-14 rounded-full object-cover' src={`${imgBaseUrl}${item.user[0].avatar}`} /></div>
                        <div className='w-[70%] h-14 flex flex-col ml-4 p-1 items-start justify-center'>
                          <div className=''><p className='font-semibold '>{item.user[0].username}</p></div>
                          <div className='w-full  overflow-hidden'>
                            {
                              item?.latestMessage?.sender?._id === user._id ? 
                              <small className='text-[12px] font-thin w-full overflow-hidden'>You:&nbsp;{item?.latestMessage?.content}</small> :
                              <small>{item.latestMessage?.content}</small>
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                ))
                :<div className='h-full w-full flex justify-center items-center'>
                    <p className='text-[#FF6666] font-semibold text-[18px]'>No Chats </p>
                </div>
              }
              <BottomBar />
            </section>
    </React.Fragment>
  )
}

export default MessageLeftSide
