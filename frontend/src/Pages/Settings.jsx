import React, { useState } from 'react'
import { BottomBar, Commercial, LeftSideBar, Navbar, NonFriends } from '../Components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp, faEdit, faLock, faTrash, faUserGroup, faXmarkCircle } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { baseUrl } from '../Constants'
import { updatePrivacy } from '../Store/Slices'
import store from '../Store'
import { toast } from 'react-toastify'

const Settings = () => {
  const navigate = useNavigate()
  const [showPrivacyPopup,setShowPrivacyPopup] = useState(false);
  const [showConfirmation,setShowConfirmation] = useState(false)
  const user = useSelector(state=>state.users)
  const dispatch = useDispatch()

  const updatePrivacyController = async() => {
    try {
      await axios
        .post(
          `${baseUrl}/user/updateprivacy`,
          {}, // The second parameter is the data (empty in this case)
          {
            headers: {
              Authorization: `Bearer ${store.getState().authToken.authToken}`,
            },
          }
        )
        .then((res) => {
          dispatch(updatePrivacy({isPrivate:res.data.isPrivate}));
          setShowConfirmation(false)
          setShowPrivacyPopup(false)
          toast.success(`Your Account is ${res.data.isPrivate ? "Private" : "Public"} now`)
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };
  

  return (
    <section className='w-full'>
      <Navbar />
      <section className='homesection  flex w-full'>
        <section className='md:w-[21%]'>
          <LeftSideBar  />
        </section>
        <section className='w-full mt-[80px] flex flex-col md:w-[110%] md:ml-[135px] lg:ml-0 lg:w-[56%] items-center p-2'>
          <h1 className='mr-auto ml-5 text-[24px] font-bold text-[#FF6666]'>Settings</h1>
          <section className='w-[80%] mt-4'>
            <div className='p-2 font-semibold text-gray-700 text-[14px] md:text-[16px]'>
              <div onClick={()=>setShowPrivacyPopup(prev=>!prev)} className='w-full flex flex-1 items-center cursor-pointer rounded-sm bg-slate-100 hover:bg-[#FF6666] hover:text-white p-3 '>
                
                <p><FontAwesomeIcon className='mr-5' icon={faLock} /> Account Privacy</p>
                {showPrivacyPopup ? <FontAwesomeIcon className='ml-auto hover:scale-105' icon={faCaretUp} /> : <FontAwesomeIcon className='ml-auto hover:scale-105' icon={faCaretDown} />}
              </div>
              {
                showPrivacyPopup && <div className=' p-3 cursor-pointer rounded-sm bg-slate-100 flex items-center gap-2'>
                  <p>Your Account is {user.isPrivate ? <span className='font-bold'>Private</span>:<span className='font-bold'>Public</span>} make it </p>
                  <button onClick={()=>setShowConfirmation(true)} className='p-2 bg-[#FF6666] rounded-lg text-white hover:scale-105'>{user.isPrivate ? "Public" : "Private"}</button>
                </div>
              }
                            {
                showConfirmation &&
                <div className='w-[80%] lg:w-[45%] break-words fixed p-4 text-center bg-black text-white gap-1'>
                    <FontAwesomeIcon onClick={()=>setShowConfirmation(false)} className='text-[20px] cursor-pointer text-red-500 ml-[90%]' icon={faXmarkCircle} />
                    <p>Are yo sure you want to make it </p><span>{user.isPrivate ? "Public" : "Private"}</span><button onClick={updatePrivacyController} className='text-white p-2 ml-2 bg-red-500'>Yes</button>
                </div>
              }
              <p onClick={()=>navigate("/user/editprofile")} className='mt-2 p-3 cursor-pointer rounded-sm bg-slate-100 hover:bg-[#FF6666] hover:text-white'><FontAwesomeIcon className='mr-5' icon={faEdit} />Edit Profile</p>
              <p onClick={()=>navigate("/user/friends")} className='mt-2 p-3 cursor-pointer rounded-sm bg-slate-100 hover:bg-[#FF6666] hover:text-white'><FontAwesomeIcon className='mr-5' icon={faUserGroup} />Friends</p>
              <p  className='mt-2 p-3 cursor-pointer rounded-sm bg-slate-100 hover:bg-red-500 hover:text-white'><FontAwesomeIcon className='mr-5' icon={faTrash} />Delete Account</p>
            </div>
          </section>
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

export default Settings
