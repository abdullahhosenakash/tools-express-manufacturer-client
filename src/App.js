import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Footer from './Pages/Shared/Footer';
import Header from './Pages/Shared/Header';
import Home from './Pages/Home/Home';

function App() {
  return (
    <div className='main-app'>
      <Header></Header>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
      </Routes>

      <Footer />
      <ToastContainer />
    </div>
  );
}

export default App;
