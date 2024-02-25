import { createSlice } from "@reduxjs/toolkit";
const contactsSlice = createSlice({
	name:"contacts",
	initialState:{
        contacts:[
            {text:"Email"    ,link:"mailto:psdady@msn.com",icon:"email-bulk"},
            {text:"Github"   ,link:"https://github.com/Psykedady",icon:"github"},
            {text:"Portfolio",link:"https://psykefolio.surge.sh",icon:"user-circle-o"},
            {text:"Linkedin" ,link:"https://it.linkedin.com/in/davide-galati-15b5a5293",icon:"linkedin"}
        ],
        howto:[
            {text:"Psyke Learning Cards info",link:"/appinfo",icon:"info-circle"},
            {text:"add Q.A. (no-dev)"        ,link:"https://github.com/PsykeDady/PsykeLearningCard/issues/new",icon:"question-circle"},
            {text:"add Q.A. (dev)"           ,link:"https://github.com/PsykeDady/PsykeLearningCard/compare",icon:"question-circle-o"},
            {text:"Github Repo"              ,link:"https://github.com/Psykedady/PsykeLearningCards",icon:"github"}
        ]
	}, 
	reducers:{
	}
})



export default contactsSlice