import './App.css';
import { QuestionsProvider } from './contexts/questions-context';
import Home from './pages/home';

function App() {
  return <QuestionsProvider> 

    <Home></Home>
  </QuestionsProvider>
}

export default App;
