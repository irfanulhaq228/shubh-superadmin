import Aos from "aos";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import useColorScheme from "../../hooks/useColorScheme";

import img from "../../assets/dummy_user.jpg";
import { TiArrowSortedDown } from "react-icons/ti";
import { FaIndianRupeeSign } from "react-icons/fa6";
import SingleUserTable from "../../components/Admins/SingleUserTable";

const UserById = ({ darkTheme }: any) => {
    const smallSidebar = useSelector((state: any) => state.smallSidebar);
    const dashboardDarkTheme = useSelector(
        (state: any) => state.dashboardDarkTheme
    );
    const colorScheme = useSelector((state: any) => state.colorScheme);
    const colors = useColorScheme(dashboardDarkTheme, colorScheme);

    useEffect(() => {
        Aos.init({ once: true });
    }, []);

    return (
        <div className={`min-h-[100vh]`} style={{ backgroundColor: colors.bg }}>
            <Sidebar colors={colors} path={"users"} />
            <div
                className={`relative p-[1px] transition-all duration-500 ${smallSidebar ? "ps-[50px]" : "ps-[50px] lg:ps-[250px]"
                    }`}
            >
                <Navbar pageName={"User Information"} darkTheme={darkTheme} colors={colors} />
                <div className="mt-[15px] px-[10px] sm:px-[20px]">
                    {/* personal Information */}
                    <div className="rounded-[10px] sm:rounded-[15px] px-[10px] py-[30px] sm:p-[30px] flex flex-col sm:flex-row gap-[20px] md:gap-[70px] items-center" style={{ backgroundColor: colors.dark }}>
                        <img alt="user-img" src={img} className="w-[150px] h-[150px] rounded-[15px]" />
                        <div className="flex flex-col ps-0 sm:ps-[20px] md:ps-[60px] sm:border-s" style={{ borderColor: colors.line }}>
                            <p className="text-[22px] sm:text-[27px] font-[600] mb-[10px] capitalize text-center sm:text-start" style={{ color: colors.text }}>John Snow</p>
                            <p className="text-[13px] sm:text-[15px] font-[500] flex items-center gap-[54px] sm:gap-[68px]">
                                <span style={{ color: colors.subText }}>Age:</span>
                                <span style={{ color: colors.text }} className="font-[600]">34 Years</span>
                            </p>
                            <p className="text-[13px] sm:text-[15px] font-[500] flex items-center gap-[26px] sm:gap-[36px]">
                                <span style={{ color: colors.subText }}>Location:</span>
                                <span style={{ color: colors.text }} className="font-[600]">Mumbai, India</span>
                            </p>
                            <p className="text-[13px] sm:text-[15px] font-[500] flex items-center gap-[10px] sm:gap-[18px]">
                                <span style={{ color: colors.subText }}>Contact No:</span>
                                <span style={{ color: colors.text }} className="font-[600]">+91 234 545466</span>
                            </p>
                        </div>
                    </div>
                    {/* bets Information */}
                    <div className="my-[20px] rounded-[10px] sm:rounded-[15px] px-[10px] py-[30px] sm:p-[30px]" style={{ backgroundColor: colors.dark }}>
                        <div className="flex items-center h-[40px]">
                            <p className="text-[15px] font-[500] w-[300px]" style={{ color: colors.subText }}>Total Bets By User</p>
                            <p className="text-[20px] font-[600]" style={{ color: colors.text }}>45</p>
                        </div>
                        <div className="flex items-center h-[40px]">
                            <p className="text-[15px] font-[500] w-[300px]" style={{ color: colors.subText }}>Running Bets</p>
                            <p className="text-[20px] font-[600]" style={{ color: colors.text }}>3</p>
                        </div>
                        <div className="flex items-center h-[40px]">
                            <p className="text-[15px] font-[500] w-[300px]" style={{ color: colors.subText }}>No. of Bets Wins</p>
                            <p className="text-[20px] font-[600]" style={{ color: colors.text }}>20</p>
                        </div>
                        <div className="flex items-center h-[40px]">
                            <p className="text-[15px] font-[500] w-[300px]" style={{ color: colors.subText }}>No. of Bets Losses</p>
                            <p className="text-[20px] font-[600]" style={{ color: colors.text }}>25</p>
                        </div>
                        <div className="flex items-center h-[40px]">
                            <p className="text-[15px] font-[500] w-[300px]" style={{ color: colors.subText }}>Winning Percentage</p>
                            <p className="text-[15px] text-white font-[500]">
                                <span className='bg-[#ff5d5d] px-[12px] py-[5px] rounded-[6px]'>
                                    <TiArrowSortedDown className='inline-block text-[18px] mt-[-2px] me-[4px]' />40%
                                </span>
                            </p>
                        </div>
                        <hr className="my-[20px]" />
                        <div className="flex items-center h-[40px]">
                            <p className="text-[15px] font-[500] w-[300px]" style={{ color: colors.subText }}>Total Deposit</p>
                            <p className="text-[20px] font-[600] flex items-center gap-[5px]" style={{ color: colors.text }}><FaIndianRupeeSign />100500</p>
                        </div>
                        <div className="flex items-center h-[40px]">
                            <p className="text-[15px] font-[500] w-[300px]" style={{ color: colors.subText }}>Total Withdraw</p>
                            <p className="text-[20px] font-[600] flex items-center gap-[5px]" style={{ color: colors.text }}><FaIndianRupeeSign />30000</p>
                        </div>
                        <div className="flex items-center h-[40px]">
                            <p className="text-[15px] font-[500] w-[300px]" style={{ color: colors.subText }}>Wallet Amount</p>
                            <p className="text-[20px] font-[600] flex items-center gap-[5px]" style={{ color: colors.text }}><FaIndianRupeeSign />25000</p>
                        </div>
                    </div>
                </div>
                <div className="mx-[10px] sm:mx-[20px] mb-[30px] bg-white">
                    <SingleUserTable colors={colors} />
                </div>
            </div>
        </div>
    );
};

export default UserById;
