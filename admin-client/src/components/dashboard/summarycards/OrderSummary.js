import React, { useEffect, useState } from 'react';
import {PieChart,Pie, ResponsiveContainer, Cell} from "recharts";
import { getOrderSummary } from '../../../api/analyticsApi';
import "./OrderSummaryCard.css";


const COLORS = ["#2C2C2C", "#5B5B5B","#828282"]; // dark to light

const OrderSummary = () => {
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState("daily");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await getOrderSummary(filter);
        setData(res);
      } catch (error) {
        console.error("Error fetching order summary:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [filter]);

  if (loading) return <div className="order-summary-loading">Loading...</div>;
  if (!data) return <div className="order-summary-error">No data found</div>;

  const chartData = [
    { name: "Take Away", value: data.takeAwayOrders || 0 },
    { name: "Served", value: data.servedOrders || 0 },
    { name: "Dine In", value: data.dineInOrders || 0 },
  ];

   const total =
    (data.takeAwayOrders || 0) +
    (data.servedOrders || 0) +
    (data.dineInOrders || 0);


  const getPercent = (val) =>
    total ? `${Math.round((val / total) * 100)}%` : "0%";

  return (
    <div className="order-summary-card">
      <div className="order-summary-header">
        <h3>Order Summary</h3>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="order-summary-filter"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <div className='line'></div>

      <div className="order-summary-stats">
        <div className="stat-box">
          <h2>{data.servedOrders || 0}</h2>
          <p>Served</p>
        </div>
        <div className="stat-box">
          <h2>{data.dineInOrders || 0}</h2>
          <p>Dine In</p>
        </div>
        <div className="stat-box">
          <h2>{data.takeAwayOrders || 0}</h2>
          <p>Take Away</p>
        </div>
      </div>

    
      <div className="order-summary-chart-section">
        <div className="order-summary-chart">
            <div style={{ width: "120px", height: "120px" }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={20}
                outerRadius={40}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          </div>
        </div>

        <div className="order-summary-bars">
          {chartData.map((item, index) => (
            <div key={index} className="progress-item">
              <span className="label">
                {item.name} <span className="percent">({getPercent(item.value)})</span>
              </span>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: getPercent(item.value),
                    background: COLORS[index],
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    
  )
}

export default OrderSummary