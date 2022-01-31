import './App.css';
import Header from './components/Header';
import Thumbnail from './components/Thumbnail';
import Home from './components/Home';
import { items } from './items';

function App() {
  return (
    <div>
      <Header />
      <div>
        <Home items={items} />
      </div>
    </div>
  );
}

export default App;
