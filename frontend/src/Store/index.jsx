import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./Slices/userSlice.jsx"
import authTokenSlice from "./Slices/authTokenSlice.jsx";
import postsSlice from "./Slices/posts.jsx";
import loadingSlice from "./Slices/loading.jsx";
import friendshipSlice from "./Slices/userFriendships.jsx"
import chatsSlice from "./Slices/chats.jsx"

const store = configureStore({
    reducer : {
        users : userSlice,
        authToken:authTokenSlice,
        posts:postsSlice,
        loading:loadingSlice,
        friendships : friendshipSlice,
        chats:chatsSlice
    }
})


export default store;