import { useContext } from "react";
import Loading from "../components/loading-component/loading";
import QuestionContext from "../contexts/questions-context";
import ShowCards from "./show-cards";

function Home() {
    const contesto = useContext(QuestionContext)

    return contesto.loading? <Loading /> : <ShowCards />
}


export default Home; 