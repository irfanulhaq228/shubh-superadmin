import Aos from "aos";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import { getAllColorsApi } from "../../api/api";
import useColorScheme from "../../hooks/useColorScheme";
import WebSettingsTable from "../../components/WebSettings/WebSettingsTable";

const WebSettings = ({ darkTheme }: any) => {
    const smallSidebar = useSelector((state: any) => state.smallSidebar);
    const dashboardDarkTheme = useSelector(
        (state: any) => state.dashboardDarkTheme
    );
    const colorScheme = useSelector((state: any) => state.colorScheme);
    const colors = useColorScheme(dashboardDarkTheme, colorScheme);
    const [colorLoader, setColorLoader] = useState(true);
    const [data, setData] = useState([]);

    useEffect(() => {
        Aos.init({ once: true });
        fn_getColors();
    }, []);

    const fn_getColors = async () => {
        setColorLoader(true);
        const response = await getAllColorsApi();
        if (response?.status) {
            setColorLoader(false);
            setData(response?.data?.reverse())
        }
        setColorLoader(false);
    }

    return (
        <div className={`min-h-[100vh]`} style={{ backgroundColor: colors.bg }}>
            <Sidebar colors={colors} path={"web"} />
            <div
                className={`relative p-[1px] transition-all duration-500 ${smallSidebar ? "ps-[50px]" : "ps-[50px] lg:ps-[250px]"}`}
            >
                <Navbar pageName={"Web Settings"} darkTheme={darkTheme} colors={colors} />
                <div className="mt-[25px] px-[10px] sm:px-[20px]">
                    <WebSettingsTable colors={colors} data={data} loader={colorLoader} fn_getColors={fn_getColors} />
                </div>
            </div>
        </div>
    );
};

export default WebSettings;