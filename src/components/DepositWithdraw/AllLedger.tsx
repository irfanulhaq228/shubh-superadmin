import { useEffect, useState } from "react";
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { formatDate, getAllLedgerApi } from "../../api/api";
import Loader from "../Loader";
import { FaCalendarAlt } from "react-icons/fa";
import { DatePicker } from "antd";
import moment from "moment";

const AllLedger = ({ colors }: any) => {
    const [data, setData] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [loader, setLoader] = useState(true);
    const [endDate, setEndDate] = useState<any>(null);
    const [startDate, setStartDate] = useState<any>(null);

    useEffect(() => {
        fn_getAllLedger();
    }, [])

    const fn_getAllLedger = async () => {
        const response = await getAllLedgerApi();
        if (response?.status) {
            setLoader(false);
            setData(response?.data?.reverse())
            setOriginalData(response?.data?.reverse())
        } else {
            setLoader(false);
            setData([]);
            setOriginalData([]);
        }
    }

    const onChangeStart = (date: any, dateString: any) => {
        setStartDate(dateString);
    };

    const onChangeEnd = (date: any, dateString: any) => {
        setEndDate(dateString);
    };

    const fn_filterByDate = () => {
        if (startDate && endDate) {
            const filteredData = originalData.filter((item: any) => {
                const itemDate = moment(item.createdAt);
                const start = moment(startDate).startOf('day');
                const end = moment(endDate).endOf('day');
                return itemDate.isBetween(start, end, undefined, '[]');
            });
            setData(filteredData);
        } else {
            setData(originalData);
        }
    };

    return (
        <>
            <div className="flex justify-end gap-[15px] items-center mb-[20px]">
                <p className="font-[600] text-[14px]" style={{ color: colors.text }}>Filter:</p>
                <DatePicker
                    onChange={onChangeStart}
                    placeholder="Start Date"
                    format="YYYY-MM-DD"
                    style={{
                        backgroundColor: colors.light,
                        border: "none",
                        color: colors.text,
                        fontWeight: "500",
                        minWidth: "130px",
                        height: "37px",
                    }}
                    suffixIcon={<FaCalendarAlt style={{ color: colors.text }} />}
                />
                <DatePicker
                    onChange={onChangeEnd}
                    placeholder="End Date"
                    format="YYYY-MM-DD"
                    style={{
                        backgroundColor: colors.light,
                        border: "none",
                        color: colors.text,
                        fontWeight: "500",
                        minWidth: "130px",
                        height: "37px",
                    }}
                    suffixIcon={<FaCalendarAlt style={{ color: colors.text }} />}
                />
                <button
                    className="h-[37px] px-[13px] min-w-[max-content] rounded-[7px] shadow-sm pt-[1px] font-[500] text-[15px]"
                    style={{
                        backgroundColor: colors.text,
                        color: "white",
                    }}
                    onClick={fn_filterByDate}
                >
                    Get Statement
                </button>
            </div>
            <div className="overflow-auto min-w-full">
                <table className="w-[1000px] xl:w-full">
                    <thead>
                        <tr
                            className="leading-[55px] font-[600] text-[15px]"
                            style={{ color: colors.text, backgroundColor: colors.light }}
                        >
                            <td className="ps-[5px]">Sr No.</td>
                            <td>User</td>
                            <td>Date</td>
                            <td>Type</td>
                            <td>AMOUNT<SortingArrows /></td>
                            <td>Status</td>
                        </tr>
                    </thead>
                    <tbody>
                        {!loader ? data?.map((item, index) => (
                            <TableRows item={item} index={index + 1} colors={colors} />
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

export default AllLedger;

const TableRows = ({ colors, item, index }: any) => {
    return (
        <tr
            key={index}
            className="text-[13px] font-[500] leading-[50px] border-b"
            style={{ borderColor: colors.line, color: colors.subText }}
        >
            <td className="ps-[5px]">{index}</td>
            <td className="capitalize">{item?.user?.username}</td>
            <td>{formatDate(item?.createdDate)}</td>
            <td>{item?.type}</td>
            <td><FaIndianRupeeSign className="inline-block" />{item?.amount}</td>
            <td>
                <p style={{ letterSpacing: "0.1px" }} className="bg-[#daf2d5] h-[30px] rounded-full w-[80px] text-[12px] font-[600] text-[#2b872a] flex justify-center items-center">Success</p>
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
