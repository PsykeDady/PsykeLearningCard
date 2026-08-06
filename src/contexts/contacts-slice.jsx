import { createSlice } from "@reduxjs/toolkit";
const contactsSlice = createSlice({
	name:"contacts",
	initialState:{
        contacts:[
            {text:"Portfolio",link:"https://psykefolio.surge.sh",icon:"user-circle-o"}
        ],
        howto:[
            {text:"Github Repo"              ,link:"https://github.com/Psykedady/PsykeLearningCard",icon:"github"}
        ]
	}, 
	reducers:{
	}
})



export default contactsSlice