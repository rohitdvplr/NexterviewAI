import { useContext ,useEffect } from "react";
import { AuthContext } from "../../../services/authContext";
import { login,register,logout,getMe } from "../../../services/authApi";

export const useAuth=()=>{
    const context = useContext(AuthContext)
    const {user,setUser,loading,setLoading} = context;

    const handleLogin = async ({ email, password }) => {
        setLoading(true);
    
        try {
            const data = await login({
                email,
                password,
            });
    
            setUser(data.user);
    
            return {
                success: true,
            };
    
        } catch (error) {
    
            return {
                success: false,
                message: error.message || "Invalid email or password",
            };
    
        } finally {
            setLoading(false);
        }
    };

    const handleResgister = async ({ username, email, password }) => {
        setLoading(true);
    
        try {
            const data = await register({
                username,
                email,
                password,
            });
    
            setUser(data.user);
    
            return {
                success: true,
            };
    
        } catch (error) {
    
            return {
                success: false,
                message: error.message,
            };
    
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async()=>{
        setLoading(true)
        try {
            const data = await getMe()
            console.log(data);
            
        } catch (error) {
            console.log(error);
            
        }finally{
            setLoading(false)
        }              

    }
    useEffect(() => {

        const getAndSetUser = async () => {
    
            try {
    
                const data = await getMe();
                setUser(data.user);
    
            } catch (error) {
    
                setUser(null);
    
            } finally {
    
                setLoading(false);
    
            }
    
        };
    
        getAndSetUser();
    
    }, []); 

    return{
        user,
        loading,
        handleLogin,
        handleResgister,
        handleLogout
    }
}