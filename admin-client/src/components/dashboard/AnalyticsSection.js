import React, { useEffect, useState } from 'react'
import "./AnalyticsSection.css";
import { getAnalytics } from '../../api/analyticsApi';


import chefIcon from "../../assets/db.chef.png";
import ordersIcon from "../../assets/db.order.png";
import clientsIcon from "../../assets/db.client.png";
import revenueIcon from "../../assets/db.rev.png";

import axiosClient from "../../api/axiosClient"; // make sure this path is correct
console.log("API Base URL:", axiosClient.defaults.baseURL);


const AnalyticsSection = ({filterText}) => {
    const [analytics, setAnalytics]=useState(null);
    const [loading, setLoading]=useState(true);

    useEffect(()=>{
        const fetchData=async()=>{
            try{
                const res=await getAnalytics();
                setAnalytics(res)
            }catch(error){
                console.error("Error fetching analytics:", error);
            }finally{
                setLoading(false)
            }
        }
        fetchData();
    },[])

    if(loading) return <p className="analytics-loading">Loading...</p>;
    if (!analytics) return <p className="analytics-error">No analytics data found.</p>;

    const formatToK = (value) => {
    if (!value || value === 0) return "0";
    const kValue = value / 1000;
    return kValue % 1 === 0 ? `${kValue}K` : `${kValue.toFixed(1)}K`;
  };




    const analyticsCards = [
    { 
        icon: chefIcon,
        value: analytics.totalChefs || 0,
        label: "Total chefs" },
    { 
        icon: revenueIcon,
        value: formatToK(analytics.totalRevenue),
        label: "Total Revenue" 
    },
    { 
        icon: ordersIcon,
        value: analytics.totalOrders || 0,
        label: "Total Orders"
    },
    { 
        icon: clientsIcon,
        value: analytics.totalClients || 0,
        label: "Total Clients" 
    },
  ];

  const filteredCards=analyticsCards.map((item)=>{
       const isVisible=item.label
                            .toLowerCase()
                            .includes(filterText.toLowerCase().trim());
                return {...item, isVisible}; 
    });

  return (
    
        <div className='analytics-section'>
            <div className='analytics-cards'>
            {filteredCards.map((item,i)=>(
                <div
                 key={i} 
                 className={`analytics-card ${!item.isVisible ? "blurred" : ""}`}
                 >
                    <div className='icon-circle'>
                        <img src={item.icon} alt=''/>
                    </div>
                    <div className='analytics-info'>
                        <h2>{item.value}</h2>
                        <p>{item.label}</p>
                    </div>
                </div>
            ))}
            </div>
        </div>
    
  )
}

export default AnalyticsSection