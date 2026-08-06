import { useContext, useEffect, useState } from "react"
import Card from "../components/card-component/card-component"
import QuestionContext from "../contexts/questions-context"
import Question from "../models/question.model"

function ShowCards() {
	const getRandomIndex = (length) => {
		const values = new Uint32Array(1)
		crypto.getRandomValues(values)
		return values[0] % length
	}
    
	const questionsContext = useContext(QuestionContext)
	const [questions,setQuestions] = useState([])
	const [currentIndex, setCurrentIndex] = useState(0)
	const [current, setCurrent] = useState(new Question())
	const [flipped, setFlipped] =useState(false)

    useEffect(()=>{
		setQuestions([...questionsContext.questions])
		setFlipped(false)
	},[questionsContext.questions])

	useEffect(() => {
		if (questions.length === 0) {
			setCurrent(new Question())
			return;
		}

		const index = getRandomIndex(questions.length)
		setCurrentIndex(index)
		setCurrent(questions[index])
	}, [questions])

    const next = (success=false)=> {
        if(success){
            questionsContext.addSuccess()
        } else {
            questionsContext.addWrong(current)
        }
        setQuestions(questions.filter((_,i)=>i!==currentIndex))
    }

	if (questionsContext.loading) {
		return <div className="container-fluid rounded bg-white text-center p-4">
			Loading questions...
		</div>
	}

	if (questionsContext.error) {
		return <div className="container-fluid rounded bg-white text-center p-4 text-danger">
			Unable to load questions from GitHub.
		</div>
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
		<div className="row justify-content-center">
			<div className="col-12 d-flex justify-content-center"> 
				<Card
					question={current}
					outFlagFlip={setFlipped}
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
								Giuste<br></br>{questionsContext.countSuccess}
							</div>
							<div className="col-6 text-danger">
								Sbagliate<br></br>{questionsContext.countWrong}
							</div>
						</div>
                    </div>
	return questions.length>0 && current.q ? cardsGame : noCards  
}

export default ShowCards