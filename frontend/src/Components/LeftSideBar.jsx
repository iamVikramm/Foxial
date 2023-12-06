import React from 'react'
import { iconsDataHome, SidebarLinksHome} from '../Constants';
import { useLocation,useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import store from '../Store';
import { useSelector } from 'react-redux';
import { imgBaseUrl } from '../Constants';

const LeftSideBar = () => {
  
  const sidebarLinks = SidebarLinksHome();
  const data = iconsDataHome; 
  const {pathname} = useLocation()
  const navigate = useNavigate()
  const user = useSelector(state=>state.users)
  return (

    <section className='hidden md:block fixed left-0 mt-16  p-4 h-[92vh] border-b-2 rounded-lg rounded-br-lg shadow-xl md:w-[30%] lg:w-[19%]  flex-col gap-2 bg-white'>
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
        }  group   hover:bg-gray-200 hover:text-[#FF6666] cursor-pointer w-full p-4 pl-0 pr-0 font-semibold rounded-md flex items-center justify-center lg:mt-52`}
      >
        <img className='h-8 w-8 rounded-full object-cover transform group-hover:scale-125 transition duration-700 ' src={`${imgBaseUrl}${user.avatar}`} />
        <p className="ml-4 w-[40%]">{user.username}</p>
      </div>
      )
    } else {
      return (
        <div
          onClick={() => navigate(item.route)}
          key={item.label}
          className={`${
            isActive ? "bg-gray-200 text-[#FF6666]" : "text-gray-500"
          } group  hover:bg-gray-200 hover:text-[#FF6666] cursor-pointer w-full p-4 pl-0 pr-0 font-semibold rounded-md flex items-start justify-center mt-2`}
        >
          <p className="">
            <FontAwesomeIcon className='group-hover:scale-125 transform transition duration-700' icon={data[item.icon]} />
          </p>
          <p className="ml-4 w-[40%] ">{item.label}</p>
        </div>
      );
    }
  })
}
    </section>
 
  
  )
        }
export default LeftSideBar;

