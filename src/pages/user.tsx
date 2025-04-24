import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import UserType from "../types/UserType";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function User() {

    const { isAuthenticated, jwtToken , usertype } = useAuth();
    const navigate = useNavigate()
    
    const [users, setUsers] = useState<UserType[]>([]);
    const [fullname, setFullName] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [userType, setUserType] = useState<string>("");
    const [userId, setUserId] = useState<number>(0);
    const [Error, setError] = useState<string>("");
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const config = {
        headers: {
            Authorization: `Bearer ${jwtToken}`
        }
    }

    useEffect(function () {
        if (isAuthenticated) {
            if(usertype?.includes("chashier") || usertype?.includes("store")) {
                navigate("/");
            }
            getUsers();
            console.log(usertype);
            
        }
    }, [isAuthenticated])

    async function getUsers() {
        try {
            const response = await axios.get("http://localhost:8085/users", config);
            setUsers(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    async function addUser() {
        const data = {
            username: username,
            password: password,
            fullname: fullname,
            userType: userType
        }
        
        try {
            const response = await axios.post("http://localhost:8085/users", data, config);
            console.log(response.data);
            getUsers();
            clear();
        } catch (error) {
            console.log(error);
        }
    }

    async function updateUser() {
        const data = {
            username: username,
            password: password,
            fullname: fullname,
            userType: userType
        }
        try {
            const response = await axios.put(`http://localhost:8085/users/${userId}`, data, config);
            console.log(response.data);
            getUsers();
            clear();
        } catch (error) {
            console.log(error);
        }
    }

    async function deleteUser(user: UserType) {

        if (user.userType.includes("admin") && usertype?.includes("manager")) {
            setError("You are not authorized to delete admin user.");
        } else if(user.userType.includes("admin") && usertype?.includes("admin")) {
            let count = 0;
            for(let i=0; i<users.length; i++){
                if(users[i].userType.includes("admin")) {
                    count++;
                }
            }

            if(count > 1){
                try {
                    await axios.delete(`http://localhost:8085/users/${user.id}`, config);
                    getUsers();
                    clear();
                } catch (error) {
                    console.log(error);
                }
            } else {
                setError("Can't delete the last admin user in the system")
            }
        } else {
            try {
                await axios.delete(`http://localhost:8085/users/${user.id}`, config);
                getUsers();
                clear();
            } catch (error) {
                console.log(error);
            }
        }

        
    }


    function checkEmpty() {
        if (fullname == "" || username == "" || password == "" || userType == "") {
            return false;

        } else {
            return true;
        }
    }

    function checkUsernameDuplication() {
        let t = true;
        for (let i = 0; i < users.length; i++) {
            if (users[i].username == username && users[i].id != userId) {
                t = false;
            }
        }
        return t;
    }

    function clear() {
        setFullName("");
        setUsername("");
        setPassword("");
        setUserType("");
        setUserId(0);
        setIsEditing(false);
    }

    function updatingUser(user: UserType) {
        setIsEditing(true);
        setFullName(user.fullname);
        setUsername(user.username);
        setPassword("");
        setUserType(user.userType);
        setUserId(user.id);
    }

    return (
        <div>
            <div className="sticky top-0"><Navbar page="user" /></div>
            <div className="">
                <div className="grid grid-cols-1 pe-4 ">
                    <div className="sticky top-20  w-full md:mt-10 bg-white border-2 border-purple-800 md:m-auto m-2 md:mx-2 p-2 md:px-10 rounded-lg text-center h-auto">
                        <h2 className=" md:my-5 text-lg border-4 border-lime-400 rounded-md text-violet-800 font-bold">Add User</h2>

                        <div className="md:flex gap-3 pb-5">
                            <form className="w-full mx-auto md:flex gap-2 md:mt-0 ">
                                <input type="text" value={fullname} onChange={(e) => { setFullName(e.target.value); setError(""); }} className="bg-white w-full mt-2 md:mt-0 rounded-lg text-sm p-2 ring-2 " placeholder="Enter Full NAme" required />
                                <input type="text" value={username} onChange={(e) => { setUsername(e.target.value); setError(""); }} className="bg-white w-full mt-2 md:mt-0 rounded-lg text-sm p-2 ring-2 " placeholder="Enter Username" required />
                                <input type="text" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} className="bg-white w-full mt-2 md:mt-0 rounded-lg text-sm p-2 ring-2 " placeholder="Enter Password" required />
                                {usertype?.includes("admin") ? (
                                    <select onChange={(e) => { setUserType(e.target.value); setError(""); }} className="bg-white w-full mt-2 md:mt-0 rounded-lg text-sm p-2 ring-2" value={userType} required>
                                    <option value="">Select User Type</option>
                                    <option value="admin">Admin</option>
                                    <option value="manager">Manager</option>
                                    <option value="store">Store Keeper</option>
                                    <option value="chashier">Cashier</option>
                                </select>
                                ) : (
                                    <select onChange={(e) => { setUserType(e.target.value); setError(""); }} className="bg-white w-full mt-2 md:mt-0 rounded-lg text-sm p-2 ring-2" value={userType} required>
                                    <option value="">Select User Type</option>
                                    <option value="manager">Manager</option>
                                    <option value="store">Store Keeper</option>
                                    <option value="chashier">Cashier</option>
                                </select>
                                )}
                                
                            </form>
                            {isEditing ? (
                                <button type="button" onClick={() => {
                                    if (checkEmpty()) {
                                        if (checkUsernameDuplication()) {
                                            updateUser();
                                        } else {
                                            setError("Duplicate username. Please enter new username");
                                        }
                                    } else {
                                        setError("All the fields must be fille to submit");
                                    }
                                }} className="w-40 bg-gradient-to-br from-purple-600 to-blue-500 md:mt-0 mt-2 rounded-xl border-2 border-yellow-400 text-white font-semibold hover:bg-gradient-to-l from-purple-600 to-blue-500 hover:border-black">Update</button>
                            ) : (
                                <button type="button" onClick={() => {
                                    if (checkEmpty()) {
                                        if (checkUsernameDuplication()) {
                                            addUser();
                                        } else {
                                            setError("Duplicate username. Please enter new username");
                                        }
                                    } else {
                                        setError("All the fields must be fille to submit");
                                    }
                                }} className="w-40 bg-gradient-to-br from-purple-600 to-blue-500 md:mt-0 mt-2 rounded-xl border-2 border-yellow-400 text-white font-semibold hover:bg-gradient-to-l from-purple-600 to-blue-500 hover:border-black">Save</button>
                            )}

                        </div>
                        <div className="text-red-500 text-sm">{Error}</div>
                    </div>
                    <div className="w-full  bg-white border-2 border-purple-800  m-2 md:mx-2 p-2 md:pb-10 md:px-10 rounded-lg text-center">
                        <h2 className=" md:my-5 text-lg border-4 border-lime-400 rounded-md text-violet-800 font-bold">Users</h2>
                        <div className="md:flex gap-3 ">
                            <div className=" w-full overflow-x-auto shadow-md sm:rounded-lg">
                                <table className="w-full border-separate border-spacing-1 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border-2 border-violet-600 rounded-lg">
                                    <thead className="text-xs  text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr className="border-2 border-violet-600">
                                            <th scope="col" className="px-6 py-3 border-2 border-violet-600">
                                                Full Name
                                            </th>
                                            <th scope="col" className="px-6 py-3 border-2 border-violet-600">
                                                Username
                                            </th>
                                            <th scope="col" className="px-6 py-3 border-2 border-violet-600">
                                                Password
                                            </th>
                                            <th scope="col" className="px-6 py-3 border-2 border-violet-600">
                                                User Type
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-center w-48 border-2 border-violet-600">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(function (user) {
                                            return (<tr className="bg-white border-2 border-violet-600 rounded-lg">
                                                <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap  border-2 border-violet-600 rounded-lg">
                                                    {user.fullname}
                                                </td>
                                                <td className="px-6 py-4 border-2 border-violet-600 rounded-lg">
                                                    {user.username}
                                                </td>
                                                <td className="px-6 py-4 border-2 border-violet-600 rounded-lg">
                                                    {user.password}
                                                </td>
                                                <td className="px-6 py-4 border-2 border-violet-600 rounded-lg">
                                                    {user.userType}
                                                </td>
                                                <td className="pe-4 py-4 text-right border-2 border-violet-600 rounded-lg">
                                                    <button type="button" onClick={()=>{setError("");updatingUser(user)}} className="w-20 md:me-1 py-1 bg-gradient-to-r from-green-600  to-lime-400 hover:bg-gradient-to-l md:mt-0 mt-2 rounded-xl border-2 border-yellow-400 text-white font-semibold hover:border-black">Edit</button>
                                                    <button type="button" onClick={()=>{setError("");deleteUser(user)}} className="w-20 py-1 bg-gradient-to-r from-red-600 to-pink-500 md:mt-0 mt-2 rounded-xl border-2 border-yellow-400 text-white font-semibold hover:bg-gradient-to-l  hover:border-black">Delete</button>
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

export default User;