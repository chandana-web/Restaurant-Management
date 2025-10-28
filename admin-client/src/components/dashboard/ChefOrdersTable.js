import React, { useEffect, useState } from 'react'
import "./ChefOrdersTable.css";
import { getAnalytics } from '../../api/analyticsApi';

const ChefOrdersTable = () => {

    const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAnalytics();
        setChefs(res.chefStats || []); // ✅ directly store chefs
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p className="analytics-loading">Loading...</p>;
  if (!chefs.length) return <p className="analytics-error">No chef data found.</p>;

  return (
    <div className='chef-table-container'>
      <table className='chef-table'>
        <thead>
          <tr>
            <th>Chef Name</th>
            <th>Orders Taken</th>
          </tr>
        </thead>
        <tbody>
          {chefs.map((chef, index) => (
            <tr key={index}>
              <td>{chef.name}</td>
              <td>{String(chef.totalOrdersTaken || 0).padStart(2, "0")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  )
}

export default ChefOrdersTable