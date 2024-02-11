import { useContext } from "react";
import Loading from "../components/loading-component/loading";
import QuestionContext from "../contexts/questions-context";
import ShowCards from "./show-cards";

function Home() {
    const contesto = useContext(QuestionContext)

    return <div className="container-fluid">
		<div className="row">
			<div className="col-12 text-center	">
				<h1 className="text-decoration-underline text-shadow-black text-white">Ciao Broccola, buone ripetizioni. Studia!</h1>
			</div>
		</div>
		<div className="row">
			<div className="col-12">
				{contesto.loading? <Loading /> : <ShowCards />}
			</div>
		</div>
	</div>
}


export default Home; 