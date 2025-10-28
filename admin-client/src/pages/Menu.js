import React, { useState, useEffect } from 'react'
import "./Menu.css"
import { addMenuItem, getAllMenuItems } from '../api/menuApi'

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    averagePrepTime: "",
    category: "",
    inStock: true,
    image: "",
  });
  const [preview, setPreview] = useState(null);

  // Fetch all menu items
  const fetchMenuItems = async () => {
    try {
      const data = await getAllMenuItems();
      setMenuItems(data);
    } catch (err) {
      console.error("Failed to fetch menu items:", err);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, image: reader.result }));
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
  e.preventDefault(); //  Stops page refresh and duplicate submissions

    if (form.image) {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const maxSize = 5 * 1024 * 1024; // 5 MB

  if (!allowedTypes.includes(form.image.type)) {
    alert("Only JPG, JPEG, PNG, or WEBP image files are allowed!");
    return;
  }

  if (form.image.size > maxSize) {
    alert("Image size should not exceed 5 MB!");
    return;
  }
}


  console.log("Submitting payload:", form);

  try {
    const response = await addMenuItem(form);
    console.log("Item added:", response);
    alert("Menu item added successfully!");

    setForm({
      name: "",
      description: "",
      price: "",
      averagePrepTime: "",
      category: "",
      inStock: false,
      image: "",
    });

    // Refresh menu list after adding item
    fetchMenuItems();

    setShowForm(false); // close modal
  } catch (error) {
    console.error(" Error adding item:", error);
    alert("Failed to add menu item. Check console for details.");
  }
};




  return (
    <div className="menu-page">
      {/* Header */}
      <div className="menu-header">
        <input type="text" placeholder="Search" className="menu-search" />
        <button className="add-btn" onClick={() => setShowForm(true)}>
          + Add Item
        </button>
      </div>

      {/* Menu Grid */}
      <div className='grid-box'>
      <div className="menu-grid">
        {menuItems.map((item) => (
          <div key={item._id} className="menu-card">
            <div className="menu-card-img">
              {item.image ? (
                <img src={item.image} alt={item.name} />
              ) : (
                <div className="placeholder">Image</div>
              )}
            </div>
            <div className="menu-card-content">
              <p><strong>Name:</strong> {item.name}</p>
              <p><strong>Description:</strong> {item.description}</p>
              <p><strong>Price:</strong> ₹{item.price}</p>
              <p><strong>Average Prep Time:</strong> {item.averagePrepTime} Mins</p>
              <p><strong>Category:</strong> {item.category}</p>
              <p><strong>In Stock:</strong> {item.inStock ? "Yes" : "No"}</p>
            </div>
          </div>
        ))}
      </div>
      </div>

      {/* Add Item Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add New Menu Item</h2>
            <form onSubmit={handleSubmit} className="menu-form">
              <label>Name*</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />

              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
              />

              <label>Price*</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
              />

              <label>Average Preparation Time (mins)</label>
              <input
               type="number"
               name="averagePrepTime"
               value={form.averagePrepTime}
               onChange={handleChange}
              />


              <label>Category*</label>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              />

              <label>Image</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} />
              {preview && <img src={preview} alt="Preview" className="menu-preview" />}

              <label className="checkbox-label">In Stock</label>
              <input
                  className='checkbox'
                  type="checkbox"
                  name="inStock"
                  checked={form.inStock}
                  onChange={handleChange}
                />

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Menu