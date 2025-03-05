import toast from "react-hot-toast";
import { FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom";

import Loader from "../../components/Loader";
import { superAdminLoginApi } from "../../api/api";
import { ModalOTP } from "../../components/ModalOTP";

// import img from "../../assets/super-admin-login-bg.jpg";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordType, setPasswordType] = useState("password");

    const [id, setId] = useState("");
    const [loader, setLoader] = useState(false);
    const [openOTP, setOpenOTP] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (email === "") {
            return toast.error("Enter Email");
        }
        if (password === "") {
            return toast.error("Enter Password");
        }
        setLoader(true);
        const response: any = await superAdminLoginApi({ email, password });
        if (response.status) {
            setLoader(false);
            setId(response?.id);
            toast.success(response?.message);
            return navigate("/dashboard");
        } else {
            setLoader(false);
            return toast.error(response?.message);
        }
    }
    
    return (
        <>
            <div className="flex justify-center items-center min-h-[100vh] p-[25px] relative bg-[--navy-light]">
                {/* <img src={img} alt="bg" className="fixed w-full min-h-[100vh] opacity-30" /> */}
                <div className="relative w-[400px] rounded-[10px] z-[999] bg-opacity-50 bg-[rgba(255,255,255,0.3)] backdrop-blur-md border border-gray-300 shadow-lg">
                    <p className="text-center bg-[rgba(255,255,255,0.5)] rounded-t-[10px] py-[10px] text-[25px] font-[600] border-b border-gray-300">Login as Super Admin</p>
                    <form className="p-[35px] flex flex-col gap-[25px]" onSubmit={handleSubmit}>
                        <div className="flex flex-col">
                            <p className="text-[14px] font-[500]">Email</p>
                            <input
                                className="h-[35px] border-b border-gray-300 focus:border-gray-400 bg-transparent focus:outline-none text-[14px] font-[500] text-gray-700"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col relative">
                            <p className="text-[14px] font-[500]">Password</p>
                            <input
                                type={passwordType}
                                className="h-[35px] border-b border-gray-300 focus:border-gray-400 bg-transparent focus:outline-none text-[14px] font-[500] text-gray-700"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {passwordType === "password" && <FaRegEyeSlash className="absolute right-[5px] top-[30px] cursor-pointer" onClick={() => setPasswordType("text")} />}
                            {passwordType === "text" && <FaRegEye className="absolute right-[5px] top-[30px] cursor-pointer" onClick={() => setPasswordType("password")} />}
                        </div>
                        <button type="submit" className="h-[40px] bg-[rgba(255,255,255,0.5)] border border-gray-300 rounded-full text-[14px] font-[500] mt-[10px] flex items-center justify-center" disabled={loader}>
                            {!loader ? "Login" : <Loader color="black" size={20} />}
                        </button>
                    </form>
                </div>
            </div>
            <ModalOTP openOTP={openOTP} setOpenOTP={setOpenOTP} id={id} />
        </>
    )
}

export default Login