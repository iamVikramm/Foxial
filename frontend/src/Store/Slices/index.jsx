import { addUser ,updatePrivacy,removeFromSavedPosts,addToSavedPosts,addSavedPosts} from "./userSlice";
import { addToken } from "./authTokenSlice"; 
import { addPosts,addLike,removeLike,addComment,deletePost,addSinglePosts,addUserPosts,addCommentLike,removeCommentLike} from "./posts";
import { setLoading } from "./loading";
import { addFriend,addPendingRequests,addSingleSentReq,addNonfriends,addSentRequests,removeNonfriends,removePendingRequests,addSingleFriend,unFriend } from "./userFriendships";
import { addChats,addMessages,addSingleMessage } from "./chats";

export {addToken,addUser,addPosts,setLoading,addFriend,addPendingRequests,addLike,removeLike
    ,addComment,deletePost,addSinglePosts,addNonfriends,addSentRequests,addUserPosts,
    removeNonfriends,removePendingRequests,addSingleFriend,addChats,addMessages,addSingleMessage,addSingleSentReq,
    addCommentLike,removeCommentLike,unFriend,updatePrivacy,addToSavedPosts,removeFromSavedPosts,addSavedPosts
}