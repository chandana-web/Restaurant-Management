import React, { useEffect, useRef, useState } from 'react'
import "./Tables.css"
import {
  getAllTables,
  createTable,
  deleteTable,
} from "../api/tablesApi"


import deleteIcon from "../assets/table.delete.png"
import chairIcon from "../assets/table.chair.png"


const MAX_TABLES =30;
// const MAX_CHAIRS =30;



const Tables = () => {

  const [tables, setTables]=useState([])
  const [showForm, setShowForm] = useState(false);
  const [chairs, setChairs] = useState(3);
  const [loading, setLoading] = useState(false);

  const popupRef=useRef(null)

  const fetchTables=async()=>{
    try{
      const res=await getAllTables();
      const sorted=res.sort((a, b) => a.tableNumber - b.tableNumber);
      setTables(sorted);
    }catch(err){
      console.error("Error fetching tables:", err);
    }
  }

  useEffect(()=>{
    fetchTables();
  },[])

  useEffect(()=>{
    const handleClickOutside=(event)=>{
      if(popupRef.current&& !popupRef.current.contains(event.target)){
        setShowForm(false)
      }
    }

    if(showForm){
      document.addEventListener("mousedown", handleClickOutside);
    }else{
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return()=>{
      document.removeEventListener("mousedown", handleClickOutside)
    }

  }, [showForm])

  const handleCreate=async(e)=>{
    e.preventDefault();
    if(tables.length>=MAX_TABLES)
      return alert ("Maximum 30 tables allowed");

    try{
      setLoading(true);

      const used= tables.map((t)=>t.tableNumber);
      let nextNum=1;
      while(used.includes(nextNum)) nextNum++;

      await createTable({
        tableNumber: nextNum,
        chairs,
      });

      await fetchTables();
      setShowForm(false);
    }catch(err){
      console.error("Error creating table:", err);
      alert("Failed to create table");
    }finally{
      setLoading(false);
    }

  }



  const handleDelete=async(id)=>{
    if(!window.confirm("Do you want to delete the table?")) return;

    try{
      await deleteTable(id);
      await fetchTables();
    }catch(err){
      console.error("Error deleting table:", err);
      alert("Failed to delete table");
    }
  }

  return (
    <div className="tables-page">
      <div className="tables-title"><h1>Tables</h1></div>
      <div className="tables-container">
        {tables.map((table) => (
          <div key={table._id} className="table-card">
            {!table.isAvailable ? (
            <img
             className="deleteIcon disabled"
            src={deleteIcon}
            alt="Reserved"
            title="Reserved table cannot be deleted"
            style={{ opacity: 0.3, cursor: "not-allowed" }}
            />
            ) : (
            <img
             className="deleteIcon"
            src={deleteIcon}
            alt="Delete"
            onClick={() => handleDelete(table._id)}
            />
            )}
            <div className="table-number">
            <div>Table</div>
            <div className="num">{String(table.tableNumber).padStart(1, "0")}</div>
            </div>
            <div className="chair">
            <img src={chairIcon} alt=""/>
            <p>0{String(table.chairs).padStart(1,"0")}</p>
            </div>
          </div>
        ))}

        
        {tables.length<MAX_TABLES && (
          <div className="table-card add-table"onClick={()=>setShowForm(true)}>
          +
          </div>
        )}
      </div>

      {showForm && (
        
        <div className='add-form-popup' ref={popupRef}>
          <form className='add-form' onSubmit={handleCreate}>
            <p className='form-label'>Table name(optional)</p>
            <h2 className='form-number'>
              {String(tables.length+1).padStart(1,"0")}
            </h2>
            <hr/>
            <div className='select'>
            <label>Chair</label>
            <select 
              value={chairs}
              onChange={(e)=>setChairs(Number(e.target.value))}
            >
              {[2,4,6,8].map((num)=>(
                <option key={num} value={num}>
                  {String(num).padStart(1,"0")}
                </option>
              ))}
            </select>
            </div>

            <button type='submit' className='create-btn' disabled={loading}>
              {loading?"Creating..":"Create"}
            </button>
          </form>
        </div>
        
      )} 

    </div>
  );
};


export default Tables