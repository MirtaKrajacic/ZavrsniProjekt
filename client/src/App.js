import Nav from './components/Nav';
import Footer from './components/Footer';
import SignUp from './components/SignUp';
import PrivateComponent from './components/PrivateComponent';
import Login from './components/Login';
import NapraviUpitnik from './components/NapraviUpitnik';
import Upitnici from './components/Upitnici';
import UrediUpitnik from './components/UrediUpitnik';
import Upitnik from './components/Upitnik';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MojiUpitnici from './components/MojiUpitnici';


function App() {
  return (
    <div>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<Upitnici />} />
          <Route element={<PrivateComponent />}>
            <Route path="/view" element={<MojiUpitnici />} />
            <Route path="/add" element={<Upitnik />} />
            <Route path="/update/:id" element={<UrediUpitnik />} />
            <Route path="/logout" element={<h1>Logout Component</h1>} />
            <Route path="/profile" element={<h1>Moj profil</h1>} />
          </Route>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
      
      
    </div>
  );
}

export default App;
