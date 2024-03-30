import { createSlice } from "@reduxjs/toolkit";
import GithubModelContent from "../models/github-content.model";
import Subject from "../models/subject.model";

const API_GITHUB_CONTENT = "https://api.github.com/repos/PsykeDady/PsykeLearningCard/contents/"
const ASSETS_PATH = "public/assets/subjects"
const BRANCH = "?ref=refactoring"

const getGithubDirectory = (path="") => {
    flagLoading(true)
    const fileList = []
    fetch(`${API_GITHUB_CONTENT}${path}${ASSETS_PATH}${BRANCH}`,(file=new GithubModelContent()) => {
        fileList.push(file)
    }).then(()=> {flagLoading(false)})
}


// TODO RICOMINCIARE DA QUI 
// scopo creare una action che ricarica gli elementi della cartella utilizzando la current folder
 
const githubSlice = createSlice({
	name:"githubSlice",
	initialState:{
        data:[],
        currentFolder:"",
        loading:false
	}, 
	reducers:{
        flagLoading: (state) => {return {...state, loading:true}},
        setData: (state, {payload}) => {
            if (payload?.subject?.length!==0)
                return {...state, data:payload.data}
        }
	}
})


export const {flagLoading} = githubSlice.actions;

export default githubSlice