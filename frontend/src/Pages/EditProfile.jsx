import React, { useEffect, useRef, useState } from 'react'
import { Commercial, LeftSideBar, Navbar, NonFriends } from '../Components'
import { getFriends, getPosts,getUser } from '../Hooks/index';
import { useDispatch, useSelector } from 'react-redux';
import { baseUrl, imgBaseUrl } from '../Constants';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import store from '../Store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faImage, faX } from '@fortawesome/free-solid-svg-icons';

const EditProfile = () => {
    const user = useSelector(state=>state.users)
    const friends = useSelector(state=>state.friendships.friends)
    const [file,setFile] = useState()
    const [username,setUsername] = useState("")
    const [bio,setBio] = useState("")
    const {fetchUserData} = getUser();
    const {fetchFriendsData} = getFriends()
    const location = useLocation();
    const dispatch = useDispatch()
    const usernameRef = useRef()
    const bioRef = useRef()
    const [isAvailable,setIsAvailable] = useState(false);
    const [checking,setChecking] = useState(false);

    useEffect(()=>{
      const checkUsernameAvailability = ()=>{
        if(username){
          setChecking(true)
          try {
            axios.get(`${baseUrl}${"/user/checkusernameavailable"}`,{
              params: { username },
              headers:{
                'Content-Type': 'application/json',
                Authorization: `Bearer ${store.getState().authToken.authToken}`
              }
            })
            .then(res=>{
              setChecking(false)
              setIsAvailable(true)
              console.log(res)
            })
            .catch(err=>{
              setChecking(false)
              setIsAvailable(false);
              console.log(err)
            })
          } catch (error) {
            setChecking(false)
            setIsAvailable(false);
            console.log(err)
          }
        }
      }
      const timeOut = setTimeout(()=>{
        if(username !== ''){
          checkUsernameAvailability()
        }else{
          return
        }
      },800)

      return () => clearTimeout(timeOut);
    },[username])

    useEffect(() => {
      if(user){
          fetchUserData()
          fetchFriendsData()
      }
  }, []);

    useEffect(()=>{
      bioRef.current.focus()
    },[])
    
    useEffect(() => {
      usernameRef.current.focus()
  
    },[]);


    const handleFileSubmit = (e)=>{
      e.preventDefault()
      if(checking || !isAvailable){
        return;
      }else{
        try {
          const formData = new FormData()
          formData.append('avatar',file)
          formData.append('username',username)
          formData.append('bio',bio)
          axios({
            method: 'POST',
            url: 'http://localhost:8080/foxial/api/user/update',
            data: formData, // Use 'data' instead of 'body' for form data
            headers: {
              'Content-Type': 'multipart/form-data', // Correct content type for form data
              Authorization: `Bearer ${store.getState().authToken.authToken}`,
            },
          })
            .then(response => {
              // Handle the response
              console.log(response.data);
            })
            .catch(error => {
              // Handle errors
              console.error('Error during file upload:', error);
            });
          
        } catch (error) {  
        }
      }

    }

  return (
    <section className='w-full'>
    <Navbar />
    <section className='homesection  flex w-full'>
      <section className='md:w-[21%]'>
        <LeftSideBar  />
      </section>
      <section className='w-full mt-24 md:mt-[80px] flex flex-col md:w-[110%] md:ml-[135px] lg:ml-0 lg:w-[56%] items-center justify-center'>
      <div className='w-full p-2 md:h-[210px] flex flex-col justify-evenly  items-center'>
            <div className='flex  justify-end items-center'>
              {
              file 
              ? <img className='h-[120px] w-[120px] md:h-[200px] md:w-[200px] rounded-full object-cover' src={URL.createObjectURL(file)} />
              : <img className='h-[120px] w-[120px] md:h-[200px] md:w-[200px] rounded-full object-cover' src={`${imgBaseUrl}${user?.avatar}`} />
              }
            </div>
              <form className='flex flex-col justify-center gap-2' onSubmit={handleFileSubmit} encType="multipart/form-data">
                <div className='flex flex-1 m-2 p-1'><label name='image'  htmlFor="inputfile"><FontAwesomeIcon className='cursor-pointer mr-2 text-blue-500' icon={faImage} /></label>{file?.name ? (<div  className='font-semibold '>{file.name}</div>):<p>Choose Profile Picture</p>}</div>
                <input id='inputfile' className='hidden' onChange={(e)=>setFile(e.target.files[0])} name='avatar'  type='file'/> 
                <input ref={usernameRef} required placeholder='Your username' onChange={(e)=>setUsername(e.target.value)} className=' p-2 font-semibold border border-black'  />
                <div className='flex flex-1 items-center gap-3'>
                  {
                  checking && <div className='w-[20px] h-[20px] border-4 border-solid border-t-[#FF6666] animate-spin rounded-full'></div>
                  }
                  {
                  (isAvailable ?
                  <div className='flex flex-1 items-center gap-2'><FontAwesomeIcon className='text-[14px] text-green-400' icon={faCheck} /><p className='text-green-400 text-[14px]'>Available</p></div> 
                  :<div className='flex flex-1 items-center gap-2'><FontAwesomeIcon className='text-[14px] text-red-500' icon={faX} /><p className='text-red-500 text-[14px]'>Not Available</p></div> )
                  }
                </div>
                <input className='p-2 border border-black' ref={bioRef} onChange={(e)=>setBio(e.target.value)} placeholder='Your bio..'  />
                <input className='bg-green-400 p-2 cursor-pointer' type='submit' />
              </form>
            </div>
      </section>
      <section className='lg:w-[23%] flex flex-col'>
        <Commercial />
        <NonFriends />
      </section>
    </section>
  </section>
  )
}

export default EditProfile
