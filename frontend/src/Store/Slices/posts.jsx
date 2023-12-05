import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    posts:[],
    userPosts : []
}
const postsSlice = createSlice({
    name:"posts",
    initialState:initialState,
    reducers:{
        addPosts(state,action){
            const posts = action?.payload?.posts || []
            state.posts = [...posts];
            return state;  
        },
        addSinglePosts(state,action){
          const post = action?.payload?.post || []
          state.posts = [{...post},...state.posts];
          return state;  
      },
        
        deletePost(state,action){
            const post = action.payload.post;
            const updatedPosts = state.posts.filter(p=>{return p._id !== post._id})
            return {...state,posts:updatedPosts}
         },

        addLike(state, action) {
            const updatedPost = action.payload.post;
            const user = action.payload.user;
          
            // Use map to create a new array with the updated post
            const updatedPosts = state.posts.map((p) =>
              p._id === updatedPost._id ? { ...p, likes: [...p.likes, {user:user}] } : p
            );
          
            // Update the state by creating a new state object
            return { posts: updatedPosts };
          },
          removeLike(state, action) {
            const updatedPost = action.payload.post;
            const user = action.payload.user;
          
            // Use Immer to update the draft state
            const postIndex = state.posts.findIndex((p) => p._id === updatedPost._id);
            if (postIndex !== -1) {
              state.posts[postIndex].likes = state.posts[postIndex].likes.filter((like) => like.user !== user);
            }
          },
          addCommentLike(state, action) {
            const { postId, commentId, userId } = action.payload;
          
            // Use map to create a new array with the updated post
            const updatedPosts = state.posts.map((post) => {
              if (post._id === postId) {
                // Update the target post
                const updatedComments = post.comments.map((comment) =>
                  comment._id === commentId
                    ? {
                        ...comment,
                        likes: [...comment.likes, { user: userId }],
                      }
                    : comment
                );
          
                return {
                  ...post,
                  comments: updatedComments,
                };
              }
          
              return post;
            });
          
            // Update the state by creating a new state object
            return { posts: updatedPosts };
          },
          removeCommentLike(state, action) {
            const { postId, commentId, userId } = action.payload;
          
            // Use map to create a new array with the updated post
            const updatedPosts = state.posts.map((post) => {
              if (post._id === postId) {
                // Update the target post
                const updatedComments = post.comments.map((comment) =>
                  comment._id === commentId
                    ? {
                        ...comment,
                        likes: comment.likes.filter((like) => like.user !== userId),
                      }
                    : comment
                );
          
                return {
                  ...post,
                  comments: updatedComments,
                };
              }
          
              return post;
            });
          
            // Update the state by creating a new state object
            return { posts: updatedPosts };
          },
          addComment(state, action) {
            const updatedPost = action.payload.post;
            const data = action.payload.formData;
            // Use map to create a new array with the updated post
            const updatedPosts = state.userPosts.map((p) =>
              p._id === updatedPost._id ? { ...p, comments: [ data,...p.comments,] } : p
            );
          
            // Update the state by creating a new state object
            return {  posts: updatedPosts };
          },
          addUserPosts(state,action){
            const posts = action?.payload?.posts || []
            state.userPosts = [...posts];
            return state;  
        }
    },
})

export const {addPosts,addLike,removeLike,addComment,deletePost,
  addSinglePosts,addUserPosts,addCommentLike,removeCommentLike} = postsSlice.actions

export default  postsSlice.reducer