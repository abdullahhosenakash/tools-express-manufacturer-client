import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Footer from './Pages/Shared/Footer';
import Header from './Pages/Shared/Header';

function App() {
  return (
    <div className='main-app'>
      <Header></Header>

      <Footer />
      <ToastContainer />
    </div>
  );
}

export default App;
