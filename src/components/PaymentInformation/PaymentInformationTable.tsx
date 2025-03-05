import { Modal } from 'antd';
import { Switch } from "antd";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

import Loader from '../Loader';
import { deleteBankByIdApi, updateBankApi, updateBankDetailsApi } from "../../api/api";
import { Banks } from '../../json-data/bank';

const PaymentInformationTable = ({ colors, data, fn_getAllBanks }: any) => {

    const [loader, setLoader] = useState(false);
    const [model, setModal] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<any>({});

    const toggleModal = () => {
        setModal(!model);
        if (model) {
            setSelectedItem({});
        }
    }

    const fn_update = async (e: FormEvent) => {
        e.preventDefault();
        const { bank, accountNo, ibn, name } = selectedItem;

        if (bank !== "UPI Payment") {
            if (accountNo === "" || bank === "" || ibn === "" || name === "") {
                return toast.error("Fill all Fields");
            }
        } else {
            if (accountNo === "" || bank === "" || name === "") {
                return toast.error("Fill all Fields");
            }
        }
        setLoader(true);
        const response = await updateBankDetailsApi(selectedItem?._id, {
            bank: bank,
            accountNo: accountNo,
            name: name,
            ibn: bank === "UPI Payment" ? "" : ibn,
        });
        setLoader(false);
        if (response?.status) {
            setModal(false);
            fn_getAllBanks();
            toast.success(response?.message);
        } else {
            toast.error(response?.message);
        }
    };

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
                            <td className="ps-[5px]">Account</td>
                            <td className="ps-[5px]">Account No.</td>
                            <td>Account Holder Name</td>
                            <td>Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.length > 0 ?
                            data?.map((item: any) => (
                                <TableRows bank={item} colors={colors} fn_getAllBanks={fn_getAllBanks} setSelectedItem={setSelectedItem} toggleModal={toggleModal} />
                            )) : (
                                <tr>
                                    <td colSpan={4} className="text-center py-[15px] font-[500] text-[15px]">No Banks Found</td>
                                </tr>
                            )}
                    </tbody>
                </table>
            </div>
            {/* modal */}
            <Modal
                open={model}
                onOk={toggleModal}
                onCancel={toggleModal}
                footer={null}
                centered
                style={{ fontFamily: "Roboto" }}
            >
                <p className='text-[18px] font-[600]'>Update Bank Details</p>
                <form className='mb-[20px] mt-[30px] flex flex-col gap-[13px]' onSubmit={fn_update}>
                    <div className='flex flex-col'>
                        <label className='text-[15px] font-[500] text-gray-600'>Bank Name</label>
                        <select
                            className='focus:outline-none h-[40px] rounded-[6px] px-[15px] text-[15px] font-[500] bg-white border'
                            onChange={(e) => setSelectedItem((prev: any) => ({ ...prev, bank: e.target.value }))}
                        >
                            <option value={""} disabled>---Select Bank---</option>
                            {Banks.map((item, index) => (
                                <option selected={item.title === selectedItem.bank} key={index} value={item.title} >{item.title}</option>
                            ))}
                        </select>
                    </div>
                    <div className='flex flex-col'>
                        <label className='text-[15px] font-[500] text-gray-600'>Account Number</label>
                        <input
                            type='number'
                            placeholder='Enter Account Number'
                            className='focus:outline-none h-[40px] rounded-[6px] px-[15px] text-[15px] font-[500] bg-white border'
                            value={selectedItem?.accountNo}
                            onChange={(e) => setSelectedItem((prev: any) => ({ ...prev, accountNo: e.target.value }))}
                        />
                    </div>
                    <div className='flex flex-col'>
                        <label className='text-[15px] font-[500] text-gray-600'>Account Holder Name</label>
                        <input
                            placeholder='Enter Account Holder Name'
                            className='focus:outline-none h-[40px] rounded-[6px] px-[15px] text-[15px] font-[500] bg-white border'
                            value={selectedItem?.name}
                            onChange={(e) => setSelectedItem((prev: any) => ({ ...prev, name: e.target.value }))}
                        />
                    </div>
                    {selectedItem?.bank !== "UPI Payment" && (
                        <div className='flex flex-col'>
                            <label className='text-[15px] font-[500] text-gray-600'>IBN Number</label>
                            <input
                                type='number'
                                placeholder='Enter IBN Number'
                                className='focus:outline-none h-[40px] rounded-[6px] px-[15px] text-[15px] font-[500] bg-white border'
                                value={selectedItem?.ibn}
                                onChange={(e) => setSelectedItem((prev: any) => ({ ...prev, ibn: e.target.value }))}
                            />
                        </div>
                    )}
                    <button
                        disabled={loader}
                        className='rounded-[6px] h-[40px] border border-gray-600 font-[500] text-[15px] w-full mt-[17px] flex justify-center items-center'
                        style={{ backgroundColor: colors.text, color: colors.light }}
                    >
                        {!loader ? "Submit" : <Loader size={23} color={colors?.light} />}
                    </button>
                </form>
            </Modal >
        </>
    );
};

export default PaymentInformationTable;

const TableRows = ({ colors, bank, fn_getAllBanks, setSelectedItem, toggleModal }: any) => {
    const fn_updateStatus = async (e: any) => {
        const response = await updateBankApi(bank?._id, { status: e })
        if (response?.status) {
            fn_getAllBanks();
            toast.success(response?.message)
        } else {
            toast.error(response?.message)
        }
    }
    const fn_delete = async () => {
        const response = await deleteBankByIdApi(bank?._id);
        if (response?.status) {
            fn_getAllBanks();
            toast.success(response?.message)
        } else {
            toast.error(response?.message)
        }
    }
    return (
        <tr
            key={bank?._id}
            className="text-[13px] font-[500] leading-[38px] border-b"
            style={{ borderColor: colors.line, color: colors.subText }}
        >
            <td className="ps-[5px] capitalize">{bank?.bank}</td>
            <td>{bank?.accountNo !== "" ? bank?.accountNo : bank?.upi}</td>
            <td>{bank?.name}</td>
            <td>
                <Switch size="small" defaultChecked={bank?.status} title='disable' className="me-[12px]" onChange={fn_updateStatus} />
                <FaEdit className="text-[16px] cursor-pointer inline-block" onClick={() => { setSelectedItem(bank); toggleModal() }} />
                <MdDeleteForever className="inline-block ms-[12px] text-[19px] cursor-pointer" onClick={fn_delete} />
            </td>
        </tr>
    );
};
