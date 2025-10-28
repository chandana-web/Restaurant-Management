import axiosClient from "../api/axiosClient";

export const getAllMenuItems = async () => {
  const res = await axiosClient.get("/menu");
  return res;
};

export const addMenuItem = async (itemData) => {
  // Match backend schema exactly
  const payload = {
    name: itemData.name,
    description: itemData.description,
    image: itemData.image || "",
    price: Number(itemData.price),
    category: itemData.category,
    averagePrepTime: Number(itemData.averagePrepTime), // backend expects this exact key
    inStock: Boolean(itemData.inStock),
  };

  const res = await axiosClient.post("/menu", payload);
  return res;
};
