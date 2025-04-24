import AuthResponseType from "./AuthResponseType";

interface AuthContextType {
    isAuthenticated: boolean;
    jwtToken: string | null;
    loading: boolean;
    usertype:string | null;
    login: (dto: AuthResponseType) => void;
    logout: () => void;
}

export default AuthContextType;