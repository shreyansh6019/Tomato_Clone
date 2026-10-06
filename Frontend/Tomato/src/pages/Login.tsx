import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { authService } from "../main";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc'

const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const responseGoogle = async (response: unknown) => {
        setLoading(true);
        try {
            const res = await axios.post(`${authService}/api/v1/auth/login`, {
                code: (response as { code: string }).code
            });
            const data = res.data;
            console.log(data);
            if (data.success) {
                localStorage.setItem("token", data.token);
                toast.success("Login successful");
                navigate("/");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Login failed");
        } finally {
            setLoading(false);
        }
    };

    const login = useGoogleLogin({
        onSuccess: responseGoogle,
        onError: () => {
            toast.error("Login failed");
        },
        flow: 'auth-code',
    });
    return (
        <div className="flex min-h-screen items-center justify-center bg-white px-4">
            <div className="w-full max-w-sm space-y-6">
                <h1 className="text-center text-3xl font-bold text-[#E23774]">Tomato</h1>
                <p className="text-center text-sm text-gray-500">Login or sign up to continue</p>
                <button
                    onClick={login}
                    className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#E23774] px-4 py-3 text-white hover:bg-[#d72c6a] focus:outline-none focus:ring-2 focus:ring-[#E23774] focus:ring-offset-1"
                    disabled={loading}
                >
                    <FcGoogle size={20} />
                    {loading ? "Loading..." : "Login with Google"}
                </button>
                <p className="text-center text-sm text-gray-500">
                    By continuing, you agree to our <a href="#" className="text-[#E23774]">Terms of Service</a> and <a href="#" className="text-[#E23774]">Privacy Policy</a>.
                </p>
            </div>
        </div>
    )
}

export default Login