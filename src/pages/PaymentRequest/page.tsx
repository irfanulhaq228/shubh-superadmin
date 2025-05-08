import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import useColorScheme from '../../hooks/useColorScheme';
import DepositTable from "./depositTable";
import { fn_getAdminsDepositApi } from "../../api/api";

const PaymentRequest = ({ darkTheme }: any) => {

    const colorScheme = useSelector((state: any) => state.colorScheme);
    const smallSidebar = useSelector((state: any) => state.smallSidebar);
    const dashboardDarkTheme = useSelector((state: any) => state.dashboardDarkTheme);

    const colors = useColorScheme(dashboardDarkTheme, colorScheme);

    const [data, setData] = useState([]);

    useEffect(() => {
        fn_getDeposits();
    }, []);

    const fn_getDeposits = async () => {
        const response = await fn_getAdminsDepositApi();
        if (response?.status) {
            setData(response?.data);
        }
    };

    return (
        <div className={`min-h-[100vh]`} style={{ backgroundColor: colors.bg }}>
            <Sidebar colors={colors} path={"payment-requests"} />
            <div
                className={`relative p-[1px] transition-all duration-500 ${smallSidebar ? "ps-[50px]" : "ps-[50px] lg:ps-[250px]"}`}
            >
                <Navbar pageName={"Payment Requests"} darkTheme={darkTheme} colors={colors} />
                <div className="mt-[15px] px-[10px] sm:px-[20px] pb-[30px]">
                    <DepositTable colors={colors} data={data} fn_getDeposits={fn_getDeposits} />
                </div>
            </div>
        </div>
    )
}

export default PaymentRequest;