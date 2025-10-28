import React, { useEffect, useState } from 'react'
import "./RevenueCard.css"
import {
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Bar,
  ComposedChart,
} from "recharts";
import { getRevenueData } from '../../../api/analyticsApi';

const RevenueCard = () => {
    const [filter, setFilter]=useState("daily");
    const [data, setData]=useState([]);
    const [loading, setLoading]=useState(true);

    useEffect(()=>{
        const fetchRevenue=async()=>{
            try{
                const res=await getRevenueData(filter);
                setData(res || []);
            }catch(error){
                console.error("Error fetching revenue data:", error);
            }finally{
                setLoading(false);
            }
        }
        fetchRevenue();
    },[filter]);

    const filters= ["daily", "weekly", "monthly", "yearly"];

    if(loading) return <div className="revenue-card">Loading...</div>;

    const maxRevenue = Math.max(...data.map((d) => d.revenue || 0));
  return (
    <div className='revenue-card'>
        <div className='revenue-header'>
            <h3>Revenue</h3>
            <select
                className='revenue-filter'
                value={filter}
                onChange={(e)=>setFilter(e.target.value)}
            >
                {filters.map((f)=>(
                    <option key={f} value={f}>
                        {f.charAt(0).toUpperCase()+f.slice(1)}
                    </option>
                ))}

            </select>
        </div>
        
        <div className='line'></div>

        <div className='revenue-chart'>
            <ResponsiveContainer width="100%" height={140}>
                <ComposedChart
                 data={data}
                 margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                >
                <defs>
                  <linearGradient id="fadeBar" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#eaeaea" stopOpacity={0.7} />
                    <stop offset="70%" stopColor="#f5f5f5" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
                   </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <Bar
                dataKey="revenue"
                barSize={40}
                fillOpacity={1}
                fill="#f2f2f2"
                shape={(props) => {
                const { x, width, payload } = props;
                const isMax = payload.revenue === maxRevenue;
                return (
                  <rect
                    x={x}
                    y={0}
                    width={width}
                    height={160}
                    fill={isMax ? "#e0e0e0" : "#f8f8f8"}
                    rx={4}
                    ry={4}
                  />
                );
              }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#2b2b2b"
              strokeWidth={1.5}
              dot={false}
              activeDot={false}
              isAnimationActive={true}
              animationDuration={800}
            />

            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#888", fontSize: 12 }}
            />
            <YAxis
              hide
            />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e0e0e0",
                backgroundColor: "#fff",
                color: "#333",
                fontSize: "13px",
              }}
            />
          </ComposedChart>
            </ResponsiveContainer>
        </div>
    </div>
  )
}

export default RevenueCard