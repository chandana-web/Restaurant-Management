import React from 'react'
import "./AdminLayout.css"
import Sidebar from '../components/common/Sidebar'


const AdminLayout = ({children}) => {
  return (
    <div className="admin-layout">
      <Sidebar/>
      <div className="layout-bg">
          {children}
      </div>
    </div>
  )
}

export default AdminLayout