import './App.css';
import AppRoot from './app-root';
import { Provider } from 'react-redux';
import AppStore from './contexts/app-store';


function App() {
  return <div className='app-container'> 
    <Provider store={AppStore}>
      <AppRoot></AppRoot>
    </Provider>
  </div>
}

export default App;
