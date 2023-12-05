
import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEllipsis, faEllipsisV, faPaperPlane, faTrashCan, faUserPlus, faX, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import { faComment, faHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { baseUrl, imgBaseUrl } from '../Constants';
import axios from 'axios';
import store from '../Store';
import { useDispatch, useSelector } from 'react-redux';
import { addComment, addLike, removeLike } from '../Store/Slices';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { BottomBar } from '../Components';

const SinglePost = (props) => {

    const user = JSON.parse(sessionStorage.getItem('user'));
    const post = props.post
    const postUser = post.user;
    const [showDetails, setShowDetails] = useState(false);
    const[userLikedPost,setUserLikedPost] = useState(post.likes.find(l=>l.user._id === user._id));
    const dispatch = useDispatch()
    const [likesLength,setLikesLength] = useState(post.likes.length)
    const [showDropDown, setShowDropDown] = useState(false);
    const [comments,setComments] = useState(post.comments);
    const [commentsLength,setCommentsLength] = useState(post.comments?.length)
    const [commentValue,setCommentValue] = useState("")
    const friends = useSelector(state=>state.friendships.friends)
    const sentRequests = useSelector(state=>state.friendships.sentRequests)
    const pendinReq = useSelector(state=>state.friendships.pendingRequests)
    const navigate = useNavigate()
    const toHide = sentRequests?.some(item => item._id === postUser._id) ||
    friends?.some(item => item._id === postUser._id) ||
    pendinReq?.some(item => item._id === postUser._id);

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
    <React.Fragment>
    <div key={post._id} className='w-full h-full mt-2 p-3 mb-2 border border-solid  md:w-[100%] rounded-md'>
    <div className='w-full flex flex-1 justify-start items-center gap-2 pb-2 border-b border-solid'>
    {postUser?.avatar && (
      <img className='h-12 w-12 rounded-full object-cover bg-center' src={`${imgBaseUrl}${postUser.avatar}`} alt={postUser.username} />
    )}
      <div className='flex flex-1 flex-col justify-center  w-[10%]'>
        <div className='flex justify-start items-start gap-3'>
          <div className='flex flex-col justify-center items-start'>
            <p onClick={()=>navigate(`/user/userprofile/${postUser._id}`)} className='font-semibold text-[17px] cursor-pointer'>{postUser.username }</p>
            <small className=' text-[10px] font-thin'>{formattedTimeOrDate}</small>
          </div>
          {
          postUser._id !== user._id 
          ?
          <div className='cursor-pointer ml-1'>
          {toHide ? <></> : <label  onClick={handleSendFriendRequest} id={postUser._id} className='text-gray-600 cursor-pointer text-[12px] p-1 pb-4'><FontAwesomeIcon icon={faUserPlus} /></label>}
        </div>
        :
        <></>
          
          }
        </div>
      </div>
      <div>
      {
      postUser._id === user._id ?
        <div className='flex justify-end'> <p onClick={()=>{setShowDetails(!showDetails)}} className='cursor-pointer'>{showDetails ?<FontAwesomeIcon className='text-red-500 cursor-pointer' icon={faXmarkCircle}/> :<FontAwesomeIcon  icon={faEllipsisV} />}</p> 
        </div>
        : <></>
      }
          <div className='flex flex-col'>
          {showDetails && <div className='flex mt-2 flex-col p-2 z-10 divide-y divide-gray-400 hover:divide-y-8' >
            <ul className='z-10 mt-2 origin-top-right divide-y rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1"'>
              <li className='hover:bg-[#FF6666] flex justify-start cursor-pointer items-center hover:text-white  p-2 text-gray-700'> <label><FontAwesomeIcon className='mr-2' icon={faEdit} /></label>Edit</li>
              <li id={post._id} onClick={handleDeletePost} className='p-2 hover:bg-[#FF6666] flex justify-start hover:text-white  cursor-pointer items-center text-gray-700'> <label className=''><FontAwesomeIcon className='mr-2' icon={faTrashCan} /></label>Delete</li>
            </ul>
          </div> }
          </div>
        </div>
      </div>
          {post?.content &&(            
            <div className={`${post?.image ?"max-h-[100px] md:max-h-[150px]  mt-4 pb-2" :"max-h-[500px]"} mt-1 break-words w-full p-1 overflow-y-auto`}>
              <p className='h-full text-[14.5px]'>{post.content}</p>
            </div>)}
            {post?.image && (      
            <div className='w-full mt-1'>
              <img className='h-[350px] md:h-[450px] object-scale-down w-full' src={`${imgBaseUrl}${post.image}`} alt='Post Image' />
            </div>)}
            {/* Like,Comments and Share Buttons */}
            <div className='m-1 p-1 w-[65%] md:w-[40%] flex flex-1 gap-7 items-center'>
              {/* Like Button */}
              <div className='flex flex-col items-center'>
                <div className='flex justify-center items-center '>
                  <div onClick={handleLike} className='cursor-pointer'>{userLikedPost ?  <FontAwesomeIcon className='text-red-500' icon={faHeartSolid} /> : <FontAwesomeIcon  icon={faHeart} />} </div>
                  <small className='ml-1'>{likesLength}</small>
                </div>
                <small>Likes</small>
              </div>
              {/* Comment Button */}
              <div className='flex flex-col items-center'>
                <div className='flex justify-center items-center'>
                  <div onClick={()=>setShowDropDown(!showDropDown)} className='cursor-pointer'><FontAwesomeIcon icon={faComment} /></div>
                  <small className='ml-1'>{commentsLength}</small>
                </div>
                <small>Comments</small>
              </div>
              {/* Share Button */}
              <div className='flex flex-col items-center'>
                <div className='cursor-pointer'><FontAwesomeIcon icon={faPaperPlane} /></div>
                <small>Share</small>
              </div>
            </div>
            {showDropDown && 
                <div className='p-2 w-full max-h-[350px] overflow-y-scroll'>
                <form onSubmit={handleCommentSubmit}>
                  <input className='p-2 outline-none border border-1 border-slate-200' onChange={(e)=>{setCommentContent(e.target.value)}} value={commentContent} placeholder='Add comment..' type='text' />
                  <input type='hidden' value={post._id} />
                  <input className='p-1 m-2 cursor-pointer bg-black text-white rounded-md' type='submit'/>
                </form>
                {comments && comments.map(comment =>{ return(
              
                  <div key={comment._id} className=' p-4 pt-2 pb-2 mt-2 flex flex-col w-full justify-start items center'>
                    <div className=''>
                      {comment.user.username}
                    </div>
                    <div>
                      {comment.content}
                    </div>
              </div>
              )})}
            </div>
            }
      </div>
    </React.Fragment>
  )
}

export default SinglePost
