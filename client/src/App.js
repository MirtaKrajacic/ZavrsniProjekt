import Nav from './components/Nav';
import Registracija from './pages/public/Registracija';
import PrivateComponent from './pages/public/PrivateComponent';
import Prijava from './pages/public/Prijava';
import Naslovnica from './pages/public/Naslovnica';
import UrediUpitnik from './pages/admin/UrediUpitnik';
import UrediProfil from './pages/admin/UrediProfil';
import RjesiUpitnik from './pages/public/RjesiUpitnik';
import AddUpitnik from './pages/admin/AddUpitnik';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MojiUpitnici from './pages/admin/MojiUpitnici';


function App() {
  return (
    <div>
      <BrowserRouter>
        <Nav />
        <Routes>
          {/* Javne rute */}
          <Route path="/" element={<Naslovnica />} />
          <Route path="/signup" element={<Registracija />} />
          <Route path="/login" element={<Prijava />} />
          <Route path="/upitnik/:id" element={<RjesiUpitnik mod={"javni"}/>} />
          <Route path="/upitnik/p/:uuid" element={<RjesiUpitnik mod={"privatni"}/>} />
          
          {/* Privatne rute */}
          <Route element={<PrivateComponent />}>
            <Route path="/view" element={<MojiUpitnici />} />
            <Route path="/add" element={<AddUpitnik />} />
            <Route path="/upitnik/edit/:id" element={<UrediUpitnik />} />
            <Route path="/profile" element={<UrediProfil />} />
          </Route>          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
