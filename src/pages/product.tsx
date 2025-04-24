import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import CategoryType from "../types/CategoryType";
import ProductType from "../types/ProductType";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Product() {

    const { isAuthenticated, jwtToken , usertype} = useAuth();
    const navigate = useNavigate()

    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [products, setProducts] = useState<ProductType[]>([]);
    const [editingProduct, setEditingProduct] = useState<ProductType | null>(null);

    const [productName, setProductName] = useState<string>("");
    const [productDescription, setProductDescription] = useState<string>("");
    const [productPrice, setProductPrice] = useState<number>(0.0);
    const [categoryId, setCategoryId] = useState<number>(0);
    const [error, setError] = useState<string>("")

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
            getProducts();
            getCategory();
        }
    }, [isAuthenticated])


    async function getCategory() {
        try {
            const response = await axios.get("http://localhost:8085/category", config);
            setCategories(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    async function getProducts() {
        try {
            const response = await axios.get("http://localhost:8085/items", config);
            setProducts(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    async function handleSubmit() {
        if (checkEmpty()) {
            const data = {
                name: productName,
                description: productDescription,
                price: productPrice,
                categoryId: categoryId
            }
            try {
                const response = await axios.post("http://localhost:8085/items", data, config);
                console.log(response.data);
                getProducts();
                clear();
            } catch (error) {
                console.log(error);
            }
        }
    }

    async function updateProduct() {

        if (usertype?.includes("store")) {
            setError("You are not authorized to edit product");
            setEditingProduct(null);
            clear();
        } else {
            if (checkEmpty()) {
                const data = {
                    name: productName,
                    description: productDescription,
                    price: productPrice,
                    categoryId: categoryId
                }
                try {
                    const response = await axios.put(`http://localhost:8085/items/${editingProduct?.id}`, data, config);
                    console.log(response.data);
                    getProducts();
                    clear();
                } catch (error) {
                    console.log(error);
                }
            }
        }

    }

    async function deleteProduct(productId: number) {
        if (usertype?.includes("store")) {
            setError("You are not authorized to delete product");
            clear();
        }else {
            try {
                await axios.delete(`http://localhost:8085/items/${productId}`, config);
                getProducts();
            } catch (error) {
                console.log(error);
            }
        } 
    }

    function clear() {
        setCategoryId(0);
        setProductName("");
        setProductDescription("");
        setProductPrice(0.0);
        setEditingProduct(null);
    }

    
    function checkEmpty() {
        if (productName === "" || productDescription === "" || productPrice === 0 || productPrice === 0.0 || categoryId === 0) {
            setError("Fields can't be Empty..");
            return false;
        }
        else {
            return true;
        }
    }

    function handlePrice(e: any) {
        setProductPrice(e.target.value);
        setError("");
    }

    function getEditProduct(product: ProductType) {
        setEditingProduct(product);
        setProductName(product.name);
        setProductDescription(product.description);
        setProductPrice(product.price);
        setCategoryId(product.category.id);
    }

    //(e) => { setProductPrice(parseFloat(e.target.value)); setError(""); }

    return (
        <div>
            <div className="sticky top-0"><Navbar page="product" /></div>
            <div className="">
                <div className="grid grid-cols-1 pe-4 ">
                    <div className="sticky top-20  w-full md:mt-10 bg-white border-2 border-purple-800 md:m-auto m-2 md:mx-2 p-2 md:px-10 rounded-lg text-center h-auto">
                        {editingProduct ? (<h2 className=" md:my-5 text-lg border-4 border-lime-400 rounded-md text-violet-800 font-bold">Edit Product</h2>) : (<h2 className=" md:my-5 text-lg border-4 border-lime-400 rounded-md text-violet-800 font-bold">Add Product</h2>)}
                        <div className="md:flex gap-3 pb-5">
                            <form className="w-full mx-auto md:flex gap-2 md:mt-0 ">
                                <input type="text" onChange={(e) => { setProductName(e.target.value); setError(""); }} value={productName} className="bg-white w-full mt-2 md:mt-0 rounded-lg text-sm p-2 ring-2 " placeholder="Enter Product Name" />
                                <input type="text" onChange={(e) => { setProductDescription(e.target.value); setError(""); }} value={productDescription} className="bg-white w-full mt-2 md:mt-0 rounded-lg text-sm p-2 ring-2 " placeholder="Enter Product Description" />
                                <input type="text" onChange={handlePrice} value={productPrice} className="bg-white w-full mt-2 md:mt-0 rounded-lg text-sm p-2 ring-2 " placeholder="Enter Price" />
                                <select className="bg-white w-full mt-2 md:mt-0 rounded-lg text-sm p-2 ring-2" onChange={(e) => { setCategoryId(parseInt(e.target.value)); setError(""); }} value={categoryId}>
                                    
                                    {productName === "" ? (<option value="">Select Category</option>):(<option value={0}>Select Category</option>)}
                                    {
                                        categories.map(function (category) {
                                            return (
                                                <option value={category.id}>{category.name}</option>
                                            )
                                        })
                                    }
                                </select>
                            </form>
                            {editingProduct ? (<button type="button" onClick={updateProduct} className="w-40 bg-gradient-to-br from-purple-600 to-blue-500 md:mt-0 mt-2 rounded-xl border-2 border-yellow-400 text-white font-semibold hover:bg-gradient-to-l from-purple-600 to-blue-500 hover:border-black">Update</button>) :
                                (<button type="button" onClick={handleSubmit} className="w-40 bg-gradient-to-br from-purple-600 to-blue-500 md:mt-0 mt-2 rounded-xl border-2 border-yellow-400 text-white font-semibold hover:bg-gradient-to-l from-purple-600 to-blue-500 hover:border-black">Save</button>)
                            }
                        </div>
                        <div className="text-sm text-red-600">{error}</div>
                    </div>
                    <div className="w-full  bg-white border-2 border-purple-800  m-2 md:mx-2 p-2 md:pb-10 md:px-10 rounded-lg text-center">
                        <h2 className=" md:my-5 text-lg border-4 border-lime-400 rounded-md text-violet-800 font-bold">Products</h2>
                        <div className="md:flex gap-3 ">
                            <div className=" w-full overflow-x-auto shadow-md sm:rounded-lg">
                                <table className="w-full border-separate border-spacing-1 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border-2 border-violet-600 rounded-lg">
                                    <thead className="text-xs  text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr className="border-2 border-violet-600">
                                            <th scope="col" className="px-6 py-3 border-2 border-violet-600">
                                                Product Name
                                            </th>
                                            <th scope="col" className="px-6 py-3 border-2 border-violet-600">
                                                Description
                                            </th>
                                            <th scope="col" className="px-6 py-3 border-2 border-violet-600">
                                                Category
                                            </th>
                                            <th scope="col" className="px-6 py-3 border-2 border-violet-600">
                                                Price (rs/=)
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-center w-48 border-2 border-violet-600">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map(function (product) {
                                            return (<tr className="bg-white border-2 border-violet-600 rounded-lg">
                                                <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap  border-2 border-violet-600 rounded-lg">
                                                    {product.name}
                                                </td>
                                                <td className="px-6 py-4 border-2 border-violet-600 rounded-lg">
                                                    {product.description}
                                                </td>
                                                <td className="px-6 py-4 border-2 border-violet-600 rounded-lg">
                                                    {product.category.name}
                                                </td>
                                                <td className="px-6 py-4 border-2 border-violet-600 rounded-lg">
                                                    {product.price}
                                                </td>
                                                <td className="pe-4 py-4 text-right border-2 border-violet-600 rounded-lg">
                                                    <button type="button" onClick={() => getEditProduct(product)} className="w-20 md:me-1 py-1 bg-gradient-to-r from-green-300 via-green-500 to-green-700 hover:bg-gradient-to-br md:mt-0 mt-2 rounded-xl border-2 border-yellow-400 text-white font-semibold hover:border-black">Edit</button>
                                                    <button type="button" onClick={() => deleteProduct(product.id)} className="w-20 py-1 bg-gradient-to-r from-red-800 to-pink-500 md:mt-0 mt-2 rounded-xl border-2 border-yellow-400 text-white font-semibold hover:bg-gradient-to-l  hover:border-black">Delete</button>
                                                </td>
                                            </tr>)
                                        })}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </div>

    )
}

export default Product;