import React from 'react'
import { NavLink } from 'react-router-dom'
import { AdminContext } from '../context/AdminContext'
import { useContext } from 'react'
import { assets } from '../assets/assets'

const Sidebar = () => {

  
    const {aToken} = useContext(AdminContext)
   


  return (
    <div>
      {
        aToken && <ul>

       <NavLink>
        <img src={assets.home_icon} alt="" />
       </NavLink>


        </ul>
      }
    </div>
  )
}

export default Sidebar
