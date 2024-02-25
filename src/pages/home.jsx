import HeaderComponent from "../components/header-component/header-component";
import FooterComponent from "../components/footer-components/footer-component";


function Home() {

    return <div className="container-fluid bg-light">
		<div className="row">
			<div className="col-12">
				<HeaderComponent />
			</div>
		</div>
		<div className="row overflow-y-scroll">
			<div className="col-12">
				<div className="row">
					<div className="col-12">
						BODY
					</div>
				</div>
				<div className="row">
					<div className="col-12">
						<FooterComponent></FooterComponent>
					</div>
				</div>
			</div>
		</div>
	</div>
}


export default Home; 