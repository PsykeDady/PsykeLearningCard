import { useEffect, useState } from "react"
import Question from "../../models/question.model"
import {formatText} from "../../utils/stringutils" 

function Card({question=new Question()}) {

    let [flipped, flagFlipped] = useState(false)

	useEffect(()=>{
		flagFlipped(false)
	}, [question])

    let flip = () => {
        flagFlipped(true)
    }

	let unSort = () => {
		let unsorted = question.a.slice();

		unsorted.sort(() => Math.random() - 0.5); 
		
		return <span dangerouslySetInnerHTML={{__html:formatText(unsorted)}}> 
		</span>
	}

    let retroC = <span dangerouslySetInnerHTML={{__html:formatText(question.a)}}> 
    </span>

    return <div className="container-fluid rounded bg-white p-3">
        <div className="row">
            <div className="col-12">
                <h2>
                    {question.q}
                </h2>
            </div>
        </div>
        <hr className="row"/>
        <div className="row" onClick={flip}>
            <div className="col text-center">
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