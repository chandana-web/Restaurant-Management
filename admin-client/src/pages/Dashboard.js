import React, { useState } from 'react'
import "./Dashboard.css"
import AnalyticsSection from '../components/dashboard/AnalyticsSection'
import SummarySection from '../components/dashboard/SummarySection'
import ChefOrdersTable from '../components/dashboard/ChefOrdersTable'

const Dashboard = () => {
    const [filterText, setFiltertext]=useState("")
  return (
    <div className='dashboard-page'>
        <div className='dashboard-header'>
            <input
                type='text'
                className='filter-input'
                placeholder='Filter...'
                value={filterText}
                onChange={(e)=>setFiltertext(e.target.value)}
            />
        </div>

        <div className='dashboard-container'>
        
        <div className="dashboard-title">
          <h2>Analytics</h2>
        </div>

        <div className='dashboard-content'>
            <AnalyticsSection filterText={filterText}/>
            <SummarySection filterText={filterText}/>
            <ChefOrdersTable/>
        </div>
        </div>

    </div>
  )
}

export default Dashboard