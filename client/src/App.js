import Nav from './components/Nav';
import SignUp from './pages/SignUp';
import PrivateComponent from './pages/PrivateComponent';
import Login from './pages/Login';
import Naslovna from './pages/Naslovna';
import UrediUpitnik from './pages/UrediUpitnik';
import UrediProfil from './pages/UrediProfil';
import Upitnici from './pages/Upitnici';
import RjesiUpitnik from './pages/RjesiUpitnik';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MojiUpitnici from './pages/MojiUpitnici';


function App() {
  return (
    <div>
      <BrowserRouter>
        <Nav />
        <Routes>
          {/* Public rute */}
          <Route path="/" element={<Naslovna />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/upitnik/:id" element={<RjesiUpitnik mod={"javni"}/>} />
          <Route path="/upitnik/p/:uuid" element={<RjesiUpitnik mod={"privatni"}/>} />

          {/* Privatme rute */}
          <Route element={<PrivateComponent />}>
            <Route path="/view" element={<MojiUpitnici />} />
            <Route path="/add" element={<Upitnici />} />
            <Route path="/profile" element={<UrediProfil />} />
          </Route>          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
