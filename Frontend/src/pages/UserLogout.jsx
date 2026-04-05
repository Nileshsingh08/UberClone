import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const UserLogout = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
    
        const token = localStorage.getItem('token');
        await axios.get(`${import.meta.env.VITE_BASE_URL}users/logout`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response)=>{
            if(response.status === 200){
                localStorage.removeItem('token');
                navigate('/login');
            }else{
                alert('Logout failed');
            }
        
        })
      
    } catch (error) {
      console.error('Error occurred while logging out:', error);
    }
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default UserLogout
