import React, { useState,useEffect } from 'react';
import axios from 'axios';
import store from '../Store';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment, faPaperPlane, faEdit, faTrashCan, faBookmark } from '@fortawesome/free-regular-svg-icons';
import { faBookmark as faBookmarkSolid, faEllipsisV, faShare, faX, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartSolid,faUserXmark,faUserPlus } from '@fortawesome/free-solid-svg-icons';
import Loading from './Loading';
import { useDispatch, useSelector } from 'react-redux';
import { baseUrl, imgBaseUrl } from '../Constants';
import { addPosts,addLike, removeLike,addComment,deletePost} from '../Store/Slices/posts';
import { useNavigate } from 'react-router-dom';
import Comments from './Comments';
import { addSentRequests, addSingleSentReq, addToSavedPosts, removeFromSavedPosts } from '../Store/Slices';



const PostDetails = ({ post }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [showDropDown, setShowDropDown] = useState(false);
  let [userLikedPost,setUserLikedPost] = useState(false)
  const postedDate = new Date(post.createdAt);
  const currentDate = new Date();
  const timeDifferenceMillis = currentDate - postedDate;
  const formattedTimeOrDate = formatTimeOrDate(timeDifferenceMillis, postedDate);
  const dispatch = useDispatch()
  const tUser = useSelector(state => state.users)
  const [likesLength,setLikesLength] = useState(post.likes?.length)
  const [showLikedUsers,setShowLikedUsers] = useState(false)
  const [ likedUsers,setLikedUsers] = useState([]);
  const savedPosts = useSelector(state=>state.users.saved);
  const postIsSaved = savedPosts.some(savedPost => savedPost._id === post._id);
  const postUser = post.user;
  const friends = useSelector(state=>state.friendships.friends)
  const sentRequests = useSelector(state=>state.friendships.sentRequests)
  const pendinReq = useSelector(state=>state.friendships.pendingRequests)
  const navigate = useNavigate()
  const [comments,setComments] = useState(post.comments)
  const toHide = sentRequests?.some(item => item === postUser._id) ||
  friends?.some(item => item._id === postUser._id) ||
  pendinReq?.some(item => item._id === postUser._id);


  const commentsLength = comments?.length


  useEffect(() => {
    // Check if the user has liked the post when the component mounts
    const liked = post.likes.some((like) => like.user === tUser._id);
    setUserLikedPost(liked);
    
  }, [post.likes, tUser._id]);

  const handleSendFriendRequest = ()=>{
    const reqReceiverID = post.user._id;
    try{
      axios({
        method: 'POST',
        url: `${baseUrl}/friendship/sendfriendrequest/${reqReceiverID}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${store.getState().authToken.authToken}`,
        },
      })
        .then((res) => {
          if (res.status === 200) {
            dispatch(addSingleSentReq(reqReceiverID))
            toast.success('Friend request sent');
          }
        })
        .catch((err) => console.log(err));
      }
      catch (error) {
        console.log(error);
      }
    }

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    try {
      const formData = {
        content: commentContent,
        commentedBy: tUser._id,
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
          // dispatch(addComment({ post: post,formData:{_id:Date.now(),content:formData.content,user:tUser,post:post._id} }));
          setComments(prev=>[...prev,{_id:res.data._id,content:formData.content,user:tUser,post:post._id}])
          setCommentContent('');
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
          dispatch(removeLike({post:post,user:tUser._id}))
        }else{
          dispatch(addLike({post:post,user:tUser._id}))
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getLikedUsers = ()=>{
    setShowLikedUsers(true)
    try {
      axios.get(`${baseUrl}/post/getlikedusers/${post._id}`,{
      
        headers: {
          Authorization: `Bearer ${store.getState().authToken.authToken}`,
        }, 
      })
      .then(res=>{
        setLikedUsers(res.data)
      })
    } catch (error) {
      console.log(error)
    }
  }
  

    const handleDeletePost = async (e) => {
      const deletePostId = post._id;
    
      try {
        const response = await axios({
          method: 'DELETE',
          url: `${baseUrl}/post/deletepost/${deletePostId}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${store.getState().authToken.authToken}`,
          },
        });
    
        if (response.status === 200) {
          dispatch(deletePost({post:post}))
          toast("Post deleted successfully")
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        // Handle errors
      }
    };

    const removeFromsavedPosts = ()=>{
      try {
        axios.post(`${baseUrl}/post/removesavedpost/${post._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${store.getState().authToken.authToken}`,
          }, 
        })
        .then(res=>{
          dispatch(removeFromSavedPosts({postId:post._id}))
        })
        .catch(error=>{
          console.log(error)
        })
      } catch (error) {
        
      }
    }

    const addTosavedPosts = ()=>{
      try {
        axios.post(`${baseUrl}/post/addsavedpost/${post._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${store.getState().authToken.authToken}`,
          }, 
        })
        .then(res=>{
          dispatch(addToSavedPosts({postId:post._id}))
        })
        .catch(error=>{
          console.log(error)
        })
      } catch (error) {
        
      }
    }

  const postedUserId = postUser._id;
  return (
    <React.Fragment>
    <div key={post._id} className='mt-2 p-3 mb-2 border border-solid  lg:w-[100%] rounded-md'>
      {
        showLikedUsers && 
      <div className="fixed flex flex-col top-1/2 left-1/2 text-white transform -translate-x-1/2 -translate-y-1/2 p-4 w-[80%] lg:w-[25%] h-[50vh] bg-black">
        <div className='flex h-[8%] justify-end items-center'>
          <FontAwesomeIcon onClick={()=>setShowLikedUsers(false)} className='text-[24px] text-red-500 cursor-pointer' icon={faXmark} />
        </div>
        <h2 className='h-[8%] font-semibold text-[18px] '>Likes</h2>
        <div className='h-[84%] overflow-y-scroll'>
          {
            likedUsers?.length > 0 ?
            likedUsers.map(like=>{
              const user = like.user
              return(
                <div key={user._id} className='w-full flex items-center gap-3 p-1 mt-1 border border-slate-700 rounded-md'>
                  <img className='h-12 w-12 rounded-full object-cover' src={`${imgBaseUrl}${user.avatar}`} />
                  <p onClick={()=>navigate(`/user/userprofile/${user._id}`)} className='font-semibold hover:underline cursor-pointer'>{user.username}</p>
                </div>
              )
            })
            : <p className='text-[18px] font-bold text-center'>No Likes</p>
          }
        </div>
      </div>

      }
    <div className='w-full flex flex-1 justify-start items-center gap-2 pb-2 border-b border-solid'>
    {postUser?.avatar && (
      <img className='h-12 w-12 rounded-full object-cover bg-center' src={`${imgBaseUrl}${postUser.avatar}`} alt={postUser.username} />
    )}
      <div className='flex flex-1 flex-col justify-center  w-[10%]'>
        <div className='flex justify-start items-start gap-3'>
          <div className='flex flex-col justify-center items-start'>
            <p onClick={()=>navigate(`/user/userprofile/${postUser._id}`)} className='font-semibold text-[17px] cursor-pointer hover:underline'>{postUser.username }</p>
            <small className=' text-[10px] font-thin'>{formattedTimeOrDate}</small>
          </div>
          {
          postUser._id !== tUser._id 
          ?
          <div className='cursor-pointer ml-1'>
          {toHide ? <></> : <label  onClick={handleSendFriendRequest} id={postedUserId} className='text-gray-600 cursor-pointer text-[12px] p-1 pb-4'><FontAwesomeIcon icon={faUserPlus} /></label>}
        </div>
        :
        <></>
          
          }
        </div>
      </div>
      <div>
      {
      postUser._id === tUser._id ?
        <div className='flex justify-end'> <p onClick={()=>{setShowDetails(!showDetails)}} className='cursor-pointer'>{showDetails ?<FontAwesomeIcon className='text-red-500 cursor-pointer' icon={faXmark}/> :<FontAwesomeIcon  icon={faEllipsisV} />}</p> 
        </div>
        : <></>
      }
          <div className='flex flex-col'>
          {showDetails && <div className='flex mt-2 flex-col p-2 z-10 divide-y divide-gray-400 hover:divide-y-8' >
            <ul className='z-10 mt-2 origin-top-right divide-y rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1"'>
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
            <div className='m-1 p-1 lg:w-full flex flex-1 gap-7 items-center'>
              {/* Like Button */}
              <div className='flex flex-col items-center'>
                <div className='flex justify-center items-center '>
                  <div onClick={handleLike} className='cursor-pointer'>{userLikedPost ?  <FontAwesomeIcon className='text-red-500' icon={faHeartSolid} /> : <FontAwesomeIcon  icon={faHeart} />} </div>
                  <small className='ml-1'>{likesLength}</small>
                </div>
                <small onClick={getLikedUsers} className='hover:underline cursor-pointer'>Likes</small>
              </div>
              {/* Comment Button */}
              <div className='flex flex-col items-center'>
                <div className='flex justify-center items-center'>
                  <div onClick={()=>setShowDropDown(!showDropDown)} className='cursor-pointer'><FontAwesomeIcon icon={faComment} /></div>
                  <small className='ml-1'>{commentsLength}</small>
                </div>
                <small>Comments</small>
              </div>
              {/* Saved Button */}
              <div className='ml-auto mr-4 flex justify-center items-center'>
                {
                  postIsSaved ? 
                  <FontAwesomeIcon onClick={removeFromsavedPosts} className='cursor-pointer text-blue-600' icon={faBookmarkSolid} />
                  :
                  <FontAwesomeIcon onClick={addTosavedPosts} className='cursor-pointer ' icon={faBookmark} />
                }
              </div>
            </div>
            {showDropDown && 
              <div className='p-2 w-full overflow-y-scroll'>
                <form onSubmit={handleCommentSubmit}>
                  <input className='w-[80%] p-2 outline-none border border-1 border-slate-200' onChange={(e)=>{setCommentContent(e.target.value)}} value={commentContent} placeholder='Add a comment..' type='text' />
                  <input className='w-[10%] p-1 m-2 cursor-pointer bg-[#FF6666] text-white rounded-md' type='submit' value={"Post"}/>
                </form>
                <h2 className='m-1 font-bold'>Comments</h2>
                <div className='w-full max-h-[350px] overflow-y-scroll overflow-x-hidden'>
                {comments && comments.map(comment =>(
                  <Comments key={comment._id} comment={comment} post={post} setComments={setComments} />
                ))}
              </div>
            </div>
            }
      </div>
      {/* <div className='h-[1px] bg-slate-200'></div> */}
    </React.Fragment>
    
  );
};

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

const Posts = ({posts}) => {
 
  const loading = useSelector((state) => state.loading.loading);

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="w-full p-1 md:p-3 lg:p-1  md:[100%] lg:w-[80%] mt-20 md:mt-2 overflow-hidden mb-10">
      {posts.map((post) => (
        <PostDetails key={post._id} post={post} />
      ))}
    </section>
  );
};

export default Posts;
