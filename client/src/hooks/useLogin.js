import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import axios from 'axios';

const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();

    const login = async (username, password, role) => {
        const success = handleInputErrors(username, password);
        if (!success) return;
        
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:3001/api/auth/login', {
                // id,
                username,
                password,
                role,
            });

            // If login is successful, store token and set user
            console.log('Login successful:', response.data);
            localStorage.setItem("authToken", JSON.stringify(response.data));
            setAuthUser(response.data);

        } catch (error) {
            // If there is an error (like 401 or 400), it will be caught here
            const errorMessage = error.response?.data?.message || "Incorrect username or password";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return { loading, login };
};
export default useLogin;

function handleInputErrors(username, password) {
	if (!username || !password) {
		toast.error("Please fill in all fields");
		return false;
	}
	return true;
}
