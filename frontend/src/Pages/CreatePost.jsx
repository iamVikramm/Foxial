import React, { useState } from 'react'
import axios from 'axios';
import {BottomBar, Commercial, LeftSideBar, Loading, Navbar} from "../Components/index.jsx"
import store from '../Store/index.jsx';
import { addPosts,addSinglePosts } from '../Store/Slices/posts.jsx';
import { toast } from 'react-toastify';
import { useSelector,useDispatch } from 'react-redux';
import { baseUrl, imgBaseUrl } from '../Constants/index.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faX } from '@fortawesome/free-solid-svg-icons';

const CreatePost = () => {
    const loading = useSelector(state=> state.loading.loading)
    const user = store.getState().users
    const dispatch = useDispatch()
    const[inputValue,setInputValue] = useState("")
    const[file,setFile] = useState()

    
      const handleSubmit = (e) => {
        e.preventDefault(); // Prevent the default form submission
        const formData = new FormData()
        formData.append('content',inputValue);
        formData.append('image',file)
    
        axios({
          method: 'POST',
          url: `${baseUrl}/post/addpost`,
          data:formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${store.getState().authToken.authToken}`,
          },
        }).then(res=>{
          const newPost = {...res.data.addedPost,user}
          dispatch(addSinglePosts({post:newPost}));
          setFile(null);
          setInputValue("");
          toast.success("Post added successfully")
        }).catch(err=>console.log(err))
      }


    if(loading){
        return(
            <Loading />
        )
    }
  return (
    <React.Fragment >
      <Navbar />
      <section className='w-full flex justify-around'>
          <section className='md:w-[21%] p-1'><LeftSideBar /></section>
          <section className='w-full md:w-[56%] mt-24 lg:ml-[20px] '>
            <h1 className='text-[24px] font-bold'>Create Post</h1>
            <form onSubmit={handleSubmit}>
              <div className='w-full mt-4 p-2 flex flex-col justify-center items-center'>
                <input className='w-[70%] p-2 border border-solid border-gray-700' onChange={(e)=>setInputValue(e.target.value)} type='text' value={inputValue} placeholder='Description or Content' />
                <div className='flex flex-1 m-2'>
                <label name='image' htmlFor="inputfile"><FontAwesomeIcon className='cursor-pointer mr-2 text-blue-500' icon={faImage} /></label>{file?.name ? (<div  className='font-semibold '>{file.name}</div>) : (<div htmlFor="inputfile" className='font-semibold cursor-pointer'>Photo</div>)}
                  {file && (<div><button onClick={()=>setFile()}><FontAwesomeIcon className='ml-2 p-1 text-red-500 text-[15px]' icon={faX} /></button></div>)}
                </div>
                <input className='hidden' onChange={(e)=>setFile(e.target.files[0])} type='file' name='image' id='inputfile'/>
                {file && (
                  <div className=' h-[350px] md:h-[450px] flex flex-col'>
                    <p>Preview</p>
                    <img className='h-[350px] md:h-[450px] object-cover w-full' src={URL.createObjectURL(file)} />
                  </div>
                )}
                <input className='p-2 mt-2 cursor-pointer bg-[#FF6666]'  type='submit' value="Post" />
              </div>
            </form>
          </section>
          <section className='lg:w-[23%]'><Commercial /></section>
          <BottomBar />
      </section>
    </React.Fragment>
  )
}

export default CreatePost
