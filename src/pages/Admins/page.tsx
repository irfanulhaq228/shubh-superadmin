import Aos from "aos";
import { Modal } from 'antd';
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { FormEvent, useEffect, useState } from "react";

import { AiOutlinePercentage } from "react-icons/ai";
import { FaPlus, FaRegEye, FaRegEyeSlash } from "react-icons/fa";

import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import useColorScheme from "../../hooks/useColorScheme";
import AdminsTable from "../../components/Admins/AdminsTable";
import { createAdminApi, getAllAdminsApi } from "../../api/api";

const Admins = ({ darkTheme }: any) => {

  const [data, setData] = useState([]);
  const smallSidebar = useSelector((state: any) => state.smallSidebar);
  const dashboardDarkTheme = useSelector((state: any) => state.dashboardDarkTheme);
  const colorScheme = useSelector((state: any) => state.colorScheme);
  const colors = useColorScheme(dashboardDarkTheme, colorScheme);
  const [createAdminModel, setCreateAdminModel] = useState(false);
  const [passwordType, setPasswordType] = useState("password");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [domain, setDomain] = useState("");
  const [oddRate, setOddRate] = useState("");
  const [password, setPassword] = useState("");
  const [oddRateType, setOddRateType] = useState("percentage");
  const [bookmakerRate, setBookmakerRate] = useState("");
  const [bookmakerRateType, setBookmakerRateType] = useState("percentage");
  const [fancyRate, setFancyRate] = useState("");
  const [fancyRateType, setFancyRateType] = useState("percentage");

  const fn_getAdmins = async () => {
    const response = await getAllAdminsApi();
    if (response?.status) {
      setData(response?.data?.reverse());
    }
  }

  useEffect(() => {
    Aos.init({ once: true });
    fn_getAdmins();
  }, []);

  const fn_submit = async (e: FormEvent) => {
    e.preventDefault();
    if (name === "" || email === "" || domain === "" || password === "" || oddRate === "" || bookmakerRate === "" || fancyRate === "") {
      return toast.error("Fill All Fields");
    }
    const data = {
      name, email, domain, password, oddRate: Number(oddRate), oddRateType, bookmakerRate: Number(bookmakerRate), bookmakerRateType, fancyRate: Number(fancyRate), fancyRateType
    }
    const response = await createAdminApi(data);
    if (response?.status) {
      fn_getAdmins();
      setCreateAdminModel(false);
      setName("");
      setEmail("");
      setDomain("");
      setPassword("");
      setOddRate("");
      setOddRateType("percentage");
      return toast.success("Admin Created");
    } else {
      toast.error(response?.message)
    }
  }

  return (
    <>
      <div className={`min-h-[100vh]`} style={{ backgroundColor: colors.bg }}>
        <Sidebar colors={colors} path={"admins"} />
        <div
          className={`relative p-[1px] transition-all duration-500 ${smallSidebar ? "ps-[50px]" : "ps-[50px] lg:ps-[250px]"
            }`}
        >
          <Navbar pageName={"Admins List"} darkTheme={darkTheme} colors={colors} />
          <div className="mt-[15px] px-[10px] sm:px-[20px]">
            <div className="mb-[15px] flex justify-end">
              <button
                className="w-[max-content] text-[15px] font-[500] rounded-[5px] px-[12px] py-[7px] lg:w-[270px]"
                style={{ backgroundColor: colors.text, color: colors.light }}
                onClick={() => setCreateAdminModel(!createAdminModel)}
              >
                <FaPlus className="inline-block mt-[-2px] mr-2" />Add New White Label Account
              </button>
            </div>
            <AdminsTable colors={colors} data={data} fn_getAdmins={fn_getAdmins} />
          </div>
        </div>
      </div>
      <Modal
        title=""
        open={createAdminModel}
        onOk={() => setCreateAdminModel(!createAdminModel)}
        onCancel={() => setCreateAdminModel(!createAdminModel)}
        centered
        footer={null}
        style={{ fontFamily: "Roboto" }}
        width={600}
      >
        <p className="text-[22px] font-[700]">Add New White Label Account</p>
        <form className="py-[20px] flex flex-col gap-[10px]" onSubmit={fn_submit}>
          <div className="flex flex-col">
            <p className="font-[500]">Website Name*</p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Website Name"
              className="w-full h-[40px] border rounded-[10px] px-[10px] font-[500] text-[15px] focus:outline-none focus:border-gray-400"
            />
          </div>
          <div className="flex flex-col">
            <p className="font-[500]">Enter Domain*</p>
            <input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="www.******.***"
              className="w-full h-[40px] border rounded-[10px] px-[10px] font-[500] text-[15px] focus:outline-none focus:border-gray-400"
            />
          </div>
          <div className="flex flex-col">
            <p className="font-[500]">Enter Email Address*</p>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full h-[40px] border rounded-[10px] px-[10px] font-[500] text-[15px] focus:outline-none focus:border-gray-400"
            />
          </div>
          <div className="flex flex-col relative">
            <p className="font-[500]">Enter Password*</p>
            <input
              type={passwordType}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="w-full h-[40px] border rounded-[10px] px-[10px] font-[500] text-[15px] focus:outline-none focus:border-gray-400"
            />
            {passwordType === "password" && <FaRegEyeSlash className="cursor-pointer absolute right-[15px] bottom-[13px]" onClick={() => setPasswordType("text")} />}
            {passwordType === "text" && <FaRegEye className=" cursor-pointer absolute right-[15px] bottom-[13px]" onClick={() => setPasswordType("password")} />}
          </div>
          <hr className="mt-[15px] mb-[10px]" />
          <div className="flex flex-col relative">
            <p className="font-[500]">Enter Odd Rate*</p>
            <div className="flex items-center gap-[10px]">
              <div className="flex gap-[5px]">
                <button
                  type="button"
                  className={`px-[10px] py-[5px] rounded-[5px] ${oddRateType === "percentage" ? "bg-gray-300" : "bg-white"}`}
                  onClick={() => setOddRateType("percentage")}
                >
                  Percentage
                </button>
                <button
                  type="button"
                  className={`px-[10px] py-[5px] rounded-[5px] ${oddRateType === "number" ? "bg-gray-300" : "bg-white"}`}
                  onClick={() => setOddRateType("number")}
                >
                  Number
                </button>
              </div>
              <input
                value={oddRate}
                type="number"
                step={oddRateType === "percentage" ? 0.01 : 1}
                onChange={(e) => setOddRate(e.target.value)}
                required
                placeholder={oddRateType === "percentage" ? "Odd Rate (%)" : "Odd Rate"}
                className="w-full h-[40px] border rounded-[10px] px-[10px] font-[500] text-[15px] focus:outline-none focus:border-gray-400"
              />
            </div>
            {oddRateType === "percentage" && <AiOutlinePercentage className="cursor-pointer absolute right-[15px] bottom-[13px]" />}
          </div>
          <div className="flex flex-col relative">
            <p className="font-[500]">Enter Bookmaker Odd Rate*</p>
            <div className="flex items-center gap-[10px]">
              <div className="flex gap-[5px]">
                <button
                  type="button"
                  className={`px-[10px] py-[5px] rounded-[5px] ${bookmakerRateType === "percentage" ? "bg-gray-300" : "bg-white"}`}
                  onClick={() => setBookmakerRateType("percentage")}
                >
                  Percentage
                </button>
                <button
                  type="button"
                  className={`px-[10px] py-[5px] rounded-[5px] ${bookmakerRateType === "number" ? "bg-gray-300" : "bg-white"}`}
                  onClick={() => setBookmakerRateType("number")}
                >
                  Number
                </button>
              </div>
              <input
                value={bookmakerRate}
                type="number"
                step={bookmakerRateType === "percentage" ? 0.01 : 1}
                onChange={(e) => setBookmakerRate(e.target.value)}
                required
                placeholder={bookmakerRateType === "percentage" ? "Bookmaker Rate (%)" : "Bookmaker Rate"}
                className="w-full h-[40px] border rounded-[10px] px-[10px] font-[500] text-[15px] focus:outline-none focus:border-gray-400"
              />
            </div>
            {bookmakerRateType === "percentage" && <AiOutlinePercentage className="cursor-pointer absolute right-[15px] bottom-[13px]" />}
          </div>
          <div className="flex flex-col relative">
            <p className="font-[500]">Enter Fancy Rate*</p>
            <div className="flex items-center gap-[10px]">
              <div className="flex gap-[5px]">
                <button
                  type="button"
                  className={`px-[10px] py-[5px] rounded-[5px] ${fancyRateType === "percentage" ? "bg-gray-300" : "bg-white"}`}
                  onClick={() => setFancyRateType("percentage")}
                >
                  Percentage
                </button>
                <button
                  type="button"
                  className={`px-[10px] py-[5px] rounded-[5px] ${fancyRateType === "number" ? "bg-gray-300" : "bg-white"}`}
                  onClick={() => setFancyRateType("number")}
                >
                  Number
                </button>
              </div>
              <input
                value={fancyRate}
                type="number"
                step={fancyRateType === "percentage" ? 0.01 : 1}
                onChange={(e) => setFancyRate(e.target.value)}
                required
                placeholder={fancyRateType === "percentage" ? "Fancy Rate (%)" : "Fancy Rate"}
                className="w-full h-[40px] border rounded-[10px] px-[10px] font-[500] text-[15px] focus:outline-none focus:border-gray-400"
              />
            </div>
            {fancyRateType === "percentage" && <AiOutlinePercentage className="cursor-pointer absolute right-[15px] bottom-[13px]" />}
          </div>
          <button className="w-full rounded-[10px] mt-[18px] text-white flex justify-center items-center h-[40px] font-[500] text-[16px]" style={{ backgroundColor: colors.text }}>
            Submit
          </button>
        </form>
      </Modal>
    </>
  );
};

export default Admins;
