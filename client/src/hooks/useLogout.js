import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import axios from 'axios'; // Missing import

const useLogout = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useAuthContext();

	const logout = async () => {
		setLoading(true);
		try {
            const response = await axios.post('http://localhost:3001/api/auth/logout');
			
			const data = response.data;
			
			if (data.error) {
				throw new Error(data.error);
			}

			localStorage.removeItem("authToken");
			setAuthUser(null);

			toast.success("Logout successful!");

		} catch (error) {
			toast.error(error.response?.data?.message || error.message);
		} finally {
			setLoading(false);
		}
	};

	return { loading, logout };
};

export default useLogout;
