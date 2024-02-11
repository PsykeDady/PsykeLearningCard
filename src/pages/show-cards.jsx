import { useContext, useEffect, useState } from "react"
import QuestionContext from "../contexts/questions-context"
import Card from "../components/card-component/card-component"
import Question from "../models/question.model"


function ShowCards() {
    
    let questionsContext = useContext(QuestionContext)
    let [questions,setQuestions] = useState( [...questionsContext.questions])
    let [currentIndex, setCurrentIndex] = useState(0)
    let [current, setCurrent] = useState(new Question())

    
    const randomQuestion = () => { 
        const index = Math.floor(Math.random()*questions.length)
        setCurrentIndex(index)
        setCurrent(questions[index])
    }
    
    useEffect(()=>{
        randomQuestion()
    },[])

    const next = (success=false)=> {
        if(success){
            questionsContext.addSuccess()
        } else {
            questionsContext.addWrong(current)
        }
        setQuestions(questions.splice(currentIndex,1))
        console.log(questions)]
        randomQuestion()

    }

    const cardsGame = <div className="container-fluid pt-5">
                        <div className="row">
                            <div className="col-12 col-lg-4 offset-lg-4"> 
                                <Card
                                    title={current.q}
                                    front={"Tocca per la risposta"}
                                    retro={current.a}
                                />         
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-10 offset-1">
                            <div className="container">
                                <div className="row">
                                    <div className="col-5 col-lg-3 p-1 offset-0 offset-lg-3">
                                        <button className="col-12 btn btn-danger" onClick={()=>next(false)}>
                                            Sbagliata
                                        </button>
                                    </div>
                                    <div className="col-5 col-lg-3 p-1 offset-1 offset-lg-0">
                                        <button className="col-12 btn btn-success" onClick={()=>next(true)}>
                                            Giusta
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
    const noCards = <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <h1 className="text-danger">"Non ci sono più domande"</h1>
                            </div>
                        </div>
                    </div>
    return questions.length>0 && current? cardsGame : noCards  
}

export default ShowCards