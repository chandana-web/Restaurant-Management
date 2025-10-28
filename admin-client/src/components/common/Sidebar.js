import React from 'react'
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

//assets
import logo from "../../assets/logo.jpg"
import dashboardIcon from "../../assets/sb.dashboard.png"
import menuIcon from "../../assets/sb.analytics.png"
import orderIcon from "../../assets/sb.order.png"
import tableIcon from "../../assets/sb.table.png"

const Sidebar = () => {
  return (
   <div className='sidebar'>
    <div className='logo-circle'>
        <img src={logo} alt=''/>
    </div>
    <div  className='admin-sidebar'>
        <nav className='sidebar-menu'>
            <NavLink to="/" end>
                <img src={dashboardIcon} alt=''/>
            </NavLink>
            <NavLink to="/tables">
                <img src={tableIcon} alt=''/>
            </NavLink>
            <NavLink to="/orders">
                <img src={orderIcon} alt=''/>
            </NavLink>
            <NavLink to="/menu">
                <img src={menuIcon} alt=''/>
            </NavLink>
        </nav>
        <div className='sidebar-footer'></div>
    </div>
    </div>
  )
}

export default Sidebar