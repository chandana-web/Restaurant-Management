const MenuItem=require("../models/MenuItem");


// GET all menu items
const getMenuItems=async(req,res)=>{
    try{
        const items=await MenuItem.find();
        res.status(200).json(items);
    }catch(err){
         res.status(500).json({ message: "Error fetching menu items", error });
    }
}


//Post new menu item
const addMenuItem=async(req,res)=>{
    try{
        const {name, description, image,price, category, averagePrepTime}=req.body;
        const newItem= new MenuItem({
            name, description, image,price, category, averagePrepTime,
        })
        await newItem.save();
        res.status(201).json({ message: "Menu item added successfully", item: newItem });
    }catch(err){
        res.status(500).json({ message: "Error adding menu item", error });
    }
}

//Update
// const updateMenuItem=async(req,res)=>{
//     try{
//         const item=await MenuItem.findByIdAndUpdate(req.params.id, req.body, {new:true});
//         res.status(200).json({ message: "Item updated successfully", item });
//     }catch (error) {
//     res.status(500).json({ message: "Error updating item", error });
//   }
// }

// DELETE menu item
// const deleteMenuItem = async (req, res) => {
//   try {
//     await MenuItem.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "Menu item deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting item", error });
//   }
// };


module.exports = {
  getMenuItems,
  addMenuItem,
//   updateMenuItem,
//   deleteMenuItem,
};