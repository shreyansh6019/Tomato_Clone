import { useNavigate } from "react-router-dom";
import { useAppData } from "../context/useAppData";
import toast from "react-hot-toast";
import { BiLogOut, BiPackage } from "react-icons/bi";
import { FaAddressBook } from "react-icons/fa";

const Account = () => {
    const { user, setIsAuthenticated, setUser } = useAppData();
    const firstLetter = user?.username.charAt(0).toUpperCase() || '';

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        toast.success("Logout successful");
        setIsAuthenticated(false);
        setUser(null);
        navigate("/login");
    }
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
        <div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-md">
            <div className="flex items-center gap-4 border-b p-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E23774] text-xl font-semibold text-white">
                    {firstLetter}
                </div>
                <div>
                    <h2 className="text-lg font-semibold">{user?.username}</h2>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
            </div>
            <div className="divide-y">
                <div className="flex cursor-pointer items-center gap-4 p-5 hover:bg-gray-100" onClick={() => navigate("/order-history")}>
                    <BiPackage className="h-5 w-5 text-[#E23774]"/>
                    <span className="font-medium">Your Orders</span>
                </div>
                <div className="flex cursor-pointer items-center gap-4 p-5 hover:bg-gray-100" onClick={() => navigate("/address")}>
                    <FaAddressBook className="h-5 w-5 text-[#E23774]"/>
                    <span className="font-medium">Addresses</span>
                </div>
                <div className="flex cursor-pointer items-center gap-4 p-5 hover:bg-gray-100" onClick={handleLogout}>
                    <BiLogOut className="h-5 w-5 text-[#E23774]"/>
                    <span className="font-medium">Logout</span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Account