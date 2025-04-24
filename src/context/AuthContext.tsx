import { createContext, useContext, useEffect, useState } from "react";
import AuthContextType from "../types/AuthContextType";
import AuthProviderPropsType from "../types/AuthProviderPropsType";
import AuthResponseType from "../types/AuthResponseType";

export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    jwtToken: null,
    loading: true,
    usertype:null,
    login: () => {},
    logout: () => {}
});

export function AuthProvider({children}: AuthProviderPropsType ) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [jwtToken, setJwtToken] = useState<string | null>(null);
    const [usertype, setUsertype] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    function login(dto: AuthResponseType) {
        setIsAuthenticated(true);
        setJwtToken(dto.jwtToken);
        setUsertype(dto.usertype);

        if(dto.jwtToken != null) {
            localStorage.setItem("token", dto.jwtToken);
        }
        if(dto.usertype != null) {
            localStorage.setItem("user", dto.usertype);
        }
        
        
    }

    function logout() {
        setIsAuthenticated(false);
        setJwtToken(null);
        setUsertype(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        if(token) {
            setIsAuthenticated(true);
            setJwtToken(token);
            setUsertype(user);
            setLoading(false);
        } else {
            setLoading(false);
        }
        
    },[])

    return (
        <AuthContext.Provider value={{ isAuthenticated, jwtToken, loading, usertype, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}