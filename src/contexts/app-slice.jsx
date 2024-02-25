import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
	name:"appinfo",
	initialState:{
        title:"PsykeLearningCards",
        currentPage:"Home"
	}, 
	reducers:{
		changePage(state,{payload}){return {...state, currentPage:payload}},
	}
})


export const {changePage} = appSlice.actions;

export default appSlice