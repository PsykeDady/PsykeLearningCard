import './App.css';
import Home from './pages/home';
import { Provider } from 'react-redux';
import AppStore from './contexts/app-store';


function App() {
  return <div className='app-container'> 
    <Provider store={AppStore}>
      <Home></Home>
    </Provider>
  </div>
}

export default App;
