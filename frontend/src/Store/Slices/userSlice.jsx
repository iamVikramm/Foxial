import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    username:"",
    email:"",
    _id:null,
    avatar:"",
    bio:"",
    isPrivate:true,
    saved:[]

}
const userSlice = createSlice({
    name:"user",
    initialState:initialState,
    reducers:{
        addUser(state,action){
            const { users } = action?.payload || {};
            const { username, email, _id,avatar,bio,isPrivate,saved} = users || {};
            state = { ...state, username, email, _id,avatar,bio,isPrivate,saved};
            return state;
        },
        addSavedPosts(state,action){
            const posts = action.payload.posts;
            state.saved = posts;
            return state;
        },
        updatePrivacy(state,action){
            const newPrivacy = action.payload.isPrivate;
            state.isPrivate = newPrivacy;
            return state;
        },
        addToSavedPosts(state,action){
            const postId = action.payload.postId;
            const savedPosts = [...state.saved,postId]
            state.saved = savedPosts;
            return state;
        },
        removeFromSavedPosts(state,action){
            const postId = action.payload.postId;
            const savedPosts = state.saved.filter(post=>post !== postId)
            state.saved = savedPosts;
            return state;
        }
    },
})

export const {addUser,updatePrivacy,addToSavedPosts,removeFromSavedPosts,addSavedPosts} = userSlice.actions

export default  userSlice.reducer