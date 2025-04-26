import { useState } from "react";
import logo from "../../assets/magamarketlk.png";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import instance from "../../Service/AxiosHolder/AxiosHolder";
import Swal from 'sweetalert2';

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    function showSuccess() {
        Swal.fire({
            title: "Success!",
            text: "You have successfully logged in.",
            icon: "success",
            confirmButtonText: "OK"
        });
    }

    function showError(message) {
        Swal.fire({
            title: "Error!",
            text: message || "An error occurred during login.",
            icon: "error",
            confirmButtonText: "OK"
        });
    }

    async function submit(event) {
        event.preventDefault();

        if (username === "" || password === "") {
            setError("Username and Password are required");
            return;
        }

        const data = {
            username: username,
            password: password
        };

        try {
            setIsLoading(true);
            const response = await instance.post("/login", data);
            login(response.data);
            showSuccess();
            navigate("/");
        } catch (err) {
            console.log(err);
            const errorMessage = err.response?.data?.message || "Invalid username or password";
            setError(errorMessage);
            showError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                    <div className="flex justify-center mb-6">
                        <img src={logo} alt="Company Logo" className="h-16" />
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-sky-800">Welcome Back</h1>
                        <p className="text-gray-600 mt-2">Please enter your credentials</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    setError("");
                                }}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                                placeholder="Enter your username"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError("");
                                }}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                                placeholder="Enter your password"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-sky-600 hover:text-sky-500">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </>
                            ) : 'Sign in'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <a href="#" className="font-medium text-sky-600 hover:text-sky-500">
                            Contact admin
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;