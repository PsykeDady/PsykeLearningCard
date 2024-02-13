import { useEffect, useState } from "react"
import Question, { MULTIPLA, QA, RIORDINA } from "../../models/question.model"
import {formatText} from "../../utils/stringutils" 

function Card({question=new Question(), outFlagFlip=(flip=false)=>{}}) {

    let [flipped, flagFlipped] = useState(false)

	useEffect(()=>{
		flagFlipped(false)
		outFlagFlip(false)
	}, [question, outFlagFlip])

    const flip = () => {
        flagFlipped(true)
		outFlagFlip(true)
    }

	const unSort = (type=QA) => {
		let unsorted = type===MULTIPLA ? [...question.a].map(riga => riga.split(";")[1]) : [...question.a];

		unsorted.sort(() => Math.random() - 0.5); 
		
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

    return <div className="container-fluid rounded bg-white p-3">
        <div className="row">
            <div className="col-12">
                <h3>
                    {question.q}
                </h3>
            </div>
        </div>
        <hr className="row"/>
        <div className="row" onClick={flip}>
            <div className="col text-center h4">
                {flipped? 
                    <strong className="text-success">{retroC}</strong> : 
                    question.t.toUpperCase()===RIORDINA?   
					unSort(question.t)
					:  question.t.toUpperCase()===MULTIPLA? 
					unSort(question.t)
					:<span className="small text-muted">{"Clicca qui per mostrare la risposta"}</span>
                }
            </div>
        </div>
    </div>
}

export default Card