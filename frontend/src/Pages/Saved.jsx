import React, { useEffect, useState } from 'react'
import { BottomBar, Commercial, LeftSideBar, Navbar, NonFriends } from '../Components'
import Posts from '../Components/Posts'
import { getPosts } from '../Hooks'
import { useSelector } from 'react-redux'

const Saved = () => {
    const {fetchSavedPosts} = getPosts()
    const [loading,setLoading] = useState(false)
    const posts = useSelector(state=>state.users.saved)
    
    useEffect(()=>{
      fetchSavedPosts()
    },[])

    console.log(posts)
  return (
    <section className='w-full'>
      <Navbar />
      <section className='homesection  flex w-full'>
        <section className='md:w-[21%]'>
          <LeftSideBar  />
        </section>
        <section className='w-full md:mt-[80px] flex flex-col md:w-[110%] md:ml-[135px] lg:ml-0 lg:w-[56%] justify-center items-center'>
          <h2 className='mr-auto text-[24px] font-semibold'>Saved Posts</h2>
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

export default Saved
