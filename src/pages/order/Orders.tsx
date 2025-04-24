import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import OrderType from "../../types/OrderType";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function Orders() {

    const { isAuthenticated, jwtToken, usertype } = useAuth();
    const navigate = useNavigate()

    const [orders, setOrders] = useState<OrderType[]>([]);
    

    const config = {
        headers: {
            Authorization: `Bearer ${jwtToken}`
        }
    }

    useEffect(function () {
        if (isAuthenticated) {
            if(usertype?.includes("store") || usertype?.includes("chashier")) {
                navigate("/");
            }
            getOrders();
        }
    }, [isAuthenticated])

    async function getOrders() {
        try {
            const response = await axios.get("http://localhost:8085/orders", config);
            setOrders(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <div className="w-full"><Navbar page="order" /></div>

            <div>
                <div className="w-page md:mt-10  bg-white border-2 border-purple-800  m-2 md:mx-2 p-2 md:pb-10 md:px-10 rounded-lg text-center">
                    <h2 className=" md:my-5 text-lg border-4 border-lime-400 rounded-md text-violet-800 font-bold">Orders</h2>
                    <div className="md:flex gap-3 ">
                        <div className=" w-full overflow-x-auto shadow-md sm:rounded-lg">
                            <table className="w-full table-fixed border-separate border-spacing-1 border-2 border-violet-600 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 rounded-lg">
                                <thead className="text-xs  text-gray-700 uppercase  bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr className="border-2 border-violet-600">
                                        <th scope="col" className="px-6 py-3 border-2 border-violet-600 pl-20">
                                            Order ID
                                        </th>
                                        <th scope="col" className="px-6 py-3 border-2 border-violet-600 pl-20">
                                            Order Date Time
                                        </th>
                                        <th scope="col" className="px-6 py-3 border-2 border-violet-600 pl-20">
                                            Total Price
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(function (order) {
                                        return (
                                            <tr className="bg-white border-2 border-violet-600 rounded-lg">
                                                <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap  border-2 border-violet-600 rounded-lg pl-20">
                                                    {order.id}
                                                </td>
                                                <td className="px-6 py-4 border-2 border-violet-600 rounded-lg pl-20">
                                                    {order.orderDateTime}
                                                </td>
                                                <td className="px-6 py-4 border-2 border-violet-600 pl-20 rounded-lg">
                                                    {order.orderTotal}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Orders;