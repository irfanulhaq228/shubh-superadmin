import { Modal, Switch } from 'antd';
import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';

import { FaRegEdit, FaRegEyeSlash } from 'react-icons/fa';
import { FaIndianRupeeSign, FaRegEye } from 'react-icons/fa6';
import { adminStatusUpdateApi, adminWalletUpdateApi, editAdminApi, updateBetDelayApi } from '../../api/api';
import Loader from '../Loader';

const AdminsTable = ({ colors, data, fn_getAdmins }: any) => {
    return (
        <>
            {/* table */}
            <div className="overflow-auto min-w-full">
                <table className="w-[950px] xl:w-full">
                    <thead>
                        <tr
                            className="leading-[40px] font-[600] text-[15px]"
                            style={{ color: colors.text, backgroundColor: colors.light }}
                        >
                            <td className="ps-[5px]">Sr No.</td>
                            <td>Email</td>
                            <td>Domain</td>
                            <td>Odd Rate</td>
                            <td>Account Wallet</td>
                            <td>Action</td>
                            <td>Bet Delay</td>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((item: any, index: number) => (
                            <TableRows
                                admin={item}
                                index={index + 1}
                                colors={colors}
                                fn_getAdmins={fn_getAdmins}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default AdminsTable;

const TableRows = ({ admin, index, colors, fn_getAdmins }: any) => {

    const [points, setPoints] = useState("");
    const [loader, setLoader] = useState(false);
    const [betDelay, setBetDelay] = useState("");
    const [editModel, setEditModel] = useState(false);
    const [betDelayModal, setBetDelayModal] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
    const [givePointsModel, setGivePointsModel] = useState(false);

    const [email, setEmail] = useState(admin?.email);
    const [domain, setDomain] = useState(admin?.domain);
    const [oddRate, setOddRate] = useState(admin?.oddRate);
    const [password, setPassword] = useState(admin?.password);

    const [passwordType, setPasswordType] = useState("password");

    const [name, setName] = useState(admin?.name);
    const [fancyRate, setFancyRate] = useState(admin?.fancyRate);
    const [oddRateType, setOddRateType] = useState("percentage");
    const [fancyRateType, setFancyRateType] = useState("percentage");
    const [bookmakerRate, setBookmakerRate] = useState(admin?.bookmakerRate);
    const [bookmakerRateType, setBookmakerRateType] = useState("percentage");

    const handleSwitchChange = async (checked: boolean, e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        const id = admin?._id;
        const response = await adminStatusUpdateApi(checked, id);
        if (response?.status) {
            toast.success(response?.message)
        } else {
            toast.error(response?.message)
        }
    };
    const fn_submit = async (e: FormEvent) => {
        e.preventDefault();
        if (points === "" || points === "0") {
            return toast.error("Enter Points");
        }
        const response = await adminWalletUpdateApi(parseInt(points), admin._id);
        if (response?.status) {
            setGivePointsModel(false);
            setPoints("");
            fn_getAdmins();
            return toast.success(response?.message)
        } else {
            return toast.success(response?.message)
        }
    };
    const fn_edit = async (e: FormEvent) => {
        e.preventDefault();
        if (email === "" || domain === "" || password === "" || oddRate === "" || bookmakerRate === "" || fancyRate === "") {
            return toast.error("Fill All Fields");
        }
        const data = {
            email, domain, password, oddRate, name, bookmakerRate, fancyRate, oddRateType, bookmakerRateType, fancyRateType
        }
        if (email === admin.email) {
            delete data.email;
        };
        if (domain === admin.domain) {
            delete data.domain;
        }
        const response = await editAdminApi(data, admin._id);
        if (response?.status) {
            fn_getAdmins();
            setEditModel(false);
            return toast.success("Admin Updated");
        } else {
            toast.error(response?.message)
        }
    };
    const fn_updateBetDelay = async (e: FormEvent) => {
        e.preventDefault();
        if (!selectedAdmin) return;
        setLoader(true);
        const response = await updateBetDelayApi(selectedAdmin.id, { delayTime: betDelay });
        if (response?.status) {
            fn_getAdmins();
            setLoader(false);
            setBetDelayModal(false);
            return toast.success(response?.message);
        } else {
            setLoader(false);
            setBetDelayModal(false);
            return toast.success(response?.message || 'Something went wrong');
        }
    };
    return (
        <>
            <tr
                key={index}
                className={`text-[13px] font-[500] border-b leading-[60px]`}
                style={{ borderColor: colors.line, color: colors.subText }}
            >
                <td className="ps-[5px]">{index}</td>
                <td>{admin?.email}</td>
                <td><a href={admin?.domain} target='__blank' className='hover:underline'>{admin?.domain}</a></td>
                <td>{admin?.oddRate || 0}%</td>
                <td><FaIndianRupeeSign className='inline-block me-[4px]' />{admin?.wallet}</td>
                <td className='flex items-center h-[60px]'>
                    <Switch size="small" defaultChecked={admin.verified} title='disable' onClick={handleSwitchChange} />
                    <FaRegEdit className='ms-[10px] text-[18px] cursor-pointer' style={{ color: colors.text }} onClick={() => setEditModel(true)} />
                    <button
                        className='text-[11px] rounded-[5px] ms-[10px] px-[10px] h-[30px] leading-[32px]'
                        style={{ backgroundColor: colors.text, color: colors.bg }}
                        onClick={() => {
                            setPoints(admin?.wallet);
                            setGivePointsModel(!givePointsModel);
                        }}
                    >
                        Give Points
                    </button>
                </td>
                <td>{admin?.delayTime || '0'} ms<FaRegEdit className='ms-[15px] text-[18px] cursor-pointer inline-block mt-[-3px]' style={{ color: colors.text }} onClick={() => { setBetDelayModal(!betDelayModal); setSelectedAdmin({ id: admin?._id, }); setBetDelay(admin?.delayTime || '0') }} /></td>
            </tr>
            {/* give points model */}
            <Modal
                title=""
                open={givePointsModel}
                onOk={() => setGivePointsModel(!givePointsModel)}
                onCancel={() => setGivePointsModel(!givePointsModel)}
                centered
                footer={null}
                style={{ fontFamily: "Roboto" }}
                width={600}
            >
                <p className="text-[22px] font-[700]">Give Points to Admin</p>
                <form className="pb-[15px] pt-[20px] flex flex-col gap-[10px]" onSubmit={fn_submit}>
                    <div className="flex flex-col">
                        <p className="font-[500]">Enter Points</p>
                        <input
                            type='number'
                            value={points}
                            onChange={(e) => setPoints(e.target.value)}
                            className="w-full h-[40px] border rounded-[10px] px-[10px] font-[500] text-[15px] focus:outline-none focus:border-gray-400"
                        />
                    </div>
                    <button className="w-full rounded-[10px] mt-[18px] text-white flex justify-center items-center h-[40px] font-[500] text-[16px]" style={{ backgroundColor: colors.text }}>
                        Submit
                    </button>
                </form>
            </Modal>
            {/* edit Model */}
            <Modal
                title=""
                open={editModel}
                onOk={() => setEditModel(!editModel)}
                onCancel={() => setEditModel(!editModel)}
                centered
                footer={null}
                style={{ fontFamily: "Roboto" }}
                width={600}
            >
                <p className="text-[22px] font-[700]">Edit Admin Details</p>
                <form className="py-[20px] flex flex-col gap-[10px]" onSubmit={fn_edit}>
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
                    </div>
                    <button className="w-full rounded-[10px] mt-[18px] text-white flex justify-center items-center h-[40px] font-[500] text-[16px]" style={{ backgroundColor: colors.text }}>
                        Submit
                    </button>
                </form>
            </Modal>
            {/* bet delay model */}
            <Modal
                title=""
                open={betDelayModal}
                onOk={() => setBetDelayModal(!betDelayModal)}
                onCancel={() => setBetDelayModal(!betDelayModal)}
                centered
                footer={null}
                style={{ fontFamily: "Roboto" }}
                width={600}
            >
                <p className="text-[22px] font-[700]">Delay Bet Time</p>
                <form className="pb-[15px] pt-[20px] flex flex-col gap-[10px]" onSubmit={fn_updateBetDelay}>
                    <div className="flex flex-col">
                        <p className="font-[500]">Enter Time of Bet Delat (milisecond)</p>
                        <input
                            type='number'
                            value={betDelay}
                            onChange={(e) => setBetDelay(e.target.value)}
                            className="w-full h-[40px] border rounded-[10px] px-[10px] font-[500] text-[15px] focus:outline-none focus:border-gray-400"
                        />
                    </div>
                    <button className={`w-full rounded-[10px] mt-[18px] text-white flex justify-center items-center h-[40px] font-[500] text-[16px] ${loader ? "cursor-not-allowed" : "cursor-pointer"}`} disabled={loader} style={{ backgroundColor: colors.text }}>
                        {loader ? <Loader color={colors.bg} size={20} /> : "Submit"}
                    </button>
                </form>
            </Modal>
        </>
    );
};