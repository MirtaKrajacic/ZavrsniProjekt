import Nav from './components/Nav';
import Registracija from './pages/Registracija';
import PrivateComponent from './pages/PrivateComponent';
import Prijava from './pages/Prijava';
import Naslovnica from './pages/Naslovnica';
import UrediUpitnik from './pages/UrediUpitnik';
import UrediProfil from './pages/UrediProfil';
import RjesiUpitnik from './pages/RjesiUpitnik';
import AddUpitnik from './pages/AddUpitnik';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MojiUpitnici from './pages/MojiUpitnici';


function App() {
  return (
    <div>
      <BrowserRouter>
        <Nav />
        <Routes>
          {/* Public rute */}
          <Route path="/" element={<Naslovnica />} />
          <Route path="/signup" element={<Registracija />} />
          <Route path="/login" element={<Prijava />} />
          <Route path="/upitnik/:id" element={<RjesiUpitnik mod={"javni"}/>} />
          <Route path="/upitnik/p/:uuid" element={<RjesiUpitnik mod={"privatni"}/>} />

          {/* Privatme rute */}
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
