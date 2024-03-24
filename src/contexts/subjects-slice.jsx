import { createSlice } from "@reduxjs/toolkit";
import GithubModelContent from "../models/github-content.model";
import Subject from "../models/subject.model";

const API_GITHUB_CONTENT = "https://api.github.com/repos/PsykeDady/PsykeLearningCard/contents/"
const ASSETS_PATH = "public/assets/subjects"
const BRANCH = "?ref=refactoring"

const getSubjects = () => {
    flagLoading(true)
    const subjectList = []
    fetch(`${API_GITHUB_CONTENT}${ASSETS_PATH}${BRANCH}`, {
        headers: {
            "Accept": "application/vnd.github+json"
        }
    }).then(response => response.json()).then( institutes=>{
        return Promise.all(institutes.map((institute=new GithubModelContent()) => {
            return fetch(`${API_GITHUB_CONTENT}${institute.path}${BRANCH}`)
                .then(response => response.json())
                .then(categories => {
                    return Promise.all(categories.map( (category=new GithubModelContent()) =>
                        fetch(`${API_GITHUB_CONTENT}${category.path}${BRANCH}`)
                        .then(response=>response.json)
                        .then(subjects=>{
                            subjectList.push(subjects.map((subject=new GithubModelContent())=>
                                new Subject(institute.name,category.name,subject.name,subject._links.self)
                            ))
                        })
                    ))
                })
                .catch(error => {
                    console.error('Errore durante la fetch:', error);
                });
        }))
        .then(() => {
            flagLoading(false); // Dopo aver completato tutte le fetch, imposta il flag Loading a false
        });
    })
}

const getGithubDirectory = () => {
    flagLoading(true)
    const fileList = []
    fetch(`${API_GITHUB_CONTENT}${ASSETS_PATH}${BRANCH}`)
}

 
const subjectsSlice = createSlice({
	name:"subjectsSlice",
	initialState:{
        subjects:getSubjects(),
        currentSubject:"",
        loading:false
	}, 
	reducers:{
        flagLoading: (state) => {return {...state, loading:true}}
	}
})


export const {flagLoading} = subjectsSlice.actions;

export default subjectsSlice