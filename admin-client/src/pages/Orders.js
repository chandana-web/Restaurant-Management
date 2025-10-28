import React, { useEffect, useState } from 'react'
import "./OrderLine.css"
import { getAllOrders, updateOrderStatus } from '../api/ordersApi';

import done1 from "../assets/order.done1.png";
import done2 from "../assets/order.done2.png";
import fk from "../assets/order.fk.png";
import processing from "../assets/order.processing.png";


const Orders = () => {
  const[orders, setOrders]= useState([]);
  const firstRun=React.useRef(true)

  useEffect(() => {
    if (!firstRun.current) return;
  firstRun.current = false;
  const fetchOrders = async () => {
    try {
      const data = await getAllOrders();

      const formattedOrders = await Promise.all(
        data.map(async (order) => {
          // Calculate total prep time
          const totalPrepTime = order.items.reduce((sum, i) => {
            const prep =
              Number(i.menuItem?.averagePrepTime) ||
              Number(i.menuItem?.prepTime) ||
              5;
            return sum + prep * (i.quantity || 1);
          }, 0);

          // Retrieve last stored remaining time from localStorage (if available)
          const prevRemaining = localStorage.getItem(`order-${order._id}`);

          let remainingTime;

          if (prevRemaining !== null) {
            // ✅ On refresh: decrease remaining time by 1 minute
            remainingTime = Math.max(Number(prevRemaining) - 1, 0);
          } else {
            // ✅ First time load: calculate from createdAt
            const elapsedMins = Math.floor(
              (Date.now() - new Date(order.createdAt)) / 60000
            );
            remainingTime = Math.max(totalPrepTime - elapsedMins, 0);
          }

          // ✅ Update localStorage with new remaining time
          localStorage.setItem(`order-${order._id}`, remainingTime);

          // ✅ Auto-mark as done if time hits 0
          if (
            order.status === "Processing" &&
            remainingTime === 0
          ) {
            const newStatus =
              order.orderType === "Dine-In" ? "Done" : "Not Picked Up";
            await updateOrderStatus(order._id, newStatus);
            localStorage.removeItem(`order-${order._id}`);
            return {
              ...order,
              totalPrepTime,
              remainingTime: 0,
              status: newStatus,
            };
          }

          return {
            ...order,
            totalPrepTime,
            remainingTime,
          };
        })
      );

      setOrders(formattedOrders);
    } catch (err) {
      console.error("❌ Failed to load orders", err);
    }
  };

  fetchOrders();
}, []);





   const formatOrderNum = (num, id) => {
  // Step 1: Extract numeric part of num (e.g., from phone number)
  const numDigits = num ? num.toString().replace(/\D/g, "") : "";

  // Step 2: Convert part of MongoDB ID to a small number (for uniqueness)
  let uniquePart = 0;
  if (id) {
    // take last 4 characters of the ObjectId, convert to ASCII sum
    uniquePart = id
      .slice(-4)
      .split("")
      .reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  }

  // Step 3: Combine both parts → last 3 digits only
  const combined = ((parseInt(numDigits.slice(-3) || "0") + uniquePart) % 1000)
    .toString()
    .padStart(3, "0");

  return combined;
};

  return (
    <div className="orderline-page">
      <div className="orderline-title">
        <h1>Order Line</h1>
      </div>

      <div className="orderline-container">
        {orders.map((order) => {
          
          let cardClass = "";
          if (order.status === "Processing") cardClass = "processing-card";
          else if (order.status === "Done" && order.orderType === "Dine-In")
            cardClass = "done-card";
           else if (order.status === "Not Picked Up")
            cardClass = "gray-card";

          return (
            <div key={order._id} className={`order-card ${cardClass}`}>
              {/* Header */}
              <div className="order-header">
                <div className="order-left">
                  <img src={fk} alt="dine" className="order-icon" />
                  <div>
                    <div className="order-id">#{formatOrderNum(order.num, order._id)}</div>
                    {order.orderType === "Dine-In" && (
                      <div className="order-table">Table-{order.table}</div>
                    )}
                    <div className="order-time">
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    {/* Item count */}
              <div className="order-items-count">
                {order.items.length} Item
              </div>
                  </div>
                </div>

                <div className="order-right">
                  <div
                    className={`order-type ${
                      order.status === "Done"
                        ? "done-type"
                        : order.status === "Not Picked Up"
                        ? "gray-type"
                        : "processing-type"
                    }`}
                  >
                    <p>
                      {order.status === "Processing"
                        ? order.orderType
                        : order.status==="Done"
                        ?"Dine-In"
                        : "Take-away"}
                    </p>
                    <span>
                      {order.status === "Processing"
                        ? `Ongoing: ${order.remainingTime ?? order.totalPrepTime} Min`
                        : order.status === "Done"
                        ? "Served"
                        : "Not Picked Up"}
                    </span>
                  </div>
                </div>
              </div>

              

              {/* Items box */}
              <div className="order-items-box">
                {order.items.map((i, idx) => (
                  <p key={idx}>
                    {i.quantity}x <span>{i.menuItem?.name || "Unknown Item"}</span>
                  </p>
                ))}
              </div>

              {/* Footer */}
              <div className="order-footer">
                {order.status === "Processing" && (
                  <button className="order-btn processing-btn">
                    Processing <img src={processing} alt="timer" />
                  </button>
                )}
                {order.status === "Done" && (
                  <button className="order-btn done-btn">
                    Order Done <img src={done2} alt="done" />
                  </button>
                )}
                {order.status === "Not Picked Up" && (
                  <button className="order-btn gray-btn">
                    Order Done <img src={done1} alt="done" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>

  )
}

export default Orders