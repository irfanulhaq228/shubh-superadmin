import { Button, Select } from 'antd';
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import BetsResultTable from "./BetsResultTable";
import { fn_betsResultsManuallyApi, fn_getPendingBets } from "../../api/api";
import useColorScheme from "../../hooks/useColorScheme";
import toast from 'react-hot-toast';

const BetsResult = ({ darkTheme }: any) => {

    const smallSidebar = useSelector((state: any) => state.smallSidebar);
    const colorScheme = useSelector((state: any) => state.colorScheme);
    const dashboardDarkTheme = useSelector((state: any) => state.dashboardDarkTheme);

    const [bets, setBets] = useState([]);
    const [gameNames, setGameNames] = useState<any>([]);
    const [marketNames, setMarketNames] = useState<any>([]);
    const colors = useColorScheme(dashboardDarkTheme, colorScheme);
    const sides = [{ label: "All Sides", value: null }, { label: "Back", value: "Back" }, { label: "Lay", value: "Lay" }] as any;

    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const [selectedSide, setSelectedSide] = useState(null);
    const [selectedGameName, setSelectedGameName] = useState(null);
    const [selectedMarketName, setSelectedMarketName] = useState(null);

    useEffect(() => {
        fn_fetchPendingBets();
    }, [selectedGameName, selectedSide, selectedMarketName]);

    const fn_fetchPendingBets = async () => {
        try {
            const response = await fn_getPendingBets(selectedGameName, selectedSide, selectedMarketName);
            if (response?.status) {
                setBets(response?.data);
                setGameNames([{ label: "All Matches", value: null }, // Add "All Games" option
                ...response?.gameNames?.map((item: any) => {
                    return { label: item, value: item }
                })
                ]);
                setMarketNames([{ label: "All Markets", value: null }, // Add "All Games" option
                ...response?.marketNames?.map((item: any) => {
                    return { label: item, value: item }
                })
                ]);
            }
        } catch (error) {
            console.log("error in fn_fetchBets ", error);
        }
    };

    const fn_updateBets = async (value: string) => {
        try {
            if (selectedIds?.length === 0) return toast.error("Select Bets for Declared Result");
            const response = await fn_betsResultsManuallyApi({ ids: selectedIds, value });
            if (response?.status) {
                toast.success("Bets Result Updated");
                setSelectedGameName(null);
                fn_fetchPendingBets();
            }
        } catch (error) {
            console.log("error in fn_fetchBets ", error);
        }
    }

    return (
        <div className={`min-h-[100vh]`} style={{ backgroundColor: colors.bg }}>
            <Sidebar colors={colors} path={"bets-result"} />
            <div
                className={`relative p-[1px] transition-all duration-500 ${smallSidebar ? "ps-[50px]" : "ps-[50px] lg:ps-[250px]"
                    }`}
            >
                <Navbar pageName={"Bets Result"} darkTheme={darkTheme} colors={colors} />
                <div className="mt-[15px] px-[10px] sm:px-[20px]">
                    <div className='mb-[15px] flex justify-end gap-[10px]'>
                        <Select
                            showSearch
                            style={{ width: 150, textTransform: "capitalize" }}
                            placeholder="Select Side"
                            optionFilterProp="label"
                            filterSort={(optionA: any, optionB: any) =>
                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                            }
                            options={sides}
                            onChange={(value) => setSelectedSide(value)}
                        />
                        <Select
                            showSearch
                            style={{ width: 300, textTransform: "capitalize" }}
                            placeholder="Select Markets"
                            optionFilterProp="label"
                            filterSort={(optionA: any, optionB: any) =>
                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                            }
                            options={marketNames}
                            onChange={(value) => setSelectedMarketName(value)}
                        />
                        <Select
                            showSearch
                            style={{ width: 400, textTransform: "capitalize" }}
                            placeholder="Select Matches"
                            optionFilterProp="label"
                            filterSort={(optionA: any, optionB: any) =>
                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                            }
                            options={gameNames}
                            onChange={(value) => setSelectedGameName(value)}
                        />
                    </div>
                    <div className='flex justify-end gap-[10px] mb-[15px]'>
                        <Button type='primary' className='w-[80px]' onClick={() => fn_updateBets("win")}>Win</Button>
                        <Button type='default' danger className='w-[80px]' onClick={() => fn_updateBets("loss")}>Loss</Button>
                    </div>
                    <BetsResultTable bets={bets} selectedIds={selectedIds} setSelectedIds={setSelectedIds} />
                </div>
            </div>
        </div>
    );
};

export default BetsResult;
