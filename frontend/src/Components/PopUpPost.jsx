import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEllipsisV, faX } from '@fortawesome/free-solid-svg-icons';
import { faComment, faHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { baseUrl, imgBaseUrl } from '../Constants';
import axios from 'axios';
import store from '../Store';
import { useDispatch } from 'react-redux';
import { addComment, addLike, removeLike } from '../Store/Slices';
import { toast } from 'react-toastify';

const PopUpPost = (props) => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const post = props.post
    console.log(post)
    const setShowPopup = props.setShowPopup;
    const showPopup = props.showPopup;
    const[userLikedPost,setUserLikedPost] = useState(post?.likes.find(l=>l.user._id === user._id));
    const dispatch = useDispatch()
    const [likesLength,setLikesLength] = useState(post.likes.length)
    const [comments,setComments] = useState(post.comments);
    const [commentsLength,setCommentsLength] = useState(post.comments?.length)
    const [commentValue,setCommentValue] = useState("")

    useEffect(() => {
      const handlePopstate = (event) => {
        // Prevent the default behavior
        event.preventDefault();
  
        // Add your custom logic here
        console.log('Popstate event prevented');
  
        // Log the event object for further analysis
        console.log(event);
      };
  
      // Add the event listener when the component mounts
      window.addEventListener('popstate', handlePopstate);
  
      // Remove the event listener when the component unmounts
      return () => {
        window.removeEventListener('popstate', handlePopstate);
      };
    }, []);

    const formatTimeOrDate = (timeDifference, postedDate) => {
        let minutes = Math.floor(timeDifference / (1000 * 60));
        const hours = Math.floor(minutes / 60);
        
        if (hours < 1) {
          if (minutes === 0) {
            minutes = 0;
          }
          return `${minutes} ${minutes === 1 ? 'min' : 'mins'} ago`;
        } else if (timeDifference < 24 * 60 * 60 * 1000) {
          return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
        } else {
          const options = { year: 'numeric', month: 'short', day: 'numeric' };
          return postedDate.toLocaleDateString('en-US', options);
        }
      };

    const postedDate = new Date(post.createdAt);
    const currentDate = new Date();
    const timeDifferenceMillis = currentDate - postedDate;
    const formattedTimeOrDate = formatTimeOrDate(timeDifferenceMillis, postedDate);
  
    useEffect(() => {
        // Check if the user has liked the post when the component mounts
        const liked = post.likes.some((like) => like.user === user._id);
        setUserLikedPost(liked);
        
      }, [post.likes, user._id]);

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        try {
          const formData = {
            content: commentValue,
            commentedBy: user._id,
            commentedOn: post._id,
          };
    
          axios({
            method: 'POST',
            url: `${baseUrl}/comment/addcomment`,
            data: formData,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${store.getState().authToken.authToken}`,
            },
          })
          .then((res) => {
            if (res.status === 200) {
            //   dispatch(addComment({ post: post,formData:{_id:Date.now(),content:formData.content,user:user,post:post._id} }));
              setComments(prev=>[...prev,{_id:Date.now(),content:formData.content,user:user,post:post._id}])
              setCommentValue('');
              toast.success('Comment added');
            }
          })
            .catch((err) => console.log(err));
        } catch (error) {
          console.log(error);
        }
      };

    const handleLike = async () => {
        if(userLikedPost){
          setLikesLength(prev=>prev-1)
          setUserLikedPost(false);
        }else{
          setLikesLength(prev=>prev+1)
          setUserLikedPost(true)
        }
        try {
          const res = await axios({
            method: 'POST',
            url: `${baseUrl}/like/toggle/?id=${post._id}&type=Post`,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${store.getState().authToken.authToken}`,
            },
          });
    
          if (res.status === 200) {
            const likeExist = res.data.data.deleted;
            if(likeExist){
              dispatch(removeLike({post:post,user:user._id}))
            }else{
              dispatch(addLike({post:post,user:user._id}))
            }
          }
        } catch (error) {
          console.log(error);
        }
      };

  return (
    <div className='w-full h-full'>
      {/* Large Scrrens */}
          <div className='hidden lg:block fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 p-2 flex flex-1 flex-col justify-center items-center z-30'>
              <div className='w-full h-[2%] flex justify-end items-center p-2'>
                <FontAwesomeIcon onClick={()=>setShowPopup(!showPopup)} className='text-[25px] cursor-pointer text-red-500' icon={faX} />
              </div>
            <div className='w-[85%] h-[95%] m-2 ml-24 bg-black text-white flex justify-center items-center'>
              <div className='h-[100%] w-full flex flex-1 justify-center items-center'>
                <div className='w-[60%] h-full p-1 flex justify-center items-center'>
                  {
                    post.image ? 
                    <img className='w-full h-full object-scale-down' src={`${imgBaseUrl}${post.image}`} /> :
                    <p>{post.content}</p>
                  }
                </div>
                <div className='w-[40%] p-1 h-full flex flex-col divide-y pl-2 divide-gray-700 '>
                    <div className=' h-[7%] flex justify-center p-1'>
                      <div className='w-[10%] flex justify-center items-center'>
                        <img className='h-10 w-10 rounded-full' src={`${imgBaseUrl}${post.user?.avatar}`} />
                      </div>
                      <div className='flex flex-col items-start justify-center w-[85%] overflow-hidden text-[14px]'>
                        <p className='pl-2 font-bold'>{post.user?.username}</p>
                        <p className='pl-2 w-full break-words text-[12px]'>{post?.content}</p>
                      </div>
                      <div className='w-[5%] flex justify-center items-center'>
                        <FontAwesomeIcon icon={faEllipsisV} />
                      </div>
                    </div>
                    <div className='h-[77%] overflow-y-scroll'>
                      {
                          commentsLength > 0 ? 
                          <div className='w-full h-full p-1 pl-3 pt-3 pb-3'>
                              <h2 className='text-[20px] font-bold mb-4'>Comments</h2>
                              {
                                  comments.map(comment=>{return(
                                      <div key={comment._id} className='flex flex-1 m-1 mb-3 items-start w-full max-h-[12%] gap-1 overflow-y-scroll'>
                                          <div className='w-[8%] h-[8%]  flex justify-center items-center'>
                                              <img className='h-7 w-7 rounded-full object-cover' src={`${imgBaseUrl}${comment.user.avatar}`} />
                                          </div>
                                          <div className='w-[80%] flex flex-1 justify-start text-[14px]'>
                                            <span className='w-[25%] font-bold'>{comment.user.username}</span>
                                            <p className='w-[75%] overflow-wrap break-words'>{comment.content}</p>
                                          </div>
                                          <div className='w-[5%]'>
                                  
                                          </div>

                                      </div>
                                  )
                                  })
                              }
                          </div>:
                          <div className='h-full w-full flex justify-center items-center'><p>No comments</p></div>
                      }
                    </div>
                    <div className='h-[10%] flex flex-col '>
                      <div className='h-[40%] w-[15%]  flex justify-center items-center'>
                          {
                              userLikedPost ? <FontAwesomeIcon className='text-red-500 w-[50%] text-[18px]' onClick={handleLike} icon={faHeartSolid} /> :
                              <FontAwesomeIcon onClick={handleLike} className='w-[50%] text-[18px]' icon={faHeart} />
                          }
                        <FontAwesomeIcon className='w-[50%] text-[18px]' icon={faComment} />
                      </div>
                      <div className='ml-3'><p className='text-[14px]'>{likesLength} <span className='font-semibold text-[14px]'>Likes</span></p></div>
                      <small className=' text-[10px] ml-3'>{formattedTimeOrDate}</small>
                    </div>
                    <form className='h-[6%] w-full' onSubmit={handleCommentSubmit}>
                    <div className='h-full w-full flex justify-center items-center'>            
                      <input onChange={(e)=>setCommentValue(e.target.value)} className='w-[85%] h-[80%] outline-none border-none p-2 overflow-x-scroll bg-black' type='text' value={commentValue} placeholder='Add a comment' />
                      <input className='w-[15%] h-[80%] p-2 hover:opacity-50 cursor-pointer' type='submit' value={"Post"} />
                    </div>
                    </form>
                </div>
              </div>
            </div>
        </div>

      {/* Mobile and Tab */}
      <div className='block lg:hidden fixed top-0 left-0 w-full h-[95vh] bg-black p-2 flex flex-col text-white'>
          <div className='mt-[70px] h-[3%] w-full'>
            <FontAwesomeIcon onClick={()=>setShowPopup(prev=>!prev)} className='text-gray-300 text-[30px]' icon={faArrowLeft} />
          </div>
          <div className='flex flex-1 flex-col mt-5'>
            <div className='h-[10%] p-2 flex flex-1 justify-start items-center gap-2'>
              <img className='w-12 h-12 rounded-full object-cover' src={`${imgBaseUrl}${post.user.avatar}`} />
              <p className='text-[15px] font-bold text-white'>{post.user.username}</p>
              {
                post.user._id === user._id && <FontAwesomeIcon className='ml-auto text-white' icon={faEllipsisV} />
              }
            </div>
            <div className='h-[40%]'>
              {
                post.image ? (
                  <div className='h-full w-full '>
                    <img className='w-full h-full object-scale-down' src={`${imgBaseUrl}${post.image}`} />
                  </div>
                ) :(
                  <div className='w-full h-full overflow-scroll flex'>
                     <p>{post.content}</p>
                  </div>
                )
              }
            </div>
            <div className='w-[20%] max-h-[10%] m-1 flex flex-1 gap-6 text-white'>
            {
                userLikedPost ? <div className='flex items-center '>
                  <FontAwesomeIcon className='text-red-500 text-[18px]' onClick={handleLike} icon={faHeartSolid} />
                  <p className='text-[10px]'>{likesLength}</p>
                  <p className='text-[10px]'>Likes</p>
                </div> :
                <div className='flex items-center '>
                  <FontAwesomeIcon onClick={handleLike} className=' text-[18px]' icon={faHeart} />
                  <p className='text-[10px] ml-2'>{likesLength}</p>
                  <p className='text-[10px] ml-1'>Likes</p>
                </div>
            }
            </div>
            <div className='max-h-[10%] pl-1 w-full overflow-hidden text-white flex gap-2'>
              <p className='font-bold'>{post.user.username}</p><p>{post.content}</p>
            </div>
            <div className='h-[30%] mt-3 text-white'>
            {
                          commentsLength > 0 ? 
                          <div className='w-full max-h-full overflow-y-scroll'>
                              <h2 className='text-[15px] m-2 font-bold'>Comments</h2>
                              {
                                  comments.map(comment=>{return(
                                      <div key={comment._id} className='flex flex-1 m-1 mb-3 items-start w-full max-h-[12%] gap-1 overflow-y-scroll'>
                                          <div className='w-[8%] h-[8%]  flex justify-center items-center'>
                                              <img className='h-7 w-7 rounded-full object-cover' src={`${imgBaseUrl}${comment.user.avatar}`} />
                                          </div>
                                          <div className='w-[80%] flex flex-1 justify-start text-[14px]'>
                                            <span className='w-[25%] font-bold'>{comment.user.username}</span>
                                            <p className='w-[75%] overflow-wrap break-words'>{comment.content}</p>
                                          </div>
                                          <div className='w-[5%]'>
                                  
                                          </div>

                                      </div>
                                  )
                                  })
                              }
                          </div>:
                  <div className='h-full w-full flex justify-center items-center'><p>No comments</p></div>
                      }
            </div>
          </div>
      </div>
    </div>

  )
}

export default PopUpPost
