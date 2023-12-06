import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import axios from 'axios';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTimes,faEye,faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { imgBaseUrl } from '../Constants';

const Login = () => {
  const Navigate = useNavigate()
  const[email,setEmail] = useState("");
  const[password,setPassword] = useState("");
  const[viewPassword,setViewPassword] = useState(false)
  const[errorExist,setErrorExist] = useState(false);
  const[errorMsg,setErrorMsg] = useState("")

  // Setting token to cookies
  function setCookie(name, value, minutesToExpire) {
    const date = new Date();
    date.setTime(date.getTime() + (minutesToExpire *60 *1000 *60 *24 *3)); // Calculate expiration date
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; path=/`;
  }

  
  // Handle Submit
  const handleSubmit = (e)=>{
    e.preventDefault()
    const user = {
      "email":email,
      "password":password
    }
    axios.post(`${imgBaseUrl}/foxial/auth/user/login`,user)
    .then((res)=>{
      if(res.status === 200){
        const token = res.data?.authToken?.token;
        setCookie('foxialAuthToken', token, 1);
        toast.success("Logged in Successfully")
        setErrorExist(false);
        setErrorMsg("")
        setEmail("");
        setPassword("");
        Navigate("/")
      }
    }
    )
    .catch((err)=>{
      setErrorExist(true)
      setErrorMsg(err?.response?.data?.message)
      toast.error(err?.response?.data?.message)
      console.log("Error::",err)
    })
  }



  return (
    <section className='h-[100vh] w-full bg-white flex felx-1 flex-row justify-center lg:flex-row overflow-hidden'>
      <div className='p-6 hidden lg:block lg:w-[60%] h-[100%] bg-LoginPageArt bg-no-repeat bg-contain bg-center'></div>

      <div className='p-3 lg:w-[40%] lg:h-[100%] text-center flex flex-col gap-4 lg:gap-8 justify-center items-center'>
        <div className='p-3 w-[100%] flex justify-center items-center text-center'>
          <div className='p-2 h-[100%] w-[100%] text-center flex  flex-1 flex-col justify-center items-start'>
            <div className='w-full flex justify-center items-center'>
              <h2 className='text-[24px] xl:text-[40px] font-bold'>Welcome back, to <span className='leading-10 text-[#FF6666]'>Foxial</span></h2>
            </div>
            <div className='w-full flex justify-center items-center'>
              <p className='mt-4'>Your social world, one login away. Step back into the vibrant community of foxial, where connections are rekindled, and new ones are forged every day. Login to continue</p>
            </div>
          </div>
        </div>
        
        <div className='w-full md:w-[70%] p-3'>
        <>{errorMsg ?<small className='text-red-500 bg-black p-3 font-bold'><label onClick={()=>{setErrorExist(false),setErrorMsg("")}} className='p-2 font-bold cursor-pointer'><FontAwesomeIcon className='font-bold' icon={faTimes} /></label>{errorMsg}</small>:<></>}</>
            <form className=' rounded-lg p-1 xl:p-5 pl-5 pr-5 h-full w-full flex flex-col justify-center items-center gap-1' onSubmit={handleSubmit}>
              <div className='w-full p-2 flex flex-1 flex-col justify-center gap-2 '>
                <input value={email} onChange={(e)=>{setEmail(e.target.value)}} className={`w-full border outline-none  p-2 rounded-md text-[14px] ${errorExist ? "border-red-500":"border-gray-200"}`} type='Email' placeholder='Enter Email'></input>
              </div>
              <div className={`w-[95%] border rounded-md flex flex-1 items-center gap-2 ${errorExist ? "border-red-500":"border-gray-200"}`}>
                  <input value={password} onChange={(e)=>{setPassword(e.target.value)}} className={`w-full outline-none p-2 rounded-md text-[14px]`} type={viewPassword ? 'text' : 'password'} placeholder='Enter Password'></input>
                  {
                    viewPassword ? 
                    <label onClick={()=> setViewPassword(!viewPassword)} className='p-2 font-bold cursor-pointer'><FontAwesomeIcon className='font-bold text-[12px]' icon={faEyeSlash} /></label>
                     :<label onClick={()=> setViewPassword(!viewPassword)} className='p-2 font-bold cursor-pointer'><FontAwesomeIcon className='font-bold text-[12px]' icon={faEye} /></label>
                  }
              </div>
            
              <button className='bg-black mt-6 text-white p-2 rounded-md w-[60%] text-[14px] md:text-[16px]' type='Submit'>Submit</button>
              <div className='w-[150%] text-center mt-2'>
                <p className='p-2 text-[14px] md:text-[16px]'>Don't have an Account? &nbsp;<Link to={"/auth/signup"}><button className='mt-3 p-1 rounded-lg bg-[#FF6666] text-white w-[20%] text-[14px] md:text-[16px]'>Sign Up</button></Link></p>
              </div>
            </form>
        </div>
      </div>
    </section>
  )
}

export default Login


