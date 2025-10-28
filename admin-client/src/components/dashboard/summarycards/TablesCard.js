import React, { useEffect, useState } from 'react'
import "./TablesCard.css"
import { getAllTables } from '../../../api/analyticsApi'

const TablesCard = () => {
  const [tables, setTables]=useState([]);
  const [loading, setLoading]=useState(true);

  useEffect(()=>{
    const fetchTables= async()=>{
      try{
        const data=await getAllTables();
        const sortedData = data.sort((a, b) => a.tableNumber - b.tableNumber);
        setTables(sortedData);
      }catch(error){
        console.error("Error fetching table data:", error);
      }finally{
        setLoading(false);
      }
    }
    fetchTables();
  },[]);

  if (loading) return <div className="tables-card">Loading...</div>;

  return (
    <div className="tables-card">
      <div className="tables-header">
        
        <h3>Tables</h3>
        <div className="legend">
          <span className="dot reserved"></span> Reserved
          <span className="dot available"></span> Available
        </div>
      </div>

      <div className='line'></div>

      <div className="tables-grid">
        {tables.map((table) => (
          <div
            key={table.id}
            className={`table-box ${table.isAvailable ? "available" : "reserved"}`}
          >
            <p>Table</p>
            <h4>{String(table.tableNumber).padStart(2, "0")}</h4>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TablesCard