import React, { useState,useEffect } from 'react';
import store from "../Store/index"
import Navbar from '../Components/Navbar';
import LeftSideBar from '../Components/LeftSideBar';
import Posts from '../Components/Posts';
import { baseUrl, commercials, imgBaseUrl } from '../Constants';
import Commercial from '../Components/Commercial';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { getPosts, getUser } from '../Hooks';
import { BottomBar, Loading, NonFriends } from '../Components';
import { useNavigate, useParams } from 'react-router-dom';
import PopUpPost from '../Components/PopUpPost';
import { addSingleFriend, addSingleSentReq, addUserPosts } from '../Store/Slices';
import SinglePost from './SinglePost';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEdit, faLock, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';


function UserProfile() {
  const currUser = JSON.parse(sessionStorage.getItem('user'))
  const currUserFriends = useSelector(state=>state.friendships.friends)
  const currUserPendingRequests = useSelector(state=>state.friendships.pendingRequests)
  const currUserSentRequests = useSelector(state=>state.friendships.sentRequests)
  const { userId } = useParams();
  const isFriend = currUserFriends.some(friend => friend._id === userId);

  // Check if userId is in the pending requests
  const isPendingRequest = currUserPendingRequests.some(request => request === userId);

  // Check if userId is in the sent requests
  const isSentRequest = currUserSentRequests.some(request => request === userId);

  const [user,setUser] = useState({}); 
  const userPosts = useSelector(state=>state.posts.userPosts)
  const {fetchUserById} = getUser()
  const {fetchUserPostsData} = getPosts()
  const [randomCommercial,setRandomCommercial] = useState([])
  const [showPopup, setShowPopup] = useState(false);
  const [popUpPost,setpopUpPost] = useState({})
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const getRandomObject = (array) => {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  };

  const location = useLocation();

  useEffect(() => {

    dispatch(addUserPosts({posts:[]}))

  }, [location.pathname]);

  useEffect(() => {
    const tempUser = fetchUserById(userId)
    tempUser.then(res=>setUser(res?.user))
    const tempPosts = fetchUserPostsData(userId)
    tempPosts.then(res=>dispatch(addUserPosts({posts:res.data.posts})))
    let temp1 = getRandomObject(commercials);
    setRandomCommercial(temp1)
  }, [userId]);

  const handleShowPopUp = (post)=>{
    if(post){
      setpopUpPost(post)
      setShowPopup(true)
    }
    else{
      setpopUpPost({})
      setShowPopup(false)
    }
  }


  const handleAcceptRequest = (e)=>{
    const senderId = user._id
    try{
        axios({
          method: 'POST',
          url: `${baseUrl}/friendship/acceptrequest/${senderId}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${store.getState().authToken.authToken}`,
          },
        })
          .then((res) => {
            if (res.status === 200) {
              dispatch(addSingleFriend({newFriend : res.data.newFriend}))
              toast.success('Friend added');
            }
          })
          .catch((err) => console.log(err));
        }
        catch (error) {
          console.log(error);
        }
  }

  const unFriend = ()=>{
    const senderId = user._id
    try{
        axios({
          method: 'POST',
          url: `${baseUrl}/friendship/unfriend/${senderId}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${store.getState().authToken.authToken}`,
          },
        })
          .then((res) => {
            if (res.status === 200) {
              dispatch(unFriend({unFriend : senderId}))
              toast.success('Friend added');
            }
          })
          .catch((err) => console.log(err));
        }
        catch (error) {
          console.log(error);
        }
  } 


  const handleSendFriendRequest = ()=>{
    const reqReceiverID = user._id;
    try{
      axios({
        method: 'POST',
        url: `${baseUrl}/friendship/sendfriendrequest/${reqReceiverID}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${store.getState().authToken.authToken}`,
        },
      })
        .then((res) => {
          if (res.status === 200) {
            dispatch(addSingleSentReq(reqReceiverID))
            toast.success('Friend request sent');
          }
        })
        .catch((err) => console.log(err));
      }
      catch (error) {
        console.log(error);
      }
    }


  if(user){
    return(
      <section className='w-full'>
      <Navbar />
      <section className='homesection  flex w-full'>
        <section className='md:w-[21%]'>
          <LeftSideBar  />
        </section>
        <section className='w-full mt-24 md:mt-[80px] flex flex-col md:w-[110%] md:ml-[135px] lg:ml-0 lg:w-[56%] items-center'>
          <div className='w-full lg:w-[85%] flex justify-evenly  items-center'>
            <div className='flex justify-end items-center'>
              <img className='h-[80px] w-[80px] md:h-[150px] md:w-[150px] rounded-full object-cover' src={`${imgBaseUrl}${user?.avatar}`} />
            </div>
            <div className='flex flex-col p-1 items-center justify-center'>
              <div className='flex flex-1 p-2 items-center'>
                <p className='lg:text-[20px] font-semibold text-[16px]'>{user.username}</p>
                <div className='ml-4'>
                {currUser._id === userId ? (
                  <button
                    onClick={() => navigate('/user/editprofile')}
                    className='p-1 lg:p-2 rounded-lg bg-[#FF6666] text-white hover:opacity-75 text-[14px] lg:text-[16px]'
                  >
                    <FontAwesomeIcon className='text-white pr-1' icon={faEdit} />
                    Edit
                  </button>
                ) : (
                  <div className='flex flex-1 items-center gap-2'>
                    {isFriend ? (
                      <button onClick={unFriend} className='p-2 rounded-md bg-red-500 text-white hover:opacity-75 text-[14px]'>
                        Unfriend
                      </button>
                    ) : isPendingRequest ? (
                      <div onClick={handleAcceptRequest} className='flex flex-1 items-center gap-1 bg-green-400 p-2 rounded-md'>
                        <FontAwesomeIcon icon={faCheck} />
                        <button className=''>Accept</button>
                      </div>
                    ) : isSentRequest ? (
                      <div className='cursor-not-allowed p-2 bg-gray-400 opacity-50 hover:opacity-80'>
                       Request Sent
                      </div>
                    ) : (
                      <div onClick={handleSendFriendRequest} className='flex flex-1 items-center gap-1 bg-blue-400 p-2 rounded-md'>
                        <FontAwesomeIcon icon={faUserPlus} />
                        <button className=''>Add Friend</button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              </div>
              <p className='break-words flex flex-wrap text-[14px]'>{user?.bio}</p>
              <div className='flex justify-center items-center gap-4 mt-3'>
                <p className='font-semibold text-[14px] lg:text-[16px]'>Friends &nbsp;{user.friendships?.length}</p>
                <p>|</p>
                <p className='font-semibold text-[14px] lg:text-[16px]'>Posts &nbsp;{userPosts?.length}</p>
              </div>
            </div>
          </div>
          {
            currUser._id !== user._id && !isFriend && user.isPrivate ? 
            <div className='w-full p-1 flex flex-1 items-center justify-center text-center'>
              <div className='w-[50%] flex items-center justify-center gap-2'>
                <FontAwesomeIcon icon={faLock} />
                <p className='font-bold text-[18px]'>This Account is Private</p>
              </div>
            </div>
            :<>
              {/*Large Screens */}
              <div className='w-full hidden lg:block'>
            <div className='w-full mt-16 ml-[10px] lg:ml-[20px] flex justify-start flex-wrap cursor-pointer'>
              {
                userPosts && (
                  userPosts.map(post=>(
                    post.image ? 
                    <div key={post._id} onClick={()=>handleShowPopUp(post)} className='h-[125px] w-[125px] md:w-[32%] md:h-[240px] m-[2px] rounded-sm border-[1px] border-solid border-gray-300'>
                      <img className='h-full w-full object-cover rounded-sm' src={`${imgBaseUrl}${post.image}`} />
                    </div> : 
                    <div key={post._id} onClick={()=>handleShowPopUp(post)} className='h-[125px] w-[125px] flex justify-center items-center md:w-[32%] md:h-[240px] m-[2px] rounded-sm border-[1px] border-solid border-gray-300 '> 
                      <p className='h-[30%] w-full overflow-hidden text-center'>{post.content}</p>
                    </div>
                  ))
                )
                  
              }
              {
                showPopup && (
                  <PopUpPost post={popUpPost} showPopup={showPopup} setShowPopup={setShowPopup} />
                )
              }
              </div>
            </div>
             {/* Mobile and Tablet */}
            <div className='w-full block lg:hidden'>
            <div className='w-full mt-16 ml-[3px] lg:ml-[20px] flex justify-start flex-wrap cursor-pointer'>
              {
                userPosts && (
                  userPosts.map(post=>(
                    post.image ? 
                    <div key={post._id} onClick={()=>handleShowPopUp(post)} className='h-[110px] w-[110px] md:w-[32%] md:h-[240px] m-[2px] rounded-sm border-[1px] border-solid border-gray-300'>
                      <img className=' h-full w-full object-cover rounded-sm' src={`${imgBaseUrl}${post.image}`} />
                    </div> : 
                    <div key={post._id} onClick={()=>handleShowPopUp(post)} className='h-[125px] w-[125px] md:w-[32%] rounded-sm md:h-[240px] m-[3px] flex justify-center items-center border-[1px] border-solid border-gray-300'> 
                      <p className='h-[50%] w-[100%] overflow-hidden'>{post.content}</p>
                    </div>
                  ))
                )
                  
              }
              {
                showPopup && (
                  <PopUpPost setShowPopup={setShowPopup} post={popUpPost} />
                )
              }
            </div>
          </div>
            </>
          }
        </section>
        <section className='lg:w-[23%] flex flex-col'>
          <Commercial />
          <NonFriends />
        </section>
      </section>
      <BottomBar />
    </section>
    )
  }

  return(
    <Loading />
  )

}

export default UserProfile;
