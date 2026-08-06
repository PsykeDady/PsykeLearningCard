import { useParams } from "react-router-dom";
import ShowCards from "./show-cards";
import { QuestionsProvider } from "../contexts/questions-context";

function LearningSession() {
    const { subject = "" } = useParams()

    return <div className="container-fluid">
        <div className="row">
            <div className="col-12">
                <QuestionsProvider subjectSlug={subject}>
                    <ShowCards />
                </QuestionsProvider>
            </div>
        </div>
    </div>    
}

export default LearningSession; 