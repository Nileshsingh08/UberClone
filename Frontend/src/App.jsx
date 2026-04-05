import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Start from './pages/Home'
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/UserSignup'
import CaptainSignup from './pages/CaptainSignup'
import CaptainLogin from './pages/CaptainLogin'
import UserProtectwrapper from './pages/UserProtectwrapper'
import UserLogout from './pages/UserLogout'


const App = () => {
  return (
    <div >
      <Routes>
        <Route path="/" element={<Start />} />
         <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/captain-login" element={<CaptainLogin />} />
        <Route path="/captain-signup" element={<CaptainSignup />} />
        <Route path="/home" element={
          <UserProtectwrapper>
            <Home />
          </UserProtectwrapper>
        } />
        <Route path='/logout' element={<UserProtectwrapper> <UserLogout/></UserProtectwrapper>} />
      </Routes>
    </div>
  )
}

export default App
