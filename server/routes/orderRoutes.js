const express =require("express");
const router=express.Router();
const{
    createOrder,
    getAllOrders,
    updateOrderStatus,
}=require("../controllers/orderCon");

//Guest -create new order
router.post("/", createOrder);

//Admin- get all orders
router.get("/", getAllOrders);

//Admin - update order Status
router.patch("/:id/status", updateOrderStatus);

module.exports=router;