import React, { useState,useEffect } from 'react';
import store from "../Store/index"
import Navbar from '../Components/Navbar';
import LeftSideBar from '../Components/LeftSideBar';
import { imgBaseUrl } from '../Constants';
import Commercial from '../Components/Commercial';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { NonFriends } from '../Components';
import { getFriends, getPosts,getUser } from '../Hooks/index';


function Profile() {
  const user = useSelector(state=>state.users)
  const userPosts = useSelector(state=>state.posts.userPosts)
  const friends = useSelector(state=>state.friendships.friends)
  const [file,setFile] = useState()
  const [showPopup, setShowPopup] = useState(false);
  const {fetchUserPostsData} = getPosts();
  const {fetchUserData} = getUser();
  const {fetchFriendsData} = getFriends()

  useEffect(() => {
    fetchUserData()
    fetchUserPostsData(user._id)
    fetchFriendsData()
  }, []);

  const handleFileSubmit = (e)=>{
    e.preventDefault()
  
    const formData = new FormData()
    formData.append('avatar',file)
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
  }




  return (
    <section className='w-full'>
      <Navbar />
      <section className='homesection  flex w-full'>
        <section className='md:w-[21%]'>
          <LeftSideBar  />
        </section>
        <section className='w-full mt-24 md:mt-[80px] flex flex-col md:w-[110%] md:ml-[135px] lg:ml-0 lg:w-[56%] items-center'>
          <div className='w-full p-2 h-[150px] md:h-[210px] flex justify-evenly  items-center'>
            <div className='flex justify-end items-center'>
              <img className='h-[120px] w-[120px] md:h-[200px] md:w-[200px] rounded-full object-cover' src={`${imgBaseUrl}${user?.avatar}`} />
            </div>
            <div className='h-[300px] flex flex-col items-center justify-center'>
              <p className='text-[20px] font-semibold'>{user.username}</p>
              <div className='flex justify-center items-center gap-4 mt-3'>
                <p>Friends &nbsp;{friends?.length}</p>
                <p>|</p>
                <p>Posts &nbsp;{userPosts?.length}</p>
              </div>
            </div>
          </div>
          <div className='w-full mt-16 ml-[20px] md:ml-[30px] flex justify-start flex-wrap'>
            {
              userPosts.map(post=>(
                post.image ? 
                <div key={post._id} onClick={()=>setShowPopup(!showPopup)} className='h-[125px] w-[125px] md:w-[32%] md:h-[240px] m-[2px] rounded-sm border-[1px] border-solid border-gray-300'>
                  <img className='h-full w-full object-cover rounded-sm' src={`${imgBaseUrl}${post.image}`} />
                </div> : 
                <div key={post._id} className='h-[120px] w-[120px] md:w-[32%] rounded-sm md:h-[240px] m-[3px] flex justify-center items-center border-[1px] border-solid border-gray-300'> 
                  <p>{post.content}</p>
                </div>
              ))
              
            }
            {
              showPopup && (
                <div onClick={()=>setShowPopup(!showPopup)} className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center'>
                    Hiii
                </div>
              )
            }
          </div>
        </section>
        <section className='lg:w-[23%] flex flex-col'>
          <Commercial />
          <NonFriends />
        </section>
      </section>
    </section>
    );
}

export default Profile;


{/* <form onSubmit={handleFileSubmit} encType="multipart/form-data">
<input onChange={(e)=>setFile(e.target.files[0])} name='avatar'  type='file'/>
<input type='submit' />
</form>  */}