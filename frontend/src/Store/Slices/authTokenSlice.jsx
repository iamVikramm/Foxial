import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    authToken:""
}
const authTokenSlice = createSlice({
    name:"authToken",
    initialState:initialState,
    reducers:{
        addToken(state,action){
            const authToken = action?.payload?.authToken;
            state.authToken = authToken;
            return state;
            
        },
    },
})

export const {addToken,removeToken} = authTokenSlice.actions

export default  authTokenSlice.reducer