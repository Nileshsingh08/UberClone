import React, {use, useContext, useEffect} from 'react'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'

function UserProtectwrapper({children}) {
  const {user} = useContext(UserDataContext);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
useEffect(()=>{
  if(!token){
    navigate('/login');
  }
},[token])

  return (
    <div>
      {children}
    </div>
  )
}

export default UserProtectwrapper
