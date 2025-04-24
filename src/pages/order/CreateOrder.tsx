import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import ProductType from "../../types/ProductType";
import axios from "axios";
import StockType from "../../types/StockType";
import CartType from "../../types/CartType";
import StockDtoType from "../../types/StockDtoType";
import { useNavigate } from "react-router-dom";
import back from "../../assets/back.png";

function CreateOrder() {
    const { isAuthenticated, jwtToken, usertype } = useAuth();

    const navigate = useNavigate()

    const [products, setProducts] = useState<ProductType[]>([]);
    const [stocks, setStocks] = useState<StockType[]>([]);
    const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
    const [order, setOrder] = useState<number[]>([]);
    const [qty, setQty] = useState<number>(0);
    const [productId, setProductId] = useState<number>(0);
    const [cartList, setCartList] = useState<CartType[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [stockDtos, setStockDtos] = useState<StockDtoType[]>([]);
    const [search, setSearch] = useState<string>("");
    const [Error, setError] = useState<string>("");

    const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
    const [collectingCash, setCollectingCash] = useState<boolean>(false);
    const [cashCollected, setCashCollected] = useState<boolean>(false);
    const [cashAmount, setCashAmount] = useState<number>(0);

    const config = {
        headers: {
            Authorization: `Bearer ${jwtToken}`
        }
    }

    useEffect(function () {
        if (isAuthenticated) {
            if (usertype?.includes("store")) {
                navigate("/");
            }
            getProducts();
            getStocks();
        }
    }, [isAuthenticated, cartList])

    async function getProducts() {
        try {
            const response = await axios.get("http://localhost:8085/items", config);
            setProducts(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    async function getStocks() {
        try {
            const response = await axios.get("http://localhost:8085/stock", config);
            setStocks(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    async function getFromStock() {
        const data = stockDtos
        try {
            const resonse = await axios.put("http://localhost:8085/stock/getfrom", data, config);
            console.log(resonse.data);
            setStockDtos([]);
        } catch (error) {
            console.log(error);
        }
    }

    async function placeOrder() {
        const data = {
            itemIds: order
        }
        try {
            const resonse = await axios.post("http://localhost:8085/orders", data, config);
            console.log(resonse.data);
            setOrder([]);
        } catch (error) {
            console.log(error);
        }
    }

    function submitOrder() {
        getFromStock();
        placeOrder();
        setCartList([]);
        setIsCartOpen(false);
        getStocks();
        getProducts();
        navigate("/order");
    }


    function addToOrder(product: ProductType) {
        for (let i = 0; i < qty; i++) {
            order.push(product.id);
        }

        const stockitem = stocks.find(stock => stock.item.id === product.id);
        const price = product.price * qty;
        setTotalPrice(totalPrice + price);

        if (stockitem != null) {
            const item: CartType = {
                stockId: stockitem.id,
                itemId: product.id,
                name: product.name,
                description: product.description,
                qty: qty,
                price: price,
            }
            cartList.push(item);
        }

        if (stockitem != null) {
            const stockDto: StockDtoType = {
                id: stockitem.id,
                qty: qty,
            }
            stockDtos.push(stockDto);
        }
        setQty(0);
        setProductId(0);
    }

    function remove(cart: CartType) {
        order.splice(order.indexOf(cart.itemId), cart.qty);
        cartList.splice(cartList.indexOf(cart), 1);

        for (let i = 0; i < stockDtos.length; i++) {
            if (stockDtos[i].id == cart.stockId) {
                stockDtos.splice(i, 1);
            }
        }
        setTotalPrice(totalPrice - cart.price);
    }

    return (


        <div className="w-page ">



            <div className="sticky top-0"><Navbar page="order" /></div>


            {isCheckingOut ? (
                <div className="grid  gap-2 h-max md:mt-2 bg-white border-2 border-purple-800 md:m-auto md:w-[700px] m-2 w-auto p-2 pe-5 rounded-lg text-center ">
                    <div className="grid">

                        <div className="shadow-md">
                            <div className="flex flex-row-reverse m-2 mb-5">
                                <button onClick={()=>{setIsCheckingOut(false)}} className="bg-red-400 hover:bg-red-600 rounded-full">
                                    <img className="h-10 w-10" src={back} alt="" />
                                </button>
                            </div>
                        </div>
                        {cartList.map(function (cart) {
                            return (
                                <div className="shadow-md">
                            <div className="grid grid-cols-3 gap-2 my-1">
                                <label className=" text-left font-bold pl-4">{cart.name}</label>
                                <label className=" text-left font-bold pl-4">{cart.description}</label>
                            </div>
                            <div className="grid grid-cols-4 gap-2 my-1">
                                <label className=" font-semibold">Qty :</label>
                                <label className="text-left text-sm">{cart.qty}</label>
                                <label className=" font-semibold">Price :</label>
                                <label className="text-left text-sm">{cart.price}</label>
                            </div>
                        </div>
                            )
                        })}


                        {/* ------------------Total Price Display Block and Submit Button------------------------------- */}
                        <div className="mt-2 grid grid-cols-2 gap-2 border-t-2 border-black">
                            <label className=" text-left pl-5 font-bold mt-2">Total</label>
                            <label className=" text-right pe-20 mt-2">{totalPrice}</label>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-2 border-t-2 border-black">
                            <label className=" text-left pl-5 font-bold mt-2">Paid Amount</label>
                            {collectingCash ? (
                                <div className="flex flex-row-reverse">
                                    <input autoFocus onChange={(e) => { setCashAmount(parseInt(e.target.value)) }} className="shadow-md rounded-lg text-center w-max m-2" type="text" placeholder="Cash Amount" />
                                </div>
                            ) :
                                (<label onClick={() => { setCollectingCash(true) }} className=" text-right pe-20 mt-2">{cashAmount}</label>)}
                        </div>
                        {cashCollected ? (<div className="mt-2 grid grid-cols-2 gap-2 border-t-2 border-black">
                            <label className=" text-left pl-5 font-bold mt-2">Balance Amount</label>
                            <label className=" text-right pe-20 mt-2">{cashAmount-totalPrice}</label>
                        </div>) :
                            (<div className="hidden mt-2 grid grid-cols-2 gap-2 border-t-2 border-black">
                                <label className=" text-left pl-5 font-bold mt-2">Total</label>
                                <label className=" text-right pe-20 mt-2">{totalPrice}</label>
                            </div>)}
                        <div className="text-right p-2 pe-10 pt-4">
                            {collectingCash ? (<button onClick={() => { setCollectingCash(false); setCashCollected(true) }} className="bg-gradient-to-r from-purple-600 to-violet-400 hover:bg-gradient-to-l p-2 rounded-full">Collect Cash</button>) :
                                cashCollected ? (<button onClick={() => { setCashCollected(false);submitOrder();setIsCheckingOut(false) }} className="bg-gradient-to-r from-purple-600 to-violet-400 hover:bg-gradient-to-l p-2 rounded-full">Check Out</button>) :
                                    (<button className="hidden bg-gradient-to-r from-purple-600 to-violet-400 hover:bg-gradient-to-l p-2 rounded-full">Submiit Order</button>)}
                        </div>
                    </div>
                </div>
            ) :
                (
                    <div>
                        <div className=" flex gap-2 sticky top-20 w-page md:mt-1 bg-slate-200 border-2 border-purple-800 md:m-auto m-2 md:mx-2 p-2 pe-5 rounded-lg text-center h-auto">

                            <div>
                                <form className="flex  ml-10 my-2" >
                                    <svg className="w-10 h-10 rounded-lg py-1 text-gray-800 shadow-md shadow-gray-400 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                                    </svg>

                                    <input type="text" value={search} onChange={(e) => { setSearch(e.target.value) }} className="shadow-md shadow-gray-400 pl-5 py-1 rounded-lg " placeholder="Search Products" />
                                </form>
                            </div>


                            <div className="w-full my-auto text-right flex flex-row-reverse">
                                <label className="bg-red-500 rounded-xl text-white px-1 pt-2">{cartList.length}</label>
                                <button onClick={() => { setIsCartOpen(!isCartOpen) }} className="bg-gradient-to-r from-blue-600 to-sky-400 hover:bg-gradient-to-l rounded-lg my-auto">
                                    <svg className="w-10 h-10 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312" />
                                    </svg>
                                </button>

                            </div>
                        </div>


                        {isCartOpen ? (

                            <div className="grid grid-cols-2 h-auto">

                                <div className=" md:grid md:grid-cols-1 lg:grid-cols-2  gap-2 w-page md:mt-2 bg-white border-2 border-purple-800 md:m-auto m-2 md:mx-2 p-2 pe-5 rounded-lg text-center h-auto">
                                    {products.map(function (product) {
                                        const stockitem = stocks.find(stock => stock.item.id === product.id);

                                        let qoh = 0;

                                        if (stockitem != null) {
                                            qoh = stockitem.qoh;
                                        }
                                        else {
                                            qoh = 1;
                                        }

                                        if (product.name.toLowerCase().includes(search) || product.category.name.toLowerCase().includes(search) || product.description.toLowerCase().includes(search)) {
                                            return (

                                                <div className="w-full grid bg-white border-2 border-purple-800 md:m-auto m-2 md:mx-2 p-2  rounded-lg text-center h-auto">
                                                    <div className="border-2 border-sky-600 w-full rounded-lg font-bold text-lg">
                                                        <label >{product.name}</label>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2 p-2  w-full mt-1 rounded-lg">
                                                        <label className="shadow-lg rounded-lg shadow-sky-300 font-semibold" >Description</label>
                                                        <label className="shadow-lg rounded-lg shadow-violet-300 text-sm ">{product.description}</label>
                                                        <label className="shadow-lg rounded-lg shadow-sky-300 font-semibold">Price</label>
                                                        <label className="shadow-lg rounded-lg shadow-violet-300 text-sm">{product.price}</label>
                                                        <label className="shadow-lg rounded-lg shadow-sky-300 font-semibold">QOH</label>
                                                        <label className="shadow-lg rounded-lg shadow-violet-300 text-sm">{qoh}</label>
                                                    </div>
                                                    {productId == product.id ? (
                                                        <div className="grid grid-cols-2 gap-2  w-full mt-2 border-t-2 border-black pt-2 ">
                                                            <input type="text" onChange={(e) => { setQty(parseInt(e.target.value)); setError(""); }} onClick={() => { setProductId(product.id); setQty(0); }} className="shadow-md shadow-lime-400 pl-2 py-1 rounded-lg text-center" placeholder="Qty" />
                                                            {qty != 0 && qty <= qoh ? (
                                                                <button type="button" onClick={() => {
                                                                    addToOrder(product); setSearch(""); setProductId(0);
                                                                }} className="bg-gradient-to-r from-green-600 to-lime-400 hover:bg-gradient-to-l rounded-full font-semibold text-white ">Add</button>
                                                            ) : (
                                                                <button type="button" onClick={() => { setQty(0); setError("Qty can't be 0 or greater than Qoh"); }} className="bg-gradient-to-r from-green-600 to-lime-400 hover:bg-gradient-to-l rounded-full font-semibold text-white ">Add</button>
                                                            )}

                                                        </div>
                                                    ) : (
                                                        <div className="grid grid-cols-2 gap-2  w-full mt-2 border-t-2 border-black pt-2 ">
                                                            <input type="text" value={0} onClick={() => { setProductId(product.id); setQty(0); }} className="shadow-md shadow-lime-400 pl-2 py-1 rounded-lg text-center" placeholder="Qty" />
                                                            <button type="button" className="bg-gradient-to-r from-green-600 to-lime-400 hover:bg-gradient-to-l rounded-full font-semibold text-white ">Add</button>
                                                        </div>
                                                    )}
                                                    {product.id === productId ? (<div className="text-red-500 text-sm">{Error}</div>) : (<div className="text-red-500 text-sm"></div>)}

                                                </div>

                                            )
                                        }

                                    })}
                                </div>



                                <div className="grid sticky top-40 gap-2 h-max md:mt-2 bg-white border-2 border-purple-800 md:m-auto m-2 md:mx-2 p-2 pe-5 rounded-lg text-center ">
                                    <div className="grid">
                                        {cartList.map(function (cart) {
                                            return (

                                                <div className="shadow-md">
                                                    <div className="grid grid-cols-3 gap-2 my-1">
                                                        <label className=" text-left font-bold pl-4">{cart.name}</label>
                                                        <label className=" text-left font-bold pl-4">{cart.description}</label>
                                                        <div className="text-right pe-2">
                                                            <button onClick={() => { remove(cart) }} className="bg-red-400 hover:bg-red-600 rounded-full">
                                                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-4 gap-2 my-1">
                                                        <label className=" font-semibold">Qty :</label>
                                                        <label className="text-left text-sm">{cart.qty}</label>
                                                        <label className=" font-semibold">Price :</label>
                                                        <label className="text-left text-sm">{cart.price}</label>
                                                    </div>
                                                </div>
                                            )
                                        })}


                                        <div className="mt-2 grid grid-cols-2 gap-2 border-t-2 border-black">
                                            <label className=" text-left pl-5 font-bold mt-2">Total</label>
                                            <label className=" text-right pe-20 mt-2">{totalPrice}</label>
                                        </div>
                                        <div className="text-right p-2 pe-10 pt-4">
                                            <button onClick={() => {setIsCheckingOut(true) }} className="bg-gradient-to-r from-purple-600 to-violet-400 hover:bg-gradient-to-l p-2 rounded-full">Ckeck Out</button>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        ) : (

                            <div className="">
                                <div className="  md:grid md:grid-cols-3 sm:grid sm:grid-cols-2 gap-2 w-page md:mt-2 bg-white border-2 border-purple-800 md:m-auto m-2 md:mx-2 p-2 pe-5 rounded-lg text-center h-auto">
                                    {products.map(function (product) {
                                        const stockitem = stocks.find(stock => stock.item.id === product.id);
                                        let qoh = 0;

                                        if (stockitem != null) {
                                            qoh = stockitem.qoh;
                                        }
                                        else {
                                            qoh = 1;
                                        }
                                        if (product.name.toLowerCase().includes(search) || product.category.name.toLowerCase().includes(search) || product.description.toLowerCase().includes(search)) {
                                            return (

                                                <div className="w-full grid bg-white border-2 border-purple-800 md:m-auto m-2 md:mx-2 p-2  rounded-lg text-center h-auto">
                                                    <div className="border-2 border-sky-600 w-full rounded-lg font-bold text-lg">
                                                        <label >{product.name}</label>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2 p-2  w-full mt-1 rounded-lg">
                                                        <label className="shadow-lg rounded-lg shadow-sky-300 font-semibold" >Description</label>
                                                        <label className="shadow-lg rounded-lg shadow-violet-300 text-sm ">{product.description}</label>
                                                        <label className="shadow-lg rounded-lg shadow-sky-300 font-semibold">Price</label>
                                                        <label className="shadow-lg rounded-lg shadow-violet-300 text-sm">{product.price}</label>
                                                        <label className="shadow-lg rounded-lg shadow-sky-300 font-semibold">QOH</label>
                                                        <label className="shadow-lg rounded-lg shadow-violet-300 text-sm">{qoh}</label>
                                                    </div>
                                                    {productId == product.id ? (
                                                        <div className="grid grid-cols-2 gap-2  w-full mt-2 border-t-2 border-black pt-2 ">
                                                            <input type="text" onChange={(e) => { setQty(parseInt(e.target.value)); setError("") }} onClick={() => { setProductId(product.id); setQty(0); }} className="shadow-md shadow-lime-400 pl-2 py-1 rounded-lg text-center" placeholder="Qty" />
                                                            {qty != 0 && qty <= qoh ? (
                                                                <button type="button" onClick={() => {
                                                                    addToOrder(product);
                                                                    setSearch("");
                                                                    setProductId(0);
                                                                }} className="bg-gradient-to-r from-green-600 to-lime-400 hover:bg-gradient-to-l rounded-full font-semibold text-white ">Add</button>
                                                            ) : (
                                                                <button type="button" onClick={() => { setQty(0); setError("Qty can't be 0 or greater than Qoh"); }} className="bg-gradient-to-r from-green-600 to-lime-400 hover:bg-gradient-to-l rounded-full font-semibold text-white ">Add</button>
                                                            )}

                                                        </div>
                                                    ) : (
                                                        <div className="grid grid-cols-2 gap-2  w-full mt-2 border-t-2 border-black pt-2 ">
                                                            <input type="text" value={0} onClick={() => { setProductId(product.id); setQty(0); }} className="shadow-md shadow-lime-400 pl-2 py-1 rounded-lg text-center" placeholder="Qty" />
                                                            <button type="button" className="bg-gradient-to-r from-green-600 to-lime-400 hover:bg-gradient-to-l rounded-full font-semibold text-white ">Add</button>
                                                        </div>
                                                    )}
                                                    {product.id === productId ? (<div className="text-red-500 text-sm">{Error}</div>) : (<div className="text-red-500 text-sm"></div>)}

                                                </div>

                                            )
                                        }

                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}





        </div>

    )
}

export default CreateOrder;