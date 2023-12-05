import React, { useState } from 'react'
import { baseUrl, imgBaseUrl } from '../Constants'
import store from '../Store'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faEllipsisV, faX,  } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartSolid, } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { addCommentLike, removeCommentLike } from '../Store/Slices';

const Comments = (props) => {
    const user = store.getState().users
    const {comment,post,setComments} = props
    const [showCommentDetails,setShowCommentDetails] = useState(false)
    const [commentLikes,setCommentLikes] = useState(comment.likes)
    const [userLikedComment, setUserLikedComment] = useState(() => {
        // Use a function to determine the initial state
        return commentLikes.some((like) => like.user === user._id);
      });
    const [commentLikesLength,setCommentLikesLength] = useState(comment.likes?.length)
    const dispatch = useDispatch()

    const handleCommentDelete = (e)=>{
        const commentId = e.currentTarget.id;
        const postId = post._id;
        try {
            axios.delete(`${baseUrl}/comment/deletecomment`,{
                data:{commentId,postId},
                headers:{
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${store.getState().authToken.authToken}`,
                }
            }).then(res=>{
                if(res.status === 200){
                    setComments(prev => prev.filter(c=>c._id !== commentId));
                    setShowCommentDetails(false);
                }
            })
        } catch (error) {
            console.log(err)
        }
    }

    const handleCommentLike = async () => {
        if(userLikedComment){
          setCommentLikesLength(prev=>prev-1)
          setCommentLikes((prev) =>  {return prev.filter((u) => u.user !== user._id)});
          setUserLikedComment(false);
        }else{
          setCommentLikesLength(prev=>prev+1)
          setCommentLikes(prev=>[...prev,{user:user._id}])
          setUserLikedComment(true)
        }
        try {
          const res = await axios({
            method: 'POST',
            url: `${baseUrl}/like/toggle/?id=${comment._id}&type=Comment`,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${store.getState().authToken.authToken}`,
            },
          });
    
          if (res.status === 200) {
            console.log(res)
            const likeExist = res.data.data.deleted;
            if(likeExist){
              dispatch(addCommentLike({postId:post,userId:user._id,commentId:comment._id}))
            }else{
              dispatch(removeCommentLike({postId:post,userId:user._id,commentId:comment._id}))
            }
          }
        } catch (error) {
          console.log(error);
        }
      };


  return (
              
        <div key={comment._id} className='p-2 m-1 flex flex-1 w-full overflow-y-scroll items-start gap-1 text-[14.5px]'>
          <div className='flex items-center gap-1 min-w-max '>
            <img className='rounded-full object-cover h-8 w-8' src={`${imgBaseUrl}${comment.user.avatar}`} />
            <p className='hover:underline cursor-pointer font-bold '>{comment.user.username}</p>
          </div>
          <div className='flex items-center pt-[5.5px] overflow-x-auto '>
            <p className=' overflow-x-auto flex-wrap break-words'>{comment.content}</p>
          </div>
          {
            comment.user._id === user._id || post.user._id === user._id ? (
              <div className='w-[2%] flex items-center justify-end flex-col ml-auto'>
                {showCommentDetails ? <FontAwesomeIcon onClick={()=>setShowCommentDetails(false)} className='text-red-500 cursor-pointer' icon={faX} /> : <FontAwesomeIcon onClick={()=>setShowCommentDetails(true)} className='cursor-pointer' icon={faEllipsisV} />}
                {showCommentDetails && <div className='flex flex-col p-2 z-10 divide-y mr-20 divide-gray-400 hover:divide-y-8' >
  <ul className='z-10 mt-2 origin-top-right divide-y rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1"'>
    <li id={comment._id} onClick={handleCommentDelete} className='p-2 hover:bg-[#FF6666] flex justify-start hover:text-white  cursor-pointer items-center text-gray-700'> <label className=''><FontAwesomeIcon className='mr-2' icon={faTrashCan} /></label>Delete</li>
  </ul>
</div> }
              </div>
              
            ):(userLikedComment ? (<div className='ml-auto flex items-center'><FontAwesomeIcon onClick={handleCommentLike} className=' p-2 cursor-pointer text-red-500' icon={faHeartSolid} /><p className='text-[12px]'>{commentLikesLength}</p></div>) : (<div className='ml-auto flex items-center '><FontAwesomeIcon onClick={handleCommentLike} className=' cursor-pointer ml-auto p-2' icon={faHeart} /><p className='text-[12px]'>{commentLikesLength}</p></div>))
          }
        </div>

  )
}

export default Comments
