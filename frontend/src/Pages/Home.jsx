import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {Navbar,LeftSideBar, Commercial, Loading, NonFriends, BottomBar} from '../Components/index';
import Posts from '../Components/Posts';
import { getFriends, getPosts,getUser } from '../Hooks/index';
import DarkModeToggle from "../Components/DarkModeToggle"
import SkeletonCards from '../Components/SkeletonCards';



const Home = () => {
  
  const [loading,setLoading] = useState(false);
  const {fetchPostsData} = getPosts();
  const {fetchUserData} = getUser();
  const {fetchFriendsData} = getFriends()
  const posts = useSelector(state=>state.posts.posts)
  
  useEffect(()=>{
    setLoading(true)
    fetchUserData()
    fetchPostsData()
    fetchFriendsData()
    setLoading(false)
  },[])
  
  



  return (
    <section className='w-full'>
      <Navbar />
      <section className='homesection  flex w-full'>
        <section className='md:w-[21%]'>
          <LeftSideBar  />
        </section>
        <section className='w-full flex flex-col md:w-[110%] md:ml-[135px] lg:ml-0 lg:w-[56%] items-center'>
          {
            loading ? <SkeletonCards cards={10} /> : <Posts posts={posts} />
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

export default Home
