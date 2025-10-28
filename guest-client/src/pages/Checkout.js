import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Checkout.css";
import { createOrder } from '../api/guestApi'; // 🔹 Make sure you have this API function
import SwipeToOrder from '../components/SwipeToOrder';

import locationIcon from "../assets/location.png"
import clockIcon from "../assets/clock.png"

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [orderType, setOrderType] = useState("dine-in");
  const [address, setAddress] = useState("");
  const [total, setTotal] = useState(0);
  const [user, setUser] = useState({});
  const [showInstructionModal, setShowInstructionModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [instructions, setInstructions] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    const storedUser = JSON.parse(localStorage.getItem("userDetails")) || {};
    setCart(storedCart);
    setUser(storedUser);
    setAddress(storedUser.address || "");
    const sum = storedCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(sum);
  }, []);

  // Greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Update totals whenever cart changes
  useEffect(() => {
    const sum = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(sum);
  }, [cart]);

  // Quantity handlers
  const handleAdd = (itemId) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleRemove = (itemId) => {
    const updated = cart
      .map((item) =>
        item._id === itemId ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);

    setCart(updated);

    if (updated.length === 0) {
      alert("Cart is empty, redirecting to menu.");
      navigate("/"); // redirect to home/menu
    }
  };

  const openInstructionModal = (item) => {
    setCurrentItem(item);
    setShowInstructionModal(true);
  };

  const saveInstructions = () => {
    if (currentItem) {
      setInstructions((prev) => ({
        ...prev,
        [currentItem._id]: currentItem.tempInstruction || "",
      }));
    }
    setShowInstructionModal(false);
  };

  const deliveryCharge = orderType === "take-away" ? 50 : 0;
  const tax = orderType === "take-away" ? 5 : 0;
  const grandTotal = total + deliveryCharge + tax;

  const handleSwipeToOrder = async () => {
  try {
    if (!user.name?.trim() || !user.contact?.trim()) {
      alert("Please fill in your name and contact details.");
      return;
    }

    if (orderType === "take-away" && !address.trim()) {
      alert("Please provide a valid delivery address for take-away orders.");
      return;
    }

    if (cart.length === 0) {
      alert("Please add at least one item before placing the order.");
      return;
    }

    const formattedItems = cart.map((item) => ({
      menuItem: item._id,
      quantity: item.quantity,
      instructions: instructions[item._id] || "",
    }));

    const orderData = {
      customerName: user.name,
      num: user.contact,
      orderType: orderType === "dine-in" ? "Dine-In" : "Take-Away",
      numOfPeople: Number(user.persons) || 1,
      tableNumber: orderType === "dine-in" ? user.tableNumber || null : null,
      items: formattedItems,
    };

     await createOrder(orderData);
    localStorage.removeItem("cartItems");
    navigate("/success");
  } catch (err) {
    console.error("❌ Order creation failed:", err);
    alert(err?.response?.data?.message || "Failed to create order. Please try again.");
  }
};


  const filteredCart = cart.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="checkout-container">
      {/* Greeting */}
      <h2>{getGreeting()}</h2>
      <p className="subtitle">Place your order here</p>

      {/* Search */}
      <div className="search-wrapper">
        <input
          type="text"
          placeholder="Search"
          className="search-bar1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Cart Items */}
      <div className="cart-items">
        {filteredCart.map((item) => (
          <div key={item._id} className="cart-item">
            <img src={item.image} alt={item.name} className="cart-item-img" />
            <div className="cart-info">
              <h4>{item.name}</h4>
              <p>₹ {item.price}</p>
              {item.description && <p className="description">{item.description}</p>}
              <div className="quantity-controls">
                <button onClick={() => handleRemove(item._id)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleAdd(item._id)}>+</button>
              </div>
              <div
                className="instruction-trigger"
                onClick={() => openInstructionModal(item)}
              >
                {instructions[item._id]
                  ? `📝 ${instructions[item._id]}`
                  : "Add cooking instructions (optional)"}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="section-divider"></div>

      {/* Dine-in / Take-away toggle */}
      <div className="toggle">
        <button
          className={orderType === "dine-in" ? "active" : ""}
          onClick={() => setOrderType("dine-in")}
        >
          Dine In
        </button>
        <button
          className={orderType === "take-away" ? "active" : ""}
          onClick={() => setOrderType("take-away")}
        >
          Take Away
        </button>
      </div>

     <div className="price-summary">
        <p><span>Item Total</span> <span>₹{total.toFixed(2)}</span></p>
        {orderType === "take-away" && (
          <>
            <p><span>Delivery Charge</span> <span>₹{deliveryCharge}</span></p>
            <p><span>Taxes</span> <span>₹{tax}</span></p>
          </>
        )}
        <h3><span>Grand Total</span> <span>₹{grandTotal.toFixed(2)}</span></h3>
      </div>

    <div className="section-divider"></div>

      {/* User Details */}
      <div className="user-details">
        <p className='userHeading'>Your details</p>
        <p>{user.name}, {user.contact}</p>

        <div className="section-divider"></div>

        {orderType === "take-away" && (
          <div className="address-box">
            <div className='location'>
              <img src={locationIcon} alt=''/>
              <p>Delivery at - {address}</p>
            </div>
            <div className='dtime'>
              <img src={clockIcon} alt=''/>
              <p>Delivery in 42 mins</p>
            </div>
          </div>
        )}
      </div>
  {/* Bill Summary */}
     
      {/* Swipe to Order */}
      <SwipeToOrder onConfirm={handleSwipeToOrder} />

      {/* Cooking Instructions Modal */}
      {showInstructionModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button className="close-btn" onClick={() => setShowInstructionModal(false)}>✕</button>
            <h3>Add Cooking Instructions</h3>
            <textarea
              placeholder="Write your instructions here..."
              onChange={(e) =>
                setCurrentItem({
                  ...currentItem,
                  tempInstruction: e.target.value,
                })
              }
            />
            <p className="note">
              The restaurant will try its best to follow your request. However, refunds or cancellations in this regard won’t be possible.
            </p>
            <div className="modal-actions">
              
              <button className="cancel-btn" onClick={() => setShowInstructionModal(false)}>Cancel</button>
              <button className="next-btn1" onClick={saveInstructions}>Next</button>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
