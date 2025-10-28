import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import "./Home.css"

import burgerIcon from "../assets/burgerIcon.png";
import biryaniIcon from "../assets/biryani.png"
import cakeIcon from "../assets/cake.png"
import chickenIcon from "../assets/chickenIcon.png"
import drinkIcon from "../assets/drinkIcon.png"
import frenchfriesIcon from "../assets/frenchfriesIcon.png"
import iceCreamIcon from "../assets/ice-cream.png"
import pizzaIcon from "../assets/pizzaIcon1.png"
import searchIcon from "../assets/searchIcon.png"
import soupIcon from "../assets/soup.png";
import veggiesIcon from "../assets/veggiesIcon.png"
import { getAllMenuItems } from '../api/guestApi';
import fallback from "../assets/image1.png"

const Home = () => {
   const [showForm, setShowForm] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [cart, setCart] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    persons: "",
    address: "",
    contact: ""
  });

  const navigate = useNavigate();

  // 🕒 Greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 16) return "Good afternoon";
    return "Good evening";
  };

  const categories = [
    { name: "Burger", icon: burgerIcon },
    { name: "Pizza", icon: pizzaIcon },
    { name: "Drink", icon: drinkIcon },
    { name: "French fries", icon: frenchfriesIcon },
    { name: "Veggies", icon: veggiesIcon },
    { name: "Biryani", icon: biryaniIcon },
    { name: "Cake", icon: cakeIcon },
    { name: "Chicken", icon: chickenIcon },
    { name: "Ice Cream", icon: iceCreamIcon },
    { name: "Soup", icon: soupIcon },
  ];

  // 🔹 Fetch menu items
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await getAllMenuItems();
        setMenuItems(data);
        setFilteredMenu(data);
      } catch (err) {
        console.error("Error fetching menu:", err);
        alert("Failed to load menu items. Please try again later.");
      }
    };
    fetchMenu();
  }, []);

  // 🔹 Filter by category and search
  useEffect(() => {
    let items = menuItems;

    if (selectedCategory) {
      items = items.filter(
        (item) =>
          item.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchTerm.trim()) {
      items = items.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMenu(items);
  }, [selectedCategory, searchTerm, menuItems]);

  const handleFormSubmit = (e) => {
  e.preventDefault();

  if (!formData.name.trim() || !formData.persons.trim() || !formData.contact.trim() || !formData.address.trim()) {
    alert("Please fill all the details before continuing.");
    return; //Stop form from closing
  }

  // Save user details once filled
  localStorage.setItem("userDetails", JSON.stringify(formData));
  setShowForm(false); // hide form only when details are valid
};

  // Cart management
  const handleAdd = (item) => {
    setCart((prev) => ({
      ...prev,
      [item._id]: (prev[item._id] || 0) + 1,
    }));
  };

  const handleRemove = (item) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (newCart[item._id] > 1) newCart[item._id]--;
      else delete newCart[item._id];
      return newCart;
    });
  };

 // 🔹 Navigate to cart
const handleNext = () => {
  const cartItems = Object.keys(cart).map((id) => {
    const item = menuItems.find((m) => m._id === id);
    return { ...item, quantity: cart[id] };
  });

  if (cartItems.length === 0) {
    alert("Please add at least one item before proceeding.");
    return;
  }

  // Ensure details exist before proceeding
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  if (!userDetails || !userDetails.name || !userDetails.contact) {
    alert("Please fill your details before proceeding.");
    setShowForm(true); // reopen form if details missing
    return;
  }

  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  navigate("/checkout");
};



  return (
    <div className="home-container">
      {/* Header */}
      <div className="home-header">
        <h2>{getGreeting()}</h2>
        <p className="subtitle">Place your order here</p>

        <div className="search-wrapper">
          <img src={searchIcon} alt="search" className="search-icon" />
          <input
            type="text"
            placeholder="Search"
            className="search-bar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="category-tabs">
          {categories.map((cat, i) => (
            <div
              key={i}
              className={`category ${
                selectedCategory === cat.name ? "active-category" : ""
              }`}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === cat.name ? "" : cat.name
                )
              }
            >
              <img src={cat.icon} alt={cat.name} />
              <p>{cat.name}</p>
            </div>
          ))}
        </div>
      </div>

      <h3 className="section-title">{selectedCategory || "All Items"}</h3>

      {/* Menu List */}
      <div className="menu-scroll">
        <div className="menu-grid">
          {filteredMenu.length > 0 ? (
            filteredMenu.map((item) => (
              <div key={item._id} className="menu-card">
                <img
                  src={
                    item.image?.startsWith("data:image")
                      ? item.image
                      : `http://localhost:5000${
                          item.image?.startsWith("/") ? "" : "/"
                        }${item.image || ""}`
                  }
                  alt={item.name}
                  className="menu-item-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = fallback;
                  }}
                />

                <div className="card-info">
                  <p>{item.name}</p>
                  <p>₹ {item.price}</p>
                </div>

                {cart[item._id] ? (
                  <div className="qty-controls">
                    <button onClick={() => handleRemove(item)}>-</button>
                    <span>{cart[item._id]}</span>
                    <button onClick={() => handleAdd(item)}>+</button>
                  </div>
                ) : (
                  <button
                    className="add-btn"
                    onClick={() => handleAdd(item)}
                  >
                    +
                  </button>
                )}
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center", color: "#777" }}>No items found</p>
          )}
        </div>
      </div>

      <button className="next-btn" onClick={handleNext}>Next</button>

      {/* Transparent Form */}
      {showForm && (
        <div className="overlay">
          <div className="form-box">
            <h3>Enter Your Details</h3>
            <form onSubmit={handleFormSubmit}>
              <label>Name</label>
              <input type="text" value={formData.name} placeholder="full name" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              <label>Number of Person</label>
              <input type="text" value={formData.persons} placeholder="2, 4, 6" onChange={(e) => setFormData({ ...formData, persons: e.target.value })}/>
              <label>Address</label>
              <input type="text" placeholder="address" value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}/>
              <label>Contact</label>
              <input type="text" placeholder="phone" value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}/>
              <button
                type="submit"
                
                className="order-btn"
              >
                Order Now
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home