import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify'; 
import { Link,useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTimes,faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"

const SignUp = () => {
  const Navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const[pswNotMinChar,setPswNotMinChar] = useState(false);
  const[viewPassword,setViewPassword] = useState(false)
  const[validPsw, setValidPsw] = useState(false)
  const[pswMatch,setPswMatch] = useState(true);

  useEffect(()=>{
    if(formData.password === formData.confirmPassword){
      setPswMatch(true)
    }else{
      setPswMatch(false)
    }
  },[formData.confirmPassword,formData.password])

 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'password') {
      // Check if the password has at least 8 characters
      if (value.length >= 8 ) {
        setPswNotMinChar(false);
        setValidPsw(true)
        setFormData({
          ...formData,
          [name]:value,
        })

      } else {
        setPswNotMinChar(true);
        setFormData({
          ...formData,
          [name]:value,
        })
      }
    }else{
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  }

  const handleGoogleSignUp = ()=>{
      axios.post("http://localhost:8080/auth/signup")
      .then((res)=>{console.log(res);
        if(res.status === 200){
          const token = res.data?.authToken?.token;
          setCookie('foxialAuthToken', token, 1);
          toast.success("Logged in Successfully")
          Navigate("/")
        }
      }
      )
      .catch((err)=>{
        toast.error(err?.response?.data?.message)
        console.log("Error::",err)
      })
    
  }



  const handleSubmit = async(e)=>{
    e.preventDefault();
    axios.post('http://localhost:8080/foxial/auth/signup',formData)
    .then((response) => {
      console.log('User signed up:', response);
      // Reset the input fields on successful signup
      if(response.status === 200){
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
        toast.success("User created successfully, Login to continue",{
          autoClose:3000
        })
        Navigate("/auth/login")
      }
    })
    .catch(error => {
      // Handle errors
      toast.error(error?.response?.data?.message,{
        autoClose:3000
      })
      console.error('Error:', error);
    });
    
  }

  return (
    <section className='h-[100vh] bg-white w-full flex felx-1 flex-row justify-center items-center lg:flex-row overflow-hidden'>
      <div className='p-6 hidden xl:block lg:w-[60%] h-[100%] bg-SignUpPageArt bg-no-repeat bg-contain bg-center'></div>

      <div className='p-3 xl:w-[40%] xl:h-[100%] bg-[#]  flex flex-col items-center'>
        <div className='p-3 w-[100%] text-center'>
          <div className='p-2 w-[100%] text-center flex flex-col  items-center'>
            <h2 className='text-[24px] m-0 xl:text-[50px] leading-10 font-bold text-[#FF6666]'>Foxial</h2>
            <small className='mt-4'>Your Social life, elevated.</small>
          </div>
          <p className='mt-8 font-bold lg:text-[20px] text-[#FF6666]'>Join our Community by signing up</p>
        </div>
        <div className='w-[120%] xl:w-[85%] p-3'>
            <form className=' rounded-lg p-1 xl:p-5 pl-5 pr-5 h-full w-full flex flex-col justify-center items-center gap-2' onSubmit={handleSubmit}>
            <div className='w-[80%] p-2 flex flex-1 flex-col justify-center gap-1 '>
                <p className='font-semibold pl-2'>Username:</p>
                <input className='w-full border-b-2 outline-none p-2 rounded-md' required name="username" type='username' placeholder='Enter Username' value={formData.username} onChange={handleInputChange}></input>
              </div>
              <div className='w-[80%] p-2 flex flex-1 flex-col justify-center gap-1 '>
                <p className='font-semibold pl-2'>Email:</p>
                <input className='w-full border-b-2 outline-none p-2 rounded-md' required name="email" type='Email' placeholder='Enter Email' value={formData.email} onChange={handleInputChange}></input>
              </div>
              <div className='w-[80%] p-2 flex flex-1 flex-col justify-center items-start gap-1 '>
                <p className='font-semibold pl-2'>Password:</p>
                <div className='flex flex-1 bg-white rounded-md w-[100%]  border-b-2 '> 
                  <input value={formData.password} onChange={handleInputChange} className={`w-full outline-none p-2 rounded-md `} type={viewPassword ? 'text' : 'password'} placeholder='Enter Password'></input>
                  {
                    viewPassword ? 
                    <label onClick={()=> setViewPassword(!viewPassword)} className='p-2 font-bold cursor-pointer'><FontAwesomeIcon className='font-bold' icon={faEyeSlash} /></label>
                     :<label onClick={()=> setViewPassword(!viewPassword)} className='p-2 font-bold cursor-pointer'><FontAwesomeIcon className='font-bold' icon={faEye} /></label>
                  }
                </div>
                {pswNotMinChar ? <small className='px-2 text-red-500'><label className='font-bold cursor-pointer'><FontAwesomeIcon icon={faTimes} /></label> Password should be minimum 8 characters</small>:<></>}
         
              </div>
              <div className='w-[80%] p-2 flex flex-1 flex-col justify-center items-start gap-1 '>
                <p className='font-semibold pl-2'>Confirm Password:</p>
                <input className={`w-full border-b-2 p-2 rounded-md outline-none ${pswMatch && formData.confirmPassword?.length > 0 ? "border-green-500" :"border-gray-200"}`} type='Password' name="confirmPassword" required placeholder='Confirm Password' value={formData.confirmPassword} onChange={handleInputChange}></input>
                {pswMatch ? <></> : (<small className='px-2  text-red-500'><label className='font-bold cursor-pointer'><FontAwesomeIcon icon={faTimes} /></label> Passwords do not match</small>)}
              </div>
              <button className='bg-black p-2 rounded-md w-[70%] text-white' onClick={handleSubmit} type='Submit'>Submit</button>
              <div className='w-[150%] text-center'>
                <p>Already have an Account? <Link to={"/auth/login"}><button className='mt-3 p-1 rounded-lg bg-[#FF6666] w-[20%]'>Log in</button></Link></p>
              </div>
            </form>
        </div>
      </div>
    </section>
  )
}

export default SignUp


