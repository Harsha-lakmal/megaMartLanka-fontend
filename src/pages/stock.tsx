import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import ProductType from "../types/ProductType";
import StockType from "../types/StockType";
import axios from "axios";
import StockDtoType from "../types/StockDtoType";
import { useNavigate } from "react-router-dom";


function Stock() {

    const { isAuthenticated, jwtToken, usertype } = useAuth();
    const navigate = useNavigate()

    const [newProduct, setNewProduct] = useState<boolean>(false);
    const [extProduct, setExtProduct] = useState<boolean>(false);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [stockId, setStockId] = useState<number>(0);
    const [productId, setProductId] = useState<number>(0)
    const [qty, setQty] = useState<number>(0);
    const [products, setProducts] = useState<ProductType[]>([]);
    const [stockAvailable, setStockAvailable] = useState<StockType[]>([]);
    const [newProducts, setNewProducts] = useState<ProductType[]>([]);
    const [stockOrder, setStockOrder] = useState<StockType[]>([]);
    const [stockDtos, setStockDtos] = useState<StockDtoType[]>([]);
    const [Error, setError] = useState<string>("");

    const config = {
        headers: {
            Authorization: `Bearer ${jwtToken}`
        }
    }

    useEffect(function () {
        if (isAuthenticated) {
            if(usertype?.includes("chashier")) {
                navigate("/");
            }
            getStockAvailable();
            getProducts();
            setNewProducts(filterNewProducts());
        }
    }, [isAuthenticated])

    useEffect(function () {
        if (isAuthenticated) {
            setNewProducts(filterNewProducts());
        }
    }, [stockAvailable])

    useEffect(function () {
        if (isAuthenticated) {
            getStockAvailable();
        }
    }, [stockOrder])


    async function getStockAvailable() {
        try {
            const resonse = await axios.get("http://localhost:8085/stock", config);
            setStockAvailable(resonse.data);
        } catch (error) {
            console.log(error);
        }
    }

    async function getProducts() {
        try {
            const resonse = await axios.get("http://localhost:8085/items", config);
            setProducts(resonse.data);
        } catch (error) {
            console.log(error);
        }
    }

    async function createStock() {
        const data = {
            id: productId,
            qty: qty
        }

        try {
            const resonse = await axios.post("http://localhost:8085/stock", data, config);
            console.log(resonse.data);
            getStockAvailable();
            setQty(0);
            setProductId(0);
            setNewProducts(filterNewProducts());
        } catch (error) {
            console.log(error);
        }
    }

    async function update() {
        if (usertype?.includes("admin")) {
            const data = {
                id: stockId,
                qty: qty
            }
    
            try {
                const resonse = await axios.put("http://localhost:8085/stock", data, config);
                console.log(resonse.data);
                getStockAvailable();
                setQty(0);
            } catch (error) {
                console.log(error);
            }
        } else {
            setError("You are not authorized to update stock");
            setQty(0);
            setIsUpdating(false);
            setProductId(0);
           
        } 
    }

    async function addToStock() {
        const data = stockDtos

        try {
            const resonse = await axios.put("http://localhost:8085/stock/addto", data, config);
            console.log(resonse.data);
            setStockDtos([]);
            setStockOrder([]);
            getStockAvailable();
        } catch (error) {
            console.log(error);
        }
    }

    function filterNewProducts(): any[] {

        let items: ProductType[] = [];

        for (let i = 0; i < products.length; i++) {
            const product = products[i];

            const existsInStock = stockAvailable.some(stock => stock.item.id === product.id);

            if (!existsInStock) {
                items.push(product);
            }
        }
        return items;
    }

    function addToStockOrder(stock: StockType) {
        stock.qoh = qty;
        stockOrder.push(stock);

        const stockDto: StockDtoType = {
            id: stock.id,
            qty: stock.qoh
        }

        stockDtos.push(stockDto);
    }

    function removeFromStockOrder(stock: StockType) {
        stockOrder.splice(stockOrder.indexOf(stock), 1);
        
        for(let i=0; i<stockDtos.length; i++){
            if(stockDtos[i].id == stock.id){
                stockDtos.splice(i, 1);
            }
        }

        getStockAvailable();
    }

    return (
        <div>
            <div></div>
            <div className="sticky top-0"><Navbar page="stock" /></div>
            <div className="">
                <div className="grid grid-cols-1 pe-4 ">
                    <div className="w-full md:mt-10 bg-white border-2 border-purple-800 md:m-auto m-2 md:mx-2 p-2 md:px-10 rounded-lg text-center h-auto">
                        <h2 className=" md:my-5 text-lg border-4 border-lime-400 rounded-md text-violet-800 font-bold">Available Products</h2>
                        {newProduct ? (<div className=" w-full overflow-x-auto shadow-md sm:rounded-lg">
                            <table className="w-full table-fixed border-separate border-spacing-1 rounded-lg border-2 border-violet-600 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs  text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr className="border-2 border-violet-600">
                                        <th scope="col" className="px-6 py-3 border-2 border-violet-600">
                                            Product Name
                                        </th>
                                        <th scope="col" className="px-6 py-3 border-2 border-violet-600">
                                            Description
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-center w-60 border-2 border-violet-600">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {newProducts.map(function (product) {
                                        return (<tr className="bg-white border-2 border-white border-2 border-violet-600">
                                            <td scope="row" className="px-6 py-4 font-medium text-lgtext-gray-900 whitespace-nowrap  border-2 border-violet-600 rounded-lg">
                                                {product.name}
                                            </td>
                                            <td className="px-6 py-4 border-2 border-violet-600 rounded-lg">
                                                {product.description}
                                            </td>
                                            <td className="pe-4 py-4 text-right border-2  border-violet-600 rounded-lg">

                                                {qty != 0 && productId == product.id ? (<div className="flex gap-2">
                                                    <input type="text" value={qty} onClick={() => { setProductId(product.id);setError(""); }} onChange={(e) => { setQty(parseInt(e.target.value)) }} className="mx-2 px-2 rounded-xl text-center w-20 border-2" placeholder="Quantity" />
                                                    <button type="button" onClick={() => { createStock(); setError(""); }} className="w-20  py-1 bg-gradient-to-r from-green-700 to-lime-300 md:mt-0 mt-2 rounded-xl border-2 border-yellow-400 text-white font-semibold hover:bg-gradient-to-l  hover:border-black">ADD</button>
                                                </div>

                                                ) : (
                                                    <div className="flex gap-2">
                                                        <input type="text" value={0} onClick={() => { setProductId(product.id);setError(""); }} onChange={(e) => { setQty(parseInt(e.target.value)) }} className="mx-2 px-2 rounded-xl text-center w-20 border-2" placeholder="Quantity" />
                                                        <button type="submit" className="w-20  py-1 bg-gradient-to-r from-green-700 to-lime-300 md:mt-0 mt-2 rounded-xl border-2 border-yellow-400 text-white font-semibold hover:bg-gradient-to-l  hover:border-black">ADD</button>
                                                    </div>

                                                )}

                                            </td>
                                        </tr>)
                                    })}

                                </tbody>
                            </table>
                        </div>
                        ) : extProduct ?
                            (<div className=" w-full overflow-x-auto shadow-md sm:rounded-lg">
                                <table className="w-full table-fixed border-separate border-spacing-1 rounded-lg border-2 border-violet-600 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs  text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr className="border-2 border-violet-600">
                                            <th scope="col" className="px-6 py-3 border-2 border-violet-600">
                                                Product Name
                                            </th>
                                            <th scope="col" className="px-6 py-3 border-2 border-violet-600">
                                                Description
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-center w-60 border-2 border-violet-600">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stockAvailable.map(function (stock) {
                                            if (!stockOrder.some(stocko => stocko.id === stock.id)) {
                                                return (
                                                    <tr className="bg-white border-2 border-white border-2 border-violet-600">
                                                        <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap  border-2 border-violet-600 rounded-lg">
                                                            {stock.item.name}
                                                        </td>
                                                        <td className="px-6 py-4 border-2 border-violet-600 rounded-lg">
                                                            {stock.item.description}
                                                        </td>
                                                        <td className="pe-4 py-4 text-right border-2 border-violet-600 rounded-lg">
                                                            {qty != 0 && productId == stock.id ? (
                                                                <div className="flex gap-2">
                                                                    <input type="text" value={qty} onClick={() => { setProductId(stock.id) }} onChange={(e) => { setQty(parseInt(e.target.value)) }} className="mx-2 px-2 rounded-xl text-center w-20 border-2" placeholder="Quantity" />
                                                                    <button type="button" onClick={() => { addToStockOrder(stock); setQty(0); setProductId(0);}} className="w-20  py-1 bg-gradient-to-r from-green-700 to-lime-300 md:mt-0 mt-2 rounded-xl border-2 border-yellow-400 text-white font-semibold hover:bg-gradient-to-l  hover:border-black">ADD</button>
                                                                </div>
                                                            ) : (
                                                                <div className="flex gap-2">
                                                                    <input type="text" value={0} onClick={() => { setProductId(stock.id); }} onChange={(e) => { setQty(parseInt(e.target.value)) }} className="mx-2 px-2 rounded-xl text-center w-20 border-2" placeholder="Quantity" />
                                                                    <button type="button" className="w-20  py-1 bg-gradient-to-r from-green-700 to-lime-300 md:mt-0 mt-2 rounded-xl border-2 border-yellow-400 text-white font-semibold hover:bg-gradient-to-l  hover:border-black">ADD</button>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>)
                                            }
                                        })}
                                    </tbody>
                                </table>
                            </div>) :
                            (<div className="grid md:grid-cols-2 gap-3 pb-5 pt-2 md:item-center">
                                <button type="button" onClick={() => { setNewProduct(true); setExtProduct(false); filterNewProducts(); setNewProducts(filterNewProducts());setError("");}} className="s:me-4 md:mb-0 mb-2 px-6 py-3.5 text-base font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">New Products</button>
                                <button type="button" onClick={() => { setExtProduct(true); setNewProduct(false); setError("");}} className="px-6 py-3.5 text-base font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Existing Products</button>
                            </div> 
                        )}
                        <div className="text-sm text-red-600">{Error}</div>
                    </div>
                    {/* bottom division */}
                    <div className="w-full  bg-white border-2 border-purple-800  m-2 md:mx-2 p-2 md:px-10 rounded-lg text-center">
                        {newProduct ? (<h2 className=" md:my-5 text-lg border-4 border-lime-400 rounded-md text-violet-800 font-bold">Available Stock</h2>) : extProduct ? (<h2 className=" md:my-5 text-lg border-4 border-lime-400 rounded-md text-violet-800 font-bold">Stock Order</h2>) : (<h2 className=" md:my-5 text-lg border-4 border-lime-400 rounded-md text-violet-800 font-bold">Available Stock</h2>)}

                        {newProduct ? (
                            <div className="">
                                <div className=" w-full overflow-x-auto shadow-md sm:rounded-lg">
                                    <table className="w-full table-fixed border-separate border-spacing-1 rounded-lg border-2 border-violet-600 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                        <thead className="text-xs  text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                            <tr className="border-2 border-violet-600">
                                                <th scope="col" className="px-6 py-3 border-2 border-violet-600">
                                                    Product Name
                                                </th>
                                                <th scope="col" className="px-6 py-3 border-2 border-violet-600">
                                                    Description
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-center w-60 border-2 border-violet-600">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stockAvailable.map(function (stock) {
                                                return (<tr className="bg-white border-2 border-white border-2 border-violet-600">
                                                    <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap  border-2 border-violet-600 rounded-lg">
                                                        {stock.item.name}
                                                    </td>
                                                    <td className="px-6 py-4 border-2 border-violet-600 rounded-lg">
                                                        {stock.item.description}
                                                    </td>
                                                    <td className="pe-4 py-4 text-right border-2 border-violet-600 rounded-lg">
                                                        {isUpdating && stockId === stock.id ? (<div className="flex gap-2">
                                                            <input type="text" autoFocus onChange={(e) => { setQty(parseInt(e.target.value)) }} className="mx-2 px-2 rounded-xl text-center w-20 border-2 border-sky-500" placeholder="Quantity" />
                                                            <button type="button" onClick={() => { update(); setIsUpdating(false); }} className="w-20  py-1 bg-gradient-to-r from-purple-700 to-violet-300 md:mt-0 mt-2 rounded-xl border-2 border-yellow-400 text-white font-semibold hover:bg-gradient-to-l  hover:border-black">Update</button>
                                                        </div>) :
                                                            (<div className="flex gap-2">
                                                                <label onClick={() => { setIsUpdating(true); setStockId(stock.id) }} className="mx-2 pt-1 px-2 rounded-xl text-center w-20 border-2">{stock.qoh}</label>
                                                                <button type="button" onClick={() => { setIsUpdating(true); setStockId(stock.id) }} className="w-20  py-1 bg-gradient-to-r from-purple-700 to-violet-300 md:mt-0 mt-2 rounded-xl border-2 border-yellow-400 text-white font-semibold hover:bg-gradient-to-l  hover:border-black">Update</button>
                                                            </div>)}
                                                    </td>
                                                </tr>)
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : extProduct ? (
                            <div className="">
                                <div className=" w-full overflow-x-auto shadow-md sm:rounded-lg">
                                    <table className="w-full table-fixed border-separate border-spacing-1 rounded-lg border-2 border-violet-600 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                        <thead className="text-xs  text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                            <tr className="border-2 border-violet-600">
                                                <th scope="col" className="px-6 py-3 border-2 border-violet-600">
                                                    Product Name
                                                </th>
                                                <th scope="col" className="px-6 py-3 border-2 border-violet-600">
                                                    Description
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-center w-60 border-2 border-violet-600">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stockOrder.map(function (stock) {
                                                return (
                                                    <tr className="bg-white border-2 border-white border-2 border-violet-600">
                                                        <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap  border-2 border-violet-600 rounded-lg">
                                                            {stock.item.name}
                                                        </td>
                                                        <td className="px-6 py-4 border-2 border-violet-600 rounded-lg">
                                                            {stock.item.description}
                                                        </td>
                                                        <td className="pe-4 py-4 text-right flex gap-2 border-2 border-violet-600 rounded-lg">
                                                            <label className="mx-2 px-2 rounded-xl text-center w-20 border-2 pt-1" >{stock.qoh}</label>
                                                            <button type="button" onClick={()=>{removeFromStockOrder(stock);}} className="w-20  py-1 bg-gradient-to-r from-red-700 to-pink-300 md:mt-0 mt-2 rounded-xl border-2 border-yellow-400 text-white font-semibold hover:bg-gradient-to-l  hover:border-black">Delete</button>
                                                        </td>
                                                    </tr>)
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="mt-2">
                                    {stockOrder.length == 0 ?
                                        (
                                            <button type="button" className="w-full md:me-1 py-1 bg-gradient-to-r from-green-300 via-green-500 to-green-700 hover:bg-gradient-to-br md:mt-0 mt-2 rounded-xl border-2 border-yellow-400 text-white font-semibold  hover:border-black">Add To Stock</button>
                                        ) :
                                        (
                                            <button type="button" onClick={() => {addToStock();setNewProduct(false);setExtProduct(false);}} className="w-full md:me-1 py-1 bg-gradient-to-r from-green-300 via-green-500 to-green-700 hover:bg-gradient-to-br md:mt-0 mt-2 rounded-xl border-2 border-yellow-400 text-white font-semibold  hover:border-black">Add To Stock</button>
                                        )}

                                </div>
                            </div>
                        ) : (
                            <div className="">
                                <div className=" w-full overflow-x-auto shadow-md sm:rounded-lg">
                                    <table className="w-full table-fixed border-separate border-spacing-1 rounded-lg border-2 border-violet-600 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                        <thead className="text-xs  text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                            <tr className="border-2 border-violet-600">
                                                <th scope="col" className="px-6 py-3 border-2 border-violet-600">
                                                    Product Name
                                                </th>
                                                <th scope="col" className="px-6 py-3 border-2 border-violet-600">
                                                    Description
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-center w-60 border-2 border-violet-600">
                                                    QOH
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stockAvailable.map(function (stock) {
                                                return (<tr className="bg-white border-2 border-white border-2 border-violet-600">
                                                    <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap  border-2 border-violet-600 rounded-lg">
                                                        {stock.item.name}
                                                    </td>
                                                    <td className="px-6 py-4 border-2 border-violet-600 rounded-lg">
                                                        {stock.item.description}
                                                    </td>
                                                    <td className="pe-4 py-4 text-right border-2 border-violet-600 rounded-lg">
                                                        {isUpdating && stockId === stock.id ? (<div className="flex gap-2">
                                                            <input type="text" autoFocus onChange={(e) => { setQty(parseInt(e.target.value)) }} className="mx-2 px-2 rounded-xl text-center w-20 border-2 border-sky-500" placeholder="Quantity" />
                                                            <button type="button" onClick={() => { update(); setIsUpdating(false); }} className="w-20  py-1 bg-gradient-to-r from-purple-700 to-violet-300 md:mt-0 mt-2 rounded-xl border-2 border-yellow-400 text-white font-semibold hover:bg-gradient-to-l  hover:border-black">Update</button>
                                                        </div>) :
                                                            (<div className="flex gap-2">
                                                                <label onClick={() => { setIsUpdating(true); setStockId(stock.id) }} className="mx-2 pt-1 px-2 rounded-xl text-center w-20 border-2">{stock.qoh}</label>
                                                                <button type="button" onClick={() => { setIsUpdating(true); setStockId(stock.id) }} className="w-20  py-1 bg-gradient-to-r from-purple-700 to-violet-300 md:mt-0 mt-2 rounded-xl border-2 border-yellow-400 text-white font-semibold hover:bg-gradient-to-l  hover:border-black">Update</button>
                                                            </div>)}
                                                    </td>
                                                </tr>)
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Stock;