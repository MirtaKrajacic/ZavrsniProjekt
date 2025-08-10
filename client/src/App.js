import Nav from './components/Nav';
import SignUp from './pages/SignUp';
import PrivateComponent from './pages/PrivateComponent';
import Login from './pages/Login';
import Naslovna from './pages/Naslovna';
import UrediUpitnik from './pages/UrediUpitnik';
import AddUpitnik from './pages/AddUpitnik';
import UrediProfil from './pages/UrediProfil';
import Upitnici from './pages/Upitnici';

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

          {/* Privatme rute */}
          <Route element={<PrivateComponent />}>
            <Route path="/view" element={<MojiUpitnici />} />
            <Route path="/add" element={<Upitnici />} />
            <Route path="/update/:id" element={<UrediUpitnik />} />
            <Route path="/profile" element={<UrediProfil />} />
          </Route>          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
