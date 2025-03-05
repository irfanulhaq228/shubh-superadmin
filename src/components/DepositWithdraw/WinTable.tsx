import { useEffect, useState } from "react";

import Loader from "../Loader";
import { formatDate, getBetsApi } from "../../api/api";

import { FaIndianRupeeSign } from "react-icons/fa6";
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";

const WinTable = ({ colors, label }: any) => {
    const [data, setData] = useState([]);
    const [loader, setLoader] = useState(true);

    useEffect(() => {
        fn_getWinBets();
    }, []);

    const fn_getWinBets = async () => {
        const response = await getBetsApi(label);
        if (response?.status) {
            setLoader(false);
            setData(response?.data?.reverse());
        } else {
            setLoader(false);
            setData([]);
        }
    }

    return (
        <>
            {/* table */}
            <div className="overflow-auto min-w-full">
                <table className="w-[1000px] xl:w-full">
                    <thead>
                        <tr
                            className="leading-[55px] font-[600] text-[15px]"
                            style={{ color: colors.text, backgroundColor: colors.light }}
                        >
                            <td className="ps-[5px]">Sr No.</td>
                            <td>Username</td>
                            <td>Sports Name</td>
                            <td>Odd</td>
                            <td>Bet Time</td>
                            <td>Bet Amount<SortingArrows /></td>
                            <td>{label === "win" ? "Profit" : "Loss"}<SortingArrows /></td>
                            <td>Status</td>
                        </tr>
                    </thead>
                    <tbody>
                        {!loader ? data?.map((item, index) => (
                            <TableRows label={label} item={item} index={index + 1} colors={colors} />
                        )) : (
                            <tr>
                                <td colSpan={7} className="text-center h-[40px] pt-[10px]"><Loader size={25} color={"#3d3d9e"} /></td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default WinTable;

const TableRows = ({ colors, item, index, label }: any) => {
    return (
        <tr
            className="text-[13px] font-[500] leading-[50px] border-b"
            style={{ borderColor: colors.line, color: colors.subText }}
        >
            <td className="ps-[5px]">{index}</td>
            <td className="capitalize">{item?.user?.username}</td>
            <td>{item?.gameName}</td>
            <td>{item?.odd}</td>
            <td>{formatDate(item?.createdAt)}</td>
            <td><FaIndianRupeeSign className="inline-block" />{item?.amount}</td>
            <td><FaIndianRupeeSign className="inline-block" />{label === "win" ? item?.profit : item?.loss}</td>
            <td className="capitalize">
                {label === "win" && (
                    <p style={{ letterSpacing: "0.1px" }} className="bg-[#daf2d5] h-[30px] rounded-full w-[80px] text-[12px] font-[600] text-[#2b872a] flex justify-center items-center">{item?.status}</p>
                )}
                {label === "loss" && (
                    <p style={{ letterSpacing: "0.1px" }} className="bg-[#ffd6d6] h-[30px] rounded-full w-[80px] text-[12px] font-[600] text-[#fd3939] flex justify-center items-center">{item?.status}</p>
                )}
            </td>
        </tr>
    );
};

const SortingArrows = () => {
    return (
        <div className="inline-block ms-[10px] mb-[-4px]">
            <BiSolidUpArrow className="h-[9px] cursor-pointer" />
            <BiSolidDownArrow className="h-[9px] cursor-pointer" />
        </div>
    )
}
