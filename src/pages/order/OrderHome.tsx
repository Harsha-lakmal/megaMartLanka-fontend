import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";

function OrderHome() {
    const { isAuthenticated, usertype} = useAuth();

    const navigate = useNavigate()

    useEffect(function () {
        if (isAuthenticated) {
            if(usertype?.includes("store")) {
                navigate("/");
            }
        }
    }, [isAuthenticated])

    return (
        <div>
            <Navbar page="order" />
            <div>
                <div className="grid grid-cols-1 pe-4 ">
                    <div className="sticky top-20  w-full md:mt-10 bg-white border-2 border-purple-800 md:m-auto m-2 md:mx-2 p-2 md:px-10 rounded-lg text-center h-auto">
                        <h2 className=" md:my-5 text-lg border-4 border-lime-400 rounded-md text-violet-800 font-bold">Order</h2>
                        <div className="grid md:grid-cols-2 gap-3 pb-5 pt-2 md:item-center">
                            <Link to="/order/orders"><button type="button" className="w-full s:me-4 md:mb-0 mb-2 px-6 py-3.5 text-base font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Orders</button></Link>
                            <Link to="/order/createorder"> <button type="button" className="w-full px-6 py-3.5 text-base font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Create Order</button></Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderHome;