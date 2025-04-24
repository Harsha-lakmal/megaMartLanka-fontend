import Navbar from "../components/Navbar";
import img from "../assets/category.png"
import pro from "../assets/products.png"
import sto from "../assets/stock.png"
import ord from "../assets/orders.png"
import cre from "../assets/createorder.png"
import use from "../assets/users.png"
import { useNavigate } from "react-router-dom";


function Home() {
  const navigate = useNavigate()
  return (
    <div>
      <div className="bg-violet-400"> <Navbar page="home" /> </div>
      <div className="grid grid-cols-2 w-max gap-4 md:grid-cols-3 mt-20 mx-auto border-4 border-sky-300   p-4 rounded-xl">
        <div onClick={()=>{navigate("/category")}} className="cursor-pointer bg-slate-100 p-4 hover:shadow-xl hover:shadow-sky-400 rounded-xl grid text-center w-48 h-60" ><div className="w-full text-center"><img className="h-40 w-40" src={img} alt="" /></div><h2 className="font-bold text-blue-800 text-lg">Category</h2></div>
        <div onClick={()=>{navigate("/product")}} className="cursor-pointer bg-slate-100 p-4 hover:shadow-xl hover:shadow-sky-400 rounded-xl grid text-center w-48 h-60" ><div className="w-full text-center"><img className="h-40 w-40" src={pro} alt="" /></div><h2 className="font-bold text-blue-800 text-lg">Products</h2></div>
        <div onClick={()=>{navigate("/stock")}} className="cursor-pointer bg-slate-100 p-4 hover:shadow-xl hover:shadow-sky-400 rounded-xl grid text-center w-48 h-60" ><div className="w-full text-center"><img className="h-40 w-40" src={sto} alt="" /></div><h2 className="font-bold text-blue-800 text-lg">Stock</h2></div>
        <div onClick={()=>{navigate("/order/orders")}} className="cursor-pointer bg-slate-100 p-4 hover:shadow-xl hover:shadow-sky-400 rounded-xl grid text-center w-48 h-60" ><div className="w-full text-center"><img className="h-40 w-40" src={ord} alt="" /></div><h2 className="font-bold text-blue-800 text-lg">Orders</h2></div>
        <div onClick={()=>{navigate("/order/createorder")}} className="cursor-pointer bg-slate-100 p-4 hover:shadow-xl hover:shadow-sky-400 rounded-xl grid text-center w-48 h-60" ><div className="w-full text-center"><img className="h-40 w-40" src={cre} alt="" /></div><h2 className="font-bold text-blue-800 text-lg">Create Order</h2></div>
        <div onClick={()=>{navigate("/user")}} className="cursor-pointer bg-slate-100 p-4 hover:shadow-xl hover:shadow-sky-400 rounded-xl grid text-center w-48 h-60" ><div className="w-full text-center"><img className="h-40 w-40" src={use} alt="" /></div><h2 className="font-bold text-blue-800 text-lg">Users</h2></div>
      </div>
    </div>

  )
}

export default Home;