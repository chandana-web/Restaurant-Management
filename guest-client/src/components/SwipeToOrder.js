// SwipeToOrder.jsx
import React from "react";
import { motion, useMotionValue } from "framer-motion";
import "./SwipeToOrder.css";

const SwipeToOrder = ({ onConfirm, threshold = 150, maxX = 250 }) => {
  const x = useMotionValue(0);

  const handleDragEnd = (event, info) => {
    // info.point.x is the drag distance
    if (info.point.x >= threshold) {
      onConfirm();  // trigger order logic
    }
    // Reset position
    x.set(0);
  };

  return (
    <div className="swipe-container">
      <motion.div
        className="swipe-button"
        drag="x"
        style={{ x }}
        dragConstraints={{ left: 0, right: maxX }}
        onDragEnd={handleDragEnd}
      >
        ➜
      </motion.div>
      <p className="swipe-text">Swipe to Order</p>
    </div>
  );
};

export default SwipeToOrder;



