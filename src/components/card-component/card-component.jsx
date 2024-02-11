import { useState } from "react"

function Card({title, front, retro}) {

    let [flipped, flagFlipped] = useState(false)

    let flip = () => {
        flagFlipped(true)
    }

    let formatText = (testo="") => {
        console.log(testo)
        if (! testo instanceof String) {
            return testo.reduce((p,n)=>p+formatText(n),"")
        }
        return testo.replace("\n", "<br/>")
    }

    let retroC = <span dangerouslySetInnerHTML={{__html: formatText(retro)}}>
        
    </span>

    return <div className="container-fluid rounded bg-white p-3">
        <div className="row">
            <div className="col-12">
                <h2>
                    {title}
                </h2>
            </div>
        </div>
        <hr className="row"/>
        <div className="row" onClick={flip}>
            <div className="col text-center">
                {flipped? 
                    <strong className="text-success">{retroC}</strong> : 
                    <span className="small text-muted">{front}</span>
                }
            </div>
        </div>
    </div>
}

export default Card