import React from 'react'
import { bottomBarLinksHome, iconsDataHome, imgBaseUrl } from '../Constants'
import { useLocation, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import store from '../Store'
import { useSelector } from 'react-redux'

const BottomBar = () => {
    const {pathname} = useLocation()
    const bottomBarLinks = bottomBarLinksHome()
    const data = iconsDataHome;
    const user = useSelector(state=>state.users)
    const navigate = useNavigate()

  return (
    <div className='fixed block lg:hidden w-full bg-white border-t bottom-0 shadow-xl'>
        <div className='w-full p-1 flex justify-around items-center'>
            {
                bottomBarLinks.map(item=>{
                    const isActive = pathname.includes(item.route);
                    if(item.label === "Profile") {
                        return(
                            <div key={item.label} onClick={()=>navigate(item.route)} className={`${isActive ? "text-[#FF6666]" : "text-gray-700"} flex flex-col p-1  justify-evenly items-center gap-1`}>
                                <img className='h-8 w-8 rounded-full object-cover' src={`${imgBaseUrl}${user.avatar}`} />
                            </div>
                            ) 
                    } 
                else{
                    return(
                        <div key={item.label} onClick={()=>navigate(item.route)} className={`${isActive ? "text-[#FF6666]" : "text-gray-700"} flex flex-col p-1  justify-evenly items-center gap-1`}>
                            <FontAwesomeIcon className='h-6' icon={data[item.icon]} />
                        </div>
                        )
                }
                })
            }
        </div>      
    </div>
  )
}

export default BottomBar
