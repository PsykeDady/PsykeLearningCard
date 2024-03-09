import { createSlice } from "@reduxjs/toolkit";

const API_GITHUB_CONTENT = "https://api.github.com/repos/PsykeDady/PsykeLearningCard/contents/public/assets/subjects"
const BRANCH = "?ref=refactoring"

const getSubjects = () => {
    fetch(`${API_GITHUB_CONTENT}${BRANCH}`, {
        headers: {
            "Accept": "application/vnd.github+json"
        }
    }).then( subjects=>{
        //for list subjects
    })

}


const subjectsSlice = createSlice({
	name:"subjectsSlice",
	initialState:{
        subjects:getSubjects(),
        currentSubject:""
	}, 
	reducers:{
		
	}
})


export const {} = subjectsSlice.actions;

export default subjectsSlice