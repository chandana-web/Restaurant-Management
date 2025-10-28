import{BrowserRouter as Router, Routes, Route } from "react-router-dom"


import './App.css';

import Home from "./pages/Home";
import Checkout from "./pages/Checkout";

import OrderSuccess from "./pages/OrderSuccess";

function App() {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<Home/>}/>
        
        <Route path="/checkout" element={<Checkout/>}/>
        <Route path="/success" element={<OrderSuccess/>}/>
      </Routes>
    </Router>
  );
}

export default App;
