import HeaderComponent from "./components/header-component/header-component";
import FooterComponent from "./components/footer-components/footer-component";
import router from "./routes/pages.routes"
import { RouterProvider } from "react-router-dom";

function AppRoot() {

    return <div className="container-fluid bg-light rounded">
		<div className="row">
			<div className="col-12">
				<HeaderComponent />
			</div>
		</div>
		<div className="row">
			<div className="col-12">
				<div className="row">
					<div className="col-12">
						<RouterProvider router={router}>
						
						</RouterProvider>
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


export default AppRoot; 