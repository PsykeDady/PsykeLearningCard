import { useEffect, useState } from "react"
import Question, { MULTIPLA, QA, RIORDINA } from "../../models/question.model"
import {formatText} from "../../utils/stringutils" 

function Card({question=new Question(), outFlagFlip=(flip=false)=>{}}) {
	const getRandomValue = () => {
		const values = new Uint32Array(1)
		crypto.getRandomValues(values)
		return values[0]
	}

	const shuffleItems = (items) => {
		const shuffledItems = [...items]

		for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
			const swapIndex = getRandomValue() % (index + 1)
			const currentItem = shuffledItems[index]
			shuffledItems[index] = shuffledItems[swapIndex]
			shuffledItems[swapIndex] = currentItem
		}

		return shuffledItems
	}

    const [flipped, setFlipped] = useState(false)

	useEffect(()=>{
		setFlipped(false)
		outFlagFlip(false)
	}, [question, outFlagFlip])

    const flip = () => {
		setFlipped(true)
		outFlagFlip(true)
    }

	const unSort = (type=QA) => {
		let unsorted = type===MULTIPLA ? [...question.a].map(riga => riga.split(";")[1]) : [...question.a];

		unsorted = shuffleItems(unsorted)
		
		return <>
			<span dangerouslySetInnerHTML={{__html:formatText(unsorted)}}> 
			</span>
			<hr className="text-muted"/>
			<small className="text-muted"> Tocca per visualizzare la risposta </small>
		</>
	}

	const trueAnswer = (answer, type) => {
		if(type===MULTIPLA){
			answer=answer.filter(riga=>riga.split(";")[0]==="SI")
		}
		return answer
	}

    let retroC = <span dangerouslySetInnerHTML={{__html:formatText(trueAnswer(question.a))}}> 
    </span>

	let cardContent = <span className="small text-muted">{"Clicca qui per mostrare la risposta"}</span>

	if (flipped) {
		cardContent = <strong className="text-success">{retroC}</strong>
	} else if (question.t.toUpperCase()===RIORDINA || question.t.toUpperCase()===MULTIPLA) {
		cardContent = unSort(question.t)
	}

	return <div className="learning-card rounded bg-white p-3 shadow">
        <div className="row">
            <div className="col-12">
                <h3>
                    {question.q}
                </h3>
            </div>
        </div>
        <hr className="row"/>
		<button className="row learning-card-body btn btn-link text-decoration-none text-reset m-0" onClick={flip} type="button">
			<div className="col text-center h4">
				{cardContent}
			</div>
		</button>
    </div>
}

export default Card