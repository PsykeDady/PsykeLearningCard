import HeaderComponent from "./components/header-component/header-component";
import FooterComponent from "./components/footer-components/footer-component";
import router from "./routes/pages.routes"
import { RouterProvider } from "react-router-dom";

function AppRoot() {

    return <div className="app-shell container-fluid px-0">
		<div className="app-header-surface rounded">
			<HeaderComponent />
		</div>
		<div className="app-content-surface rounded mt-3">
			<RouterProvider router={router}>
				
			</RouterProvider>
		</div>
		<div className="app-footer-surface rounded mt-3">
			<FooterComponent></FooterComponent>
		</div>
	</div>
}


export default AppRoot; 