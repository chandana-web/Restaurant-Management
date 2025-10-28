import React from 'react'
import { Routes, Route} from "react-router-dom"
import AdminLayout from '../layout/AdminLayout'
import Dashboard from '../pages/Dashboard'
import Tables from '../pages/Tables'
import Orders from '../pages/Orders'
import Menu from '../pages/Menu'

const AppRoutes = () => {
  return (
    <AdminLayout>
        <Routes>
            <Route path='/' element={<Dashboard/>}/>
            <Route path='/tables' element={<Tables/>}/>
            <Route path='/orders' element={<Orders/>}/>
            <Route path='/menu' element={<Menu/>}/>
        </Routes>
    </AdminLayout>
  )
}

export default AppRoutes