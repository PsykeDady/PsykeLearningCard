import React, { useEffect, useState } from "react";
import Question from "../models/question.model"

const QuestionContext = React.createContext({
    questions:[new Question()], 
    loading:true,
    countWrong:0,
    countSuccess:0,
    failArray:[new Question()]
})

export function QuestionsProvider (props) {
	
	const [questions,setQuestions] = useState([]);
    const [loading,flagLoading] = useState(true);
    const [countWrong,setCountWrong] = useState(0);
    const [countSuccess,setCountSuccess] = useState(0);
    const [failArray,setFailArray] = useState([]);
    const addWrong = (question) => {
        setCountWrong(count=>count+1)
        setFailArray(fa=> [...fa,question])
    }
    const addSuccess = ()=>setCountSuccess(countSuccess+1)
    
    useEffect(() => {
        fetch('https://raw.githubusercontent.com/PsykeDady/PsykeLearningCard/main/public/assets/filosofia.json')
          .then(results => results.json())
          .then(data => {
            setQuestions(data.map(cj => {
                const model = new Question()
                model.q=cj.q
                model.a=cj.a
                model.t=cj.t
                return model
            }))
            flagLoading(false)
          });
        }, []);
    
	return  <QuestionContext.Provider value={{
            questions, 
            loading,
            countWrong,
            countSuccess,
            failArray,
            addWrong,
            addSuccess
	}}>
		{props.children}
	</QuestionContext.Provider>
}


export default QuestionContext;