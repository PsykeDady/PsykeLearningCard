import { useParams } from "react-router-dom";

function LearningSession(params) {

    const pathParams = useParams()

    

    return <div className="container-fluid">
        <div className="row">
            <div className="col-12">
                Learning Session Page (subject: )
            </div>
        </div>
    </div>    
}

export default LearningSession; 