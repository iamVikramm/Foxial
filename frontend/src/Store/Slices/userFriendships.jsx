import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    friends:[],
    pendingRequests : [],
    sentRequests : [],
    nonFriends : []
}
const friendshipSlice = createSlice({
    name:"user",
    initialState:initialState,
    reducers:{
        addFriend(state,action){
            state.friends = [...action.payload]
            return state;
        },
        addSingleFriend(state,action){
            const {newFriend} = action.payload
            const updated = [...state.friends,newFriend]
            state.friends = [...updated]
            return state;
        },
        addPendingRequests: (state, action) => {

            state.pendingRequests = [...action.payload];
            return state;
          },
          removePendingRequests: (state, action) => {

            const updated = state.pendingRequests.filter(each => each._id != action.payload)
            state.pendingRequests = [...updated];
            return state;
          },
        addNonfriends : (state,action)=>{
            state.nonFriends = [...action.payload]
            return state;
        },
        removeNonfriends : (state,action)=>{
            const updated = state.nonFriends.filter(o=>o._id != action.payload)
            state.nonFriends = [...updated]
            return state;
        },
        addSentRequests : (state,action)=>{
            state.sentRequests = [...action.payload]
            return state;
        },
        addSingleSentReq : (state,action)=>{
            const user = action.payload;
            state.sentRequests = [...state.sentRequests,user];
            return state;
        },
        unFriend : (state,action)=>{
            const {unFriend} = action.payload;
            const newFriendsArray = state.friends.filter(u=>u._id !== unFriend)
            state.friends = newFriendsArray
            return state;
        }
    },
})

export const {addFriend,unFriend, addPendingRequests,addNonfriends,addSentRequests,removeNonfriends,removePendingRequests,addSingleFriend,addSingleSentReq} = friendshipSlice.actions

export default  friendshipSlice.reducer