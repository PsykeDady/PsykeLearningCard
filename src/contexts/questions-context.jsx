import React, { useEffect, useMemo, useState } from "react";
import Question from "../models/question.model"
import { getRemoteQuestionsBySlug } from "../utils/github.utils";

const QuestionContext = React.createContext({
    questions:[new Question()], 
    loading:true,
    error:null,
    countWrong:0,
    countSuccess:0,
    failArray:[],
    addWrong: () => {},
    addSuccess: () => {}
})

export function QuestionsProvider ({ children, subjectSlug="" }) {
	const [questions,setQuestions] = useState([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState(null);
    const [countWrong,setCountWrong] = useState(0);
    const [countSuccess,setCountSuccess] = useState(0);
    const [failArray,setFailArray] = useState([]);

    const addWrong = (question) => {
        setCountWrong(count=>count+1)
        setFailArray(fa=> [...fa,question])
    }
    const addSuccess = ()=>setCountSuccess(count=>count+1)
    
    useEffect(() => {
        let cancelled = false;

        const loadQuestions = async () => {
            setLoading(true)
            setError(null)
            setCountWrong(0)
            setCountSuccess(0)
            setFailArray([])

            try {
                const data = await getRemoteQuestionsBySlug(subjectSlug)

                if (cancelled) return;

                setQuestions(data.map(({ q, a, t }) => new Question(q, a, t)))
            } catch (fetchError) {
                if (cancelled) return;

                console.error(fetchError)
                setQuestions([])
                setError(fetchError)
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        };

        loadQuestions();

        return () => {
            cancelled = true;
        };
    }, [subjectSlug]);

    const contextValue = useMemo(() => ({
        questions,
        loading,
        error,
        countWrong,
        countSuccess,
        failArray,
        addWrong,
        addSuccess
    }), [questions, loading, error, countWrong, countSuccess, failArray]);
    
	return  <QuestionContext.Provider value={contextValue}>
		{children}
	</QuestionContext.Provider>
}


export default QuestionContext;