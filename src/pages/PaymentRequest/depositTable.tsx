import { FaCheck } from 'react-icons/fa';
import { RxCross2 } from "react-icons/rx";
import { FaIndianRupeeSign } from 'react-icons/fa6';
import { fn_updateAdminsDepositApi } from '../../api/api';
import toast from 'react-hot-toast';

const DepositTable = ({ colors, data, fn_getDeposits }: any) => {
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
                            <td>Created At</td>
                            <td>Admin Username</td>
                            <td>Amount</td>
                            <td>Status</td>
                            <td>Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((item: any, index: number) => (
                            <TableRows item={item} index={index + 1} colors={colors} fn_getDeposits={fn_getDeposits} />
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default DepositTable;

const TableRows = ({ item, index, colors, fn_getDeposits }: any) => {

    const fn_updateApi = async (data: any) => {
        const response = await fn_updateAdminsDepositApi(item?._id, data);
        if (response?.status) {
            fn_getDeposits();
            toast.success(response?.message);
        } else {
            toast.error(response?.message);
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
                <td>{new Date(item?.createdAt).toDateString()}, {new Date(item?.createdAt).toLocaleTimeString()}</td>
                <td className='capitalize'>{item?.admin?.name}</td>
                <td><FaIndianRupeeSign className='inline-block me-[4px]' />{item?.amount}</td>
                <td>
                    <p
                        className={`px-4 py-1 rounded-full text-xs font-medium w-[max-content] capitalize min-w-[80px] text-center 
                            ${item?.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                            ${item?.status === 'decline' ? 'bg-red-100 text-red-700' : ''}
                            ${item?.status === 'approved' ? 'bg-green-100 text-green-700' : ''}
                        `}
                    >
                        {item?.status}
                    </p>
                </td>
                <td className='flex items-center h-[60px]'>
                    {item?.status === 'pending' ? (
                        <>
                            <button className='bg-green-100 text-green-700 w-[30px] min-w-[30px] h-[30px] min-h-[30px] rounded-full flex justify-center items-center border border-green-300' onClick={() => fn_updateApi({ status: "approved" })}><FaCheck /></button>
                            <button className='bg-red-100 text-red-700 w-[30px] min-w-[30px] h-[30px] min-h-[30px] rounded-full flex justify-center items-center border border-red-300 ms-2' onClick={() => fn_updateApi({ status: "decline" })}><RxCross2 className='scale-[1.1]' /></button>
                        </>
                    ) : (
                        <>
                            <button disabled className='bg-gray-100 text-gray-400 w-[30px] min-w-[30px] h-[30px] min-h-[30px] rounded-full flex justify-center items-center border border-gray-300 cursor-not-allowed'><FaCheck /></button>
                            <button disabled className='bg-gray-100 text-gray-400 w-[30px] min-w-[30px] h-[30px] min-h-[30px] rounded-full flex justify-center items-center border border-gray-300 cursor-not-allowed ms-2'><RxCross2 className='scale-[1.1]' /></button>
                        </>
                    )}
                </td>
            </tr>
        </>
    );
};