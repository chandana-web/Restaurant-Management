const express=require("express");
const router=express.Router();
const {addMenuItem, getMenuItems}=require("../controllers/menuCon");

router.post("/", addMenuItem);

// GET all menu items by category (for guest page)
router.get("/category/:category", async (req, res) => {
  try {
    const items = await MenuItem.find({ category: req.params.category });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching menu items", error });
  }
});

router.get("/", getMenuItems)


module.exports=router;