import { useEffect, useState } from "react"
import Question, { MULTIPLA, QA, RIORDINA } from "../../models/question.model"
import {formatText} from "../../utils/stringutils" 

// identità stabile: se fosse una arrow inline entrerebbe nelle dipendenze
// dell'effect a ogni render, riazzerando il flip appena avvenuto
const nessunFlip = () => {}

function Card({question=new Question(), outFlagFlip=nessunFlip}) {
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

	const tipo = (question.t ?? QA).toUpperCase()

	// una riga MULTIPLA ha forma "SI;testo" oppure "NO;testo"
	const dividiRiga = (riga) => {
		const separatore = riga.indexOf(";")

		if (separatore < 0) return {corretta: false, testo: riga}

		return {
			corretta: riga.slice(0, separatore).trim().toUpperCase() === "SI",
			testo: riga.slice(separatore + 1)
		}
	}

	const unSort = () => {
		let unsorted = tipo===MULTIPLA ? question.a.map(riga => dividiRiga(riga).testo) : [...question.a];

		unsorted = shuffleItems(unsorted)

		return <>
			<span dangerouslySetInnerHTML={{__html:formatText(unsorted)}}>
			</span>
			<hr className="text-muted"/>
			<small className="text-muted"> Tocca per visualizzare la risposta </small>
		</>
	}

	const trueAnswer = (answer) => {
		if(tipo!==MULTIPLA) return answer

		return answer.map(dividiRiga).filter(riga => riga.corretta).map(riga => riga.testo)
	}

    let retroC = <span dangerouslySetInnerHTML={{__html:formatText(trueAnswer(question.a))}}>
    </span>

	let cardContent = <span className="small text-muted">{"Clicca qui per mostrare la risposta"}</span>

	if (flipped) {
		cardContent = <strong className="text-success">{retroC}</strong>
	} else if (tipo===RIORDINA || tipo===MULTIPLA) {
		cardContent = unSort()
	}

	return <div className="learning-card rounded bg-white p-3 shadow">
        <div className="row">
            <div className="col-12">
				<h3 dangerouslySetInnerHTML={{__html: formatText(question.q)}}>
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