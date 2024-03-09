import './App.css';
import AppRoot from './app-root';
import { Provider } from 'react-redux';
import AppStore from './contexts/app-store';


function App() {
  return <div className="container-fluid">
			<div className="row">
				<div className="col-lg-6 offset-lg-3 col-12 offset-0 mt-2">
          <Provider store={AppStore}>
            <AppRoot></AppRoot>
          </Provider>
        </div>
			</div>
  </div>
}

export default App;
