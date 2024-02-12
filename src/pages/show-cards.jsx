import { useCallback, useContext, useEffect, useState } from "react"
import Card from "../components/card-component/card-component"
import QuestionContext from "../contexts/questions-context"
import Question from "../models/question.model"

function ShowCards() {
    
    let questionsContext = useContext(QuestionContext)
    let [questions,setQuestions] = useState( [...questionsContext.questions])
    let [currentIndex, setCurrentIndex] = useState(0)
    let [current, setCurrent] = useState(new Question())
	let [flipped, flagFlipped] =useState(false)

    
    const randomQuestion = useCallback (() => { 
		console.log("randomQuestion call")
        const index = Math.floor(Math.random()*questions.length)
        setCurrentIndex(index)
        setCurrent(questions[index])
    },[questions])
    
    useEffect(()=>{
		console.log("called useEffect")
		randomQuestion()
    },[randomQuestion])

    const next = (success=false)=> {
        if(success){
            questionsContext.addSuccess()
        } else {
            questionsContext.addWrong(current)
        }
        setQuestions(questions.filter((_,i)=>i!==currentIndex))
        console.log(questions)
    }

	const results = <div className="row m-2">
		<div className="col-12 text-center">
			<small className="pull-left rounded-pill bg-white text-danger p-3">
				Sbagliate<br/>{questionsContext.countWrong}
			</small>
			<small className="rounded-pill bg-white text-info p-3 align-self-center">
				Domanda &nbsp;
				{questions.length}/{questionsContext.questions.length}
			</small>
			<small className="pull-right rounded-pill bg-white text-success p-3">
				Giuste<br/>{questionsContext.countSuccess}
			</small>
		</div>
	</div>
	
	const buttons = <div className="row">
		<div className="col-10 offset-1">
			{flipped? <div className="container">
				<div className="row">
					<div className="col text-center text-shadow-black text-white fs-3">
						Hai indovinato? 
					</div>
				</div>
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
			</div> : <span></span>}
		</div>
	</div>

    const cardsGame = <div className="container-fluid pt-5">
		{results}
		<div className="row">
			<div className="col-12 col-lg-4 offset-lg-4"> 
				<Card
					question={current}
					outFlagFlip={flagFlipped}
				/>
			</div>
		</div>
		<br />
		{buttons}
	</div>
                
    const noCards = <div className="container-fluid rounded bg-white text-center">
                        <div className="row">
                            <div className="col-12">
                                <h1 className="text-danger">"Non ci sono più domande"</h1>
                            </div>
                        </div>
						<div className="row">
							<div className="col-12">
								Risultati
							</div>
						</div>
						<div className="row">
							<div className="col-6 text-success">
								Giuste<br></br>{questionsContext.countWrong}
							</div>
							<div className="col-6 text-danger">
								Sbagliate<br></br>{questionsContext.countWrong}
							</div>
						</div>
                    </div>
    return questions.length>0 && current? cardsGame : noCards  
}

export default ShowCards