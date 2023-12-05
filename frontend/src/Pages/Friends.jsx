import React, { useState } from 'react'
import { BottomBar, Commercial, LeftSideBar, Navbar, NonFriends } from '../Components'
import { useDispatch, useSelector } from 'react-redux';
import { baseUrl, imgBaseUrl } from '../Constants';
import { addSingleFriend, removePendingRequests } from '../Store/Slices';
import axios from 'axios';
import store from '../Store';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Friends = () => {
    const [showFriends,setShowFriends] = useState(true);
    const userFriends = useSelector(state=>state.friendships.friends)
    const userFriendRequests = useSelector(state=>state.friendships.pendingRequests)
    const items = showFriends ? userFriends : userFriendRequests;
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleAcceptRequest = (e)=>{
        const senderId = e.currentTarget.id
        try{
          dispatch(removePendingRequests(senderId))
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
                  console.log(res)
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

  return (
    <section className='w-full'>
    <Navbar />
    <section className='homesection  flex w-full'>
      <section className='md:w-[21%]'>
        <LeftSideBar  />
      </section>
      <section className='w-full mt-[80px] flex flex-col md:w-[110%] md:ml-[135px] lg:ml-0 lg:w-[56%]'>
        <div className='mt-3 h-[8%] w-full fixed p-4 md:w-[70%] lg:w-[56%] flex flex-1 justify-center items-center'>
            <div onClick={()=>setShowFriends(true)} className='w-[50%] flex justify-center items-center text-center cursor-pointer'>
                <p className={`${showFriends ? "bg-[#FF6666] text-white" : ""} w-[70%] p-2 font-semibold rounded-lg text-[20px]`}>Friends</p>
            </div>
            <div onClick={()=>setShowFriends(false)}  className='w-[50%] flex justify-center items-center text-center cursor-pointer'>
                <p className={`${!showFriends ? "bg-[#FF6666] text-white" : ""} w-[70%] p-2 font-semibold rounded-lg text-[20px]`}>Friend Requests</p>
            </div>
        </div>
        <div className='w-full mt-[20%] lg:mt-[10%] p-4 flex flex-col justify-center items-center'>
            {

                items?.length > 0 ? 
                items.map(item=>
                    {return(
                        
                    <div key={item._id} className='m-1 pt-1 pb-1 w-full md:w-[50%] flex justify-start items-center rounded-md bg-slate-50 border border-solid'>
                        <div className='w-[25%]  flex justify-center items-center'>
                            <img className='w-12 h-12 object-cover rounded-full' src={`${imgBaseUrl}${item.avatar}`} />
                        </div>
                        <div className='w-[50%] overflow-hidden flex flex-col justify-center'>
                          <p onClick={()=>navigate(`/user/userprofile/${item._id}`)} className='font-semibold hover:underline cursor-pointer'>{item.username}</p>
                          <small>Friends {item?.friendships?.length}</small>
                        </div>
                        {
                            showFriends ? <div className='w-[25%] flex justify-center items-center'><button className='p-1 text-white bg-red-500 rounded-md'>Unfriend</button></div> : <div className='w-[25%] flex justify-center items-center'><button id={item._id} onClick={handleAcceptRequest} className='p-1 bg-green-400 rounded-md'>Accept</button></div>
                        }
                    </div>
                )}) 
                :
                showFriends ? (<div className='text-[24px]  mt-[10%] text-bold'>No Friends</div>) : (<div className='text-[24px]  mt-[10%] text-bold'>No Friend Requests</div>)
            
            }
        </div>
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

export default Friends
