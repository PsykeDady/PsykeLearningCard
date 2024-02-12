import { useEffect, useState } from "react"
import Question from "../../models/question.model"
import {formatText} from "../../utils/stringutils" 

function Card({question=new Question(), outFlagFlip=(flip=false)=>{}}) {

    let [flipped, flagFlipped] = useState(false)

	useEffect(()=>{
		flagFlipped(false)
		outFlagFlip(false)
	}, [question, outFlagFlip])

    let flip = () => {
        flagFlipped(true)
		outFlagFlip(true)
    }

	let unSort = () => {
		let unsorted = question.a.slice();

		unsorted.sort(() => Math.random() - 0.5); 
		
		return <>
			<span dangerouslySetInnerHTML={{__html:formatText(unsorted)}}> 
			</span>
			<hr />
			<small> Tocca per visualizzare la risposta </small>
		</>
	}

    let retroC = <span dangerouslySetInnerHTML={{__html:formatText(question.a)}}> 
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
                    question.t.toUpperCase()==="RIORDINA"?   
					unSort()
					:  <span className="small text-muted">{"Clicca qui per mostrare la risposta"}</span>
                }
            </div>
        </div>
    </div>
}

export default Card