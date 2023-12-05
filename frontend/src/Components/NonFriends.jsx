import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { baseUrl, imgBaseUrl } from '../Constants'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { getFriends } from '../Hooks'
import axios from 'axios'
import store from '../Store'
import { toast } from 'react-toastify'
import { removeNonfriends } from '../Store/Slices'
import { useNavigate } from 'react-router-dom'

const NonFriends = () => {
    const {fetchNonFriendsData} = getFriends()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    useEffect(()=>{
      fetchNonFriendsData()
    },[])
    const nonFriends = useSelector(state=>state.friendships.nonFriends)

    const handleSendFriendRequest = (e)=>{
      const reqReceiverID = e.currentTarget.id;
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
              dispatch(removeNonfriends(reqReceiverID))
              toast.success('Friend request sent');
            }
          })
          .catch((err) => console.log(err));
        }
        catch (error) {
          console.log(error);
        }
      }

  if(nonFriends?.length > 0){
    
  return (
    <React.Fragment>{
    nonFriends &&
    (
        <div className='ml-6 hidden lg:block mt-14 '>
          <div className='p-2 flex flex-col right-2  w-[300px] rounded-md border border-solid border-gray-200'>
             <h3 className='text-[15px]  font-semibold pb-2 pl-3 border-b border-gray-200'>People you might know</h3>
          {
           nonFriends.map(person=>
               {return(
                <div key={person._id} className='w-full flex flex-1 items-center ml-3'>
                  <div className='w-[20%] '>
                    <img className='h-10 w-10 rounded-full object-cover' src={`${imgBaseUrl}${person.avatar}`} />
                  </div>
                  <div className='w-[50%] flex flex-col p-2 ml-1'>
                      <p className='cursor-pointer hover:underline' onClick={()=>navigate(`/user/userprofile/${person._id}`)}>{person.username}</p>
                      <div className='flex gap-2'>
                        <small className='font-thin'>Friends</small>
                        <small className='font-thin'>{person.friendships.length}</small>
                      </div>
                  </div>
                  <div  onClick={handleSendFriendRequest} id={person._id} className='cursor-pointer'>
                    <FontAwesomeIcon  icon={faUserPlus} />                
                  </div>
                </div>
               )}
               )
          }
          </div>
    </div>
    )
    }
    </React.Fragment>
  )
  }

  return(
    <></>
  )
}

export default NonFriends
