import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CategoryType from "../types/CategoryType";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Category() {
    const { isAuthenticated, jwtToken ,usertype} = useAuth();
    const navigate = useNavigate()

    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [catName, setCatName] = useState<string>("");
    const [eror, setEror] = useState<string>("");

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

    async function submitCategory() {
        if(catName === "") {
            setEror("Category Name can't be Empty.");
        } else {
            const data = {
                name: catName
            }
            try {
                const response = await axios.post("http://localhost:8085/category", data, config);
                console.log(response);
                getCategory();
                setCatName("");
            } catch (error) {
                console.log(error);
    
            }
        } 
    }

    return (
        <div>

            <div className="sticky top-0 relevant">
                <Navbar page="category" />
            </div>
            <div className="grid ">
                <div className="grid md:flex grid-cols-1 pe-4 md:pe-0 ">
                    <div className="sticky top-20 w-full md:mt-10 bg-white border-2 border-purple-800 md:m-auto m-2 md:mx-2 p-2 md:px-10 rounded-lg text-center">
                        <h2 className=" md:my-5 text-lg border-4 border-lime-400 rounded-md text-violet-800 font-bold">Add Categories</h2>
                        <form className="max-w-lg mx-auto">
                            <div className="grid md:grid-cols-2 mb-5 md:pt-5">
                                <label className=" text-sm font-medium dark:font-bold font-bold  pe-5 pb-2 md:pt-2 pt-10">Category Name</label>
                                <input onChange={(e) => { setCatName(e.target.value);setEror(""); }} value={catName} type="text" className="bg-white border border-gray-300 text-black text-center text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Category Name" />
                            </div>
                            <button type="button" onClick={submitCategory} className="mb-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Create Category</button>
                            <div className="text-sm text-red-600">{eror}</div>
                        </form>
                    </div>
                    <div className="w-full  md:mt-10 bg-white border-2 border-purple-800 md:m-auto m-2 md:mx-2 p-2 md:px-10 rounded-lg text-center ">
                        <h2 className="md:my-5 mb-5 text-lg border-4 border-lime-400 rounded-md text-violet-800 font-bold ">Available Categories</h2>
                        <ul className="pb-5">
                            {categories && categories.map(category => (
                                <li className="bg-white border-2 border-violet-400 mb-1 rounded-lg font-bold font-serif text-left px-20">{category.name}</li>
                            ))}
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Category;