import React, { useEffect, useRef, useState } from 'react'
import { BottomBar, Commercial, LeftSideBar, Navbar, NonFriends } from '../Components'
import { baseUrl, imgBaseUrl } from '../Constants';
import axios from 'axios';
import store from '../Store';
import { Link } from 'react-router-dom';

const Search = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.focus();
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        const response = await axios({
          method: 'GET',
          url: `${baseUrl}/user/search`,
          params: {
            q: searchTerm, // Assuming `q` is the query parameter name expected by your backend
          },
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${store.getState().authToken.authToken}`,
          },
        });
        if(response.status === 200){
          setSearchResults(response.data.users)
        }
        setLoading(false);
      } catch (error) {
        console.error('Error during search:', error);
        setLoading(false);
      }
    };

    // Debounce the fetchSearchResults function to avoid making too many requests
    const debounceTimeout = setTimeout(() => {
      if (searchTerm.trim() !== '') {
        fetchSearchResults();
      } else {
        // If searchTerm is empty, clear searchResults
        setSearchResults([]);
      }
    }, 800); // Adjust the debounce delay as needed (e.g., 300 milliseconds)

    // Clear the timeout if the component unmounts or if the searchTerm changes
    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  return (
    <section className='w-full'>
    <Navbar />
    <section className='homesection  flex w-full'>
      <section className='md:w-[21%]'>
        <LeftSideBar  />
      </section>
      <section className='w-full mt-24 md:mt-[80px] flex flex-col md:w-[110%] md:ml-[135px] lg:ml-0 lg:w-[56%] items-center'>
        <div className='m-2 w-[90%] lg:w-[65%] flex justify-center items-center border-2 border-solid border-black'>
          <input ref={inputRef} onChange={(e)=>setSearchTerm(e.target.value)} value={searchTerm} className='w-[90%] p-2 border-none outline-none' placeholder='Search...' type='text'/>
          {loading ?  <div className=' h-[20px] w-[6.8%]    md:w-[5%] md:h-[25px] border-4 border-solid border-t-4 border-t-[#FF6666] animate-spin rounded-full'></div>:<></>}
        </div>
        {
        searchResults.length > 0 ? 
        <div className='w-full flex flex-col justify-center items-center'>
          <h2 className='font-bold text-[18px] m-2 mr-[60%]'>Results</h2>
          {searchResults.map(user=>{
            return(
              <div key={user._id} className='w-[50%] flex flex-1 items-center m-1 p-1 border border-solid cursor-pointer hover:bg-[#FF6666] hover:text-white'>
                <img className='h-12 w-12 rounded-full object-cover' src={`${imgBaseUrl}${user.avatar}`} />
                <div key={user._id} className='p-2 cursor-pointer font-bold'><Link to={`/user/userprofile/${user._id}`}>{user.username}</Link></div>
              </div>
            )
          })}
        </div>
        :
        <div className='flex flex-1 justify-center items-center'>
          <p className='text-[#FF6666] font-bold'>No User</p>
        </div>

        }
        <div></div>
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

export default Search
