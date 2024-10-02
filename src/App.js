import Form from './form';
import Conformation from './Conformation';
import Reset from './Reset';
import Main from './main';
import Account from './Account';

import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './SignIn';

function App() {
  return (
    <>
      <header>
        <h1 id="main">Megatron Logistics</h1>  
      </header>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/signUp' element={<Form />} />
          <Route path='/conformation' element={<Conformation />} />
          <Route path='/reset' element={<Reset />} />
          <Route path='/main' element={<Main />} />
          <Route path='/account' element={<Account />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
