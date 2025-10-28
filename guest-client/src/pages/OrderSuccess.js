import React from 'react'
import "./OrderSuccess.css"

import  { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {

  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(4);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    const redirectTimer = setTimeout(() => {
      navigate("/"); // Redirect to homepage or menu
    }, 4000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);


  return (
     <div className="success-container">
      <div className="success-content">
        <div className="success-icon">✔</div>
        <h2>Thanks For Ordering</h2>
        <p className="redirect-text">Redirecting in {seconds}s</p>
      </div>
    </div>
  )
}

export default OrderSuccess