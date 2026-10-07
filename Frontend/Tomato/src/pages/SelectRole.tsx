import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { authService } from "../main";
import { toast } from "react-hot-toast/headless";

type Role = "customer" | "rider" | "seller" | null;
const SelectRole = () => {
    const [role, setRole] = useState<Role | null>(null);
    const { setUser } = useContext(AppContext)!;
    const navigate = useNavigate();

    const roles: Role[] = ["customer", "rider", "seller"];

    const handleRoleSelection = async (selectedRole: Role) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found");
                return;
            }

            const response = await axios.put(
                `${authService}/api/v1/auth/add/role`,
                { role: selectedRole },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setUser(response.data.user);
            localStorage.setItem("token", response.data.token);
            navigate("/", { replace: true });
        } catch (error) {
            console.error("Error updating role:", error);
            toast.error("Failed to update role. Please try again.");
        }
    };
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="w-full max-w-sm space-y-6 rounded-lg bg-gray-100 p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-center">Select Your Role</h2>
            <p className="text-gray-600 text-center">
                Choose the role that best describes you.
            </p>
            <div className="space-y-4">
                {roles.map((r) => (
                    <button
                        key={r}
                        onClick={() => {
                            setRole(r);
                        }}
                        className={`w-full rounded-xl border px-4 py-3 text-sm font-medium capitalize transition ${role === r ? "border-[#E23774] bg-[#E23774] text-white" 
                            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"}`}
                    >
                        Continue as {r}
                    </button>
                ))}
            </div>
            <button 
                disabled={!role} 
                onClick={() => handleRoleSelection(role)} 
                className={`mt-6 w-full rounded-xl bg-[#E23774] px-4 py-3 text-sm font-medium text-white transition ${!role ? "opacity-50 cursor-not-allowed" : "hover:bg-[#d0265e]"}`}>
                Confirm Role
            </button>
        </div>
    </div>
  )
}

export default SelectRole