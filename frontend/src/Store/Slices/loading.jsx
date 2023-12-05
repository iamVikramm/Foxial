import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    loading:false
}
const loadingSlice = createSlice({
    name:"loading",
    initialState:initialState,
    reducers:{
        setLoading(state,action){
            const loading = action?.payload?.loading;
            state.loading = loading;
            return state;
            
        },
    },
})

export const {setLoading} = loadingSlice.actions

export default  loadingSlice.reducer