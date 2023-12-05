import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faCaretDown ,faBell,faGear,faEdit,faUser,faRightFromBracket, faBars, faX} from "@fortawesome/free-solid-svg-icons"
import { useSelector } from 'react-redux';
import { SidebarLinksHome, iconsDataHome, imgBaseUrl } from '../Constants';


const Navbar = () => {

  const Navigate = useNavigate()
  const[showDropDown,setShowDropDown] = useState(false)
  const dropdownRef = useRef(null);
  const user = useSelector(state=>state.users)
  const [showLeftSidebar,setShowLeftSideBar] = useState(false);
  const navigate = useNavigate()
  const sidebarLinks = SidebarLinksHome();
  const {pathname} = useLocation()
  const data = iconsDataHome;

  const handleToggleDropdown = () => {
    setShowDropDown(!showDropDown);
  };

  const handleCloseDropdown = (event) => {
    // Close the dropdown if the click is outside of it
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropDown(false);
    }
  };

  useEffect(() => {
    // Add click event listener to the document
    document.addEventListener('click', handleCloseDropdown);

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener('click', handleCloseDropdown);
    };
  }, []);

  function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  }

  function handleLogOut() {
    // Delete the 'userToken' cookie
    // Perform other sign-out actions
    try {
      deleteCookie('foxialAuthToken');
      sessionStorage.removeItem('user');
      Navigate("/auth/login")
      setTimeout(()=>{
        window.location.reload()
      },1600)
      toast.success("Logged out Successfully")
    } catch (error) {
      toast.error(error)
    }
  }

  function handleProfilCLick(){
    Navigate(`/user/userprofile/${user._id}`)
  }

  function handleLogoClick(){
    Navigate("/home")
  }

  return (
    <nav className='fixed top-0  w-full md:h-16 border-b border-1 border-solid border-slate-200 md:pr-10 p-2 pr-3 flex z-10 justify-between bg-white'>
      <div className='h-full'>
        <div className='h-full lg:ml-7 flex flex-1 justify-center items-center gap-1'>
          <img onClick={handleLogoClick} className='hidden md:block h-14 cursor-pointer' src='../../../assets/images/foxial_name_logo.png' />
          <img onClick={handleLogoClick} className='block sm:hidden h-14 cursor-pointer' src='../../../assets/images/foxial-logo.png' />
        </div>
      </div>
      <ul className='flex flex-1 items-center justify-end gap-3 '>
        <li>
          <div className='flex flex-1 mr-1 md:0 justify-center items-center gap-1 cursor-pointer'>
            <img ref={dropdownRef} onClick={handleToggleDropdown} className='h-12 w-12 rounded-full object-cover cursor-pointer' src={`${imgBaseUrl}${user.avatar}`} />
          </div>
          {showDropDown && 
          <div   className="absolute right-0 z-50 mt-2 w-48 md:w-52 origin-top-right divide-y divide-gray-100 rounded-md bg-white text-gray-700 shadow-lg mr-4 ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
            <div onClick={handleProfilCLick} className="p-4 hover:text-white hover:bg-[#FF6666] cursor-pointer" role="none">
              <p><label  className='ml-1 mr-3'><FontAwesomeIcon icon={faUser} /></label>Profile</p>
            </div>
            <div onClick={()=>navigate("/user/editprofile")} className="p-4 hover:bg-[#FF6666]  hover:text-white cursor-pointer " role="none">
              <p><label  className='ml-1 mr-3'><FontAwesomeIcon icon={faEdit} /></label>Edit Profile</p>
            </div>
            <div onClick={()=>navigate("/user/settings")} className="p-4 hover:bg-[#FF6666] hover:text-white cursor-pointer" role="none">
              <p ><label  className='ml-1 mr-3'><FontAwesomeIcon icon={faGear} /></label>Settings</p>
            </div>
            <div onClick={handleLogOut} className="p-4 hover:bg-[#FF6666] hover:text-white cursor-pointer" role="none">
              <p><label className='ml-1 mr-3'><FontAwesomeIcon icon={faRightFromBracket} /></label>Logout</p>
            </div>
          </div>
          }
        </li>
        <li className='block lg:hidden'>
          {
          showLeftSidebar ? <FontAwesomeIcon onClick={()=>setShowLeftSideBar(false)} className='text-red-500 text-[22px]' icon={faX} /> :
          <FontAwesomeIcon onClick={()=>setShowLeftSideBar(true)} className='text-[22px]' icon={faBars} />
          }
        </li>
        {
          showLeftSidebar &&
          <section className='fixed right-0 w-[65%] top-20  p-4 border-b-2 rounded-lg shadow-xl lg:w-[19%] flex-col bg-white'>
          {
            sidebarLinks.map((item) => {
              const isActive = pathname.includes(item.route);
          
              if (item.label === "Profile") {
                return (
                  <div
                  onClick={() => navigate(item.route)}
                  key={item.label}
                  className={`${
                    isActive ? "bg-gray-200 text-[#FF6666]" : "text-gray-500"
                  }  group   hover:bg-gray-200 hover:text-[#FF6666] cursor-pointer w-full p-2 pr-0 font-semibold rounded-md flex items-center justify-start`}
                >
                  <img className='h-8 w-8 rounded-full object-cover transform group-hover:scale-125 transition duration-700 ' src={`${imgBaseUrl}${user.avatar}`} />
                  <p className="ml-3 w-[40%]">{user.username}</p>
                </div>
                )
              } else {
                return (
                  <div
                    onClick={() => navigate(item.route)}
                    key={item.label}
                    className={`${
                      isActive ? "bg-gray-200 text-[#FF6666]" : "text-gray-500"
                    } group  hover:bg-gray-200 hover:text-[#FF6666] cursor-pointer w-full p-3 font-semibold rounded-md flex items-start justify-start mt-2`}
                  >
                    <p className="w-[10%]">
                      <FontAwesomeIcon className='group-hover:scale-125 transform transition duration-700' icon={data[item.icon]} />
                    </p>
                    <p className="ml-4 ">{item.label}</p>
                  </div>
                );
              }
            })
          }
          </section>
        }
      </ul>
    </nav>
  )
}

export default Navbar

// FF597B