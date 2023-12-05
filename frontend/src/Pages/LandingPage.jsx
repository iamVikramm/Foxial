import React, { useEffect } from 'react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faBolt} from "@fortawesome/free-solid-svg-icons"
import { faTwitter, faInstagram, faFacebook, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import { Link, useNavigate } from 'react-router-dom'

const LandingPage = () => {
    const Navigate = useNavigate();
    
    const handleLogin = ()=>{
        Navigate("/auth/login")
    }

    const handleSignUp = ()=>{
        Navigate("/auth/signup")
    }

  return (
    <div className='landing-page'>
        <section className='bg-white h-[100vh]'>
            <nav className='w-full h-[10vh] text-black md:h-16 p-4 pr-5 md:pr-10 flex  justify-around items-center'>
                <div className='h-full'>
                    <div className='h-full ml-3 md:ml-8 flex flex-1 justify-center items-center gap-1'>
                        <img  className='h-14 hidden md:block cursor-pointer' src='../../../assets/images/foxial_name_logo.png' />
                        <img  className='block sm:hidden h-14 cursor-pointer' src='../../../assets/images/foxial-logo.png' />
                    </div>
                </div>
                <ul className='flex flex-1 justify-end ap-3 md:gap-6 '>
                    <li onClick={handleLogin}  className='p-2 text-[#FF6666] hover:text-black cursor-pointer font-semibold'>Log in</li>
                    <li onClick={handleSignUp} className='p-2  text-[#FF6666] hover:text-black cursor-pointer font-semibold'>Sign Up</li>
                </ul>
            </nav>
            <div className='bg-[#FF6666] h-[92.5vh] flex flex-1 justify-center items-center'>
                 <div className='border-8 border-[#FF8989] h-80 w-80 md:h-[500px] md:w-[800px] bg-white '>
                     <div className='p-2 h-80 w-75 text-[#FF6666]  md:h-[500px] md:w-[800px] flex flex-1 flex-col justify-center items-center gap-4'>
                         <h1 className='text-[80px] md:text-[170px] font-[Teko] ' >FOXIAL</h1>
                         <small className='font-semibold'>Your Social Life, Elevated</small>
                     </div>
                 </div>
            </div>
        </section>


        {/* Login and signup section */}

        <section className='h-[100vh] text-[#FF6666]'>
            <div className='h-[60%] p-5 flex flex-1 justify-center items-center flex-col '>

                <div className='h-[100%] mt-2 w-[95%] flex flex-1 justify-center items-center flex-col gap-10'>
                    <FontAwesomeIcon icon={faBolt} className='text-[80px]' />
                    <div className='w-[100%]'>
                        <h2 className='m-0 font-bold text-center text-[20px] md:text-[38px]'>Ready to dive into social waves? Don't be shy!</h2>
                        <div className='w-[100%] mt-10 flex flex-1 flex-col md:flex-row justify-center items-center gap-5'>
                            <button onClick={handleLogin} className='bg-[#FF6666] text-black p-2 md:w-28 w-[100%] hover:bg-[#FCAEAE]'>Log in</button>
                            <button onClick={handleSignUp}className='bg-[#FF6666] text-black p-2 md:w-28 w-[100%] hover:bg-[#FCAEAE]'>Sign Up</button>
                        </div>
                    </div>
                </div>
                
            </div>
            <div className='flex mt-4 p-8 flex-col h-[35%] w-[100%]'>
                <div className='md:flex flex-1 md:justify-around'>
                    <div>
                        <h2 className='text-[20px] md:text-[30px] text-[#FF6666] font-bold font-[League-Gothic]'>Why join the party?</h2>
                    </div>
                    <div className='mt-4 md:w-[40%] md:text-[20px] '>
                        <p>With millions of users sharing their thoughts, ideas, and creativity, our platform has become the ultimate digital hangout. Connect with old pals, make new friends, and indulge in the endless scroll of entertainment.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Pictures section */}
        <section className='h-[120vh] md:h-[70vh] bg-[#FF6666] pt-6 pb-6 text-white '>
            <div className='h-[100%] flex flex-1 flex-col justify-center items-center md:flex-row md:justify-center md:items-center gap-8'>
                <div className='md:h-[80%] flex flex-1 flex-col justify-center items-center md:justify-center md:items-center gap-4'>
                    <div className="bg-Phone
                        bg-no-repeat bg-cover bg-center
                        h-[60%] w-[60%] md:h-[80%] md:w-[60%] 
                    "></div>
                    <div className='w-[60%]'>
                        <h3 className='font-bold text-[18px]'>
                        Instant Connectivity
                        </h3>
                        <p className='mt-2'>Now you can connect from anywhere on the planet earth.</p>
                    </div>
                </div>
                <div className='md:h-[80%] flex flex-1 justify-center items-center flex-col md:justify-center md:items-center gap-4'>
                    <div className="bg-Friends h-[60%] w-[60%] md:h-[80%] md:w-[60%] bg-no-repeat bg-cover bg-center"></div>
                    
                    <div className='w-[60%] '>
                        <h3 className='font-bold text-[18px]'>
                            Create & Share
                        </h3>
                        <p className='mt-2'>Capture the moments that matter, and spread the love with single tap.</p>
                    </div>
                </div>
            </div>
        </section>
        {/* Footer */}
        <section className='h-[30vh] text-[#FF6666] w-[100%] p-6 md:flex md:flex-col md:justify-center md:items-center'>
            <div className='h-[50%] md:w-[60%]'>
                <h3 className='text-[#FF6666] font-bold text-[18px] md:text-[24px]'>Privacy Matters</h3>
                <p className='text-[#FF6666]'>We respect your space.</p>
            </div>
            <div className=' h-[50%] md:w-[60%] flex flex-1 flex-col items-center justify-center gap-3 md:flex-row md:items-end md:justify-between pr-3 pl-3'>
                <div className=' w-[50%]'><small>© 2023 Frolic, Inc.</small></div>
                <div className=' h-[50%] flex flex-row flex-1 gap-4 justify-center md:justify-end items-center md:items-end'>
                    <FontAwesomeIcon icon={faTwitter} className='text-[20px]' />
                    <FontAwesomeIcon icon={faInstagram} className='text-[20px]' />
                    <FontAwesomeIcon icon={faFacebook} className='text-[20px]' />   
                    <FontAwesomeIcon icon={faLinkedin} className='text-[20px]' /> 
                </div>
            </div>
        </section>
    </div>
  )
}

export default LandingPage

