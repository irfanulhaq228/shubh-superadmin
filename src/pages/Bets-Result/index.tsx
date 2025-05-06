import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import useColorScheme from '../../hooks/useColorScheme';
import URL, { fn_betsResultApi, fn_getEventsBySportApi, fn_getMarketsByEventApi, fn_getSelectionsByEventAndMarket, fn_getSportsApi, getGamesApi } from "../../api/api";

const BetsResults = ({ darkTheme }: any) => {

    const [sports, setSports] = useState([]);
    const [sportsData, setSportsData] = useState([]);
    const [selectedSport, setSelectedSport] = useState<any>({});

    const [eventsData, setEventData] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState<any>({});

    const [marketsData, setMarketsData] = useState([]);
    const [selectedMarket, setSelectedMarket] = useState<any>({});

    const [runnersData, setRunnersData] = useState([]);

    const [bookmakerData, setBookmakerData] = useState<any>([]);

    const colorScheme = useSelector((state: any) => state.colorScheme);
    const smallSidebar = useSelector((state: any) => state.smallSidebar);
    const dashboardDarkTheme = useSelector((state: any) => state.dashboardDarkTheme);

    const colors = useColorScheme(dashboardDarkTheme, colorScheme);

    const [rollBack, setRollBack] = useState(null);
    const [selectedWinner, setSelectedWinner] = useState("");
    const [innitialWinner, setInnitialWinner] = useState("");

    const [declaredResult, setDeclaredResult] = useState<any>([]);

    const [inputResult, setInputResult] = useState<any>("");
    const [inputMarket, setInputMarket] = useState<any>("");
    const [inputRunnerName, setInputRunnerName] = useState<any>("");

    useEffect(() => {
        fn_getGames();
        fn_getActiveSports();
    }, []);

    useEffect(() => {
        if (Object.keys(selectedSport).length > 0) {
            setMarketsData([]);
            setSelectedMarket({});
            setRunnersData([]);
            fn_getEventsBySport(selectedSport?.id);
        }
    }, [selectedSport]);

    useEffect(() => {
        if (Object.keys(selectedEvent).length > 0) {
            fn_getMarketsByEvent(selectedEvent?.eventId);
        }
    }, [selectedEvent]);

    useEffect(() => {
        if (Object.keys(selectedMarket).length > 0) {
            fn_getRunnersByMarket(selectedEvent?.eventId, selectedMarket?.marketId);
        }
    }, [selectedMarket]);

    const fn_getGames = async () => {
        const response = await getGamesApi();
        if (response?.status) {
            setSportsData(response?.data);
        }
    }

    const fn_getActiveSports = async () => {
        const response = await fn_getSportsApi();
        if (response?.status) {
            setSports(response?.data);
            setSelectedSport(response?.data?.[0] || {});
        }
    };

    const fn_getEventsBySport = async (id: any) => {
        const response = await fn_getEventsBySportApi(id);
        if (response?.status) {
            setEventData(response?.data);
            setSelectedEvent(response?.data?.[0] || {});
        }
    };

    const fn_getMarketsByEvent = async (id: any) => {
        const response = await fn_getMarketsByEventApi(id);
        if (response?.status) {
            setMarketsData(response?.data);
            setSelectedMarket(response?.data?.[0] || {});
        }
    };

    const fn_getRunnersByMarket = async (eventId: any, marketId: any) => {
        const response = await fn_getSelectionsByEventAndMarket(eventId, marketId);
        if (response?.status) {
            setRunnersData(response?.data);
        }
    };

    const fn_assignWinner = async (e: any) => {
        e.preventDefault();
        if (selectedWinner === innitialWinner) return;

        for (const bookmaker of bookmakerData || []) {
            const sureSelect = `${bookmaker?.mid}-${bookmaker?.sid}` === selectedWinner ? `yes` : selectedWinner === "abandoned" ? "abandoned" : "no";

            const data = {
                bookmaker,
                result: sureSelect,
                eventId: selectedEvent?.eventId
            };

            // await updateBookmakerResultApi(data);
        }

        return toast.success("Bookmaker Result Updated");
    };

    const fn_updateRollBack = async (rollback: any) => {
        console.log(rollback)
        for (const bookmaker of bookmakerData || []) {
            const data = {
                bookmaker,
                rollBack: rollback,
                eventId: selectedEvent?.eventId
            };

            // await updateBookmakerRollBackApi(data);
        }

        return toast.success("Bookmaker Result Updated");
    };

    const fn_setResultType = (eventId: any, marketId: any, runnerName: any, resultType: any) => {
        const prevDeclaredResult = declaredResult?.find(
            (i: any) => i?.eventId === eventId && i?.marketId === marketId && i?.runnerName === runnerName
        );
        if (prevDeclaredResult) {
            const updatedDeclaredResult = declaredResult.map((i: any) =>
                i?.eventId === eventId && i?.marketId === marketId && i?.runnerName === runnerName
                    ? { ...i, resultType, result: "" }
                    : i
            );
            setDeclaredResult(updatedDeclaredResult);
        } else {
            setDeclaredResult([...declaredResult, { eventId, marketId, runnerName, resultType, result: "" }]);
        }
    };

    const fn_updateResult = async (eventId: any, marketId: any, runnerName: any, result: any, resultType: any) => {
        if (resultType === "custom") {
            if (inputMarket !== marketId || inputRunnerName !== runnerName) {
                return toast.error("Please Enter Result First");
            };
            if (!Number(result)) {
                return toast.error("Please Enter in Number");
            };
        };
        const obj = {
            eventId,
            marketId,
            runnerName,
            result: resultType === "auto" ? result : Number(result),
            resultType
        };
        const response = await fn_betsResultApi(obj);
        if (response?.status) {
            fn_getRunnersByMarket(eventId, marketId);
            toast.success("Result Updated");
        } else {
            toast.error("Result Not Updated");
        }
    };

    const fn_inputWrite = (value: any, marketId: any, runnerName: any) => {
        setInputResult(value);
        setInputMarket(marketId);
        setInputRunnerName(runnerName);
    };

    return (
        <div className={`min-h-[100vh]`} style={{ backgroundColor: colors.bg }}>
            <Sidebar colors={colors} path={"bets-results"} />
            <div
                className={`relative p-[1px] transition-all duration-500 ${smallSidebar ? "ps-[50px]" : "ps-[50px] lg:ps-[250px]"
                    }`}
            >
                <Navbar pageName={"Bets Results"} darkTheme={darkTheme} colors={colors} />
                <div className="mt-[15px] px-[10px] sm:px-[20px] pb-[30px]">
                    <p className="text-[20px] font-[500]" style={{ color: colors.text }}>Sports</p>
                    {/* sports mapped */}
                    <div className="mt-[5px] flex gap-[15px] overflow-x-auto">
                        {sports?.length > 0 && sports?.map((sport: any) => {
                            const sportImage = sportsData?.find((i: any) => i?.name === sport?.name);
                            return (
                                <Sport colors={colors} sport={sport} selectedSport={selectedSport} setSelectedSport={setSelectedSport} sportImage={sportImage} />
                            )
                        })}
                    </div>
                    <hr className="mt-[20px] border" style={{ borderColor: colors.line }} />
                    {/* events mapped */}
                    <p className="text-[17px] font-[500] mt-[15px]" style={{ color: colors.subText }}>Events List</p>
                    <div className="mt-[5px] flex gap-[15px] overflow-x-auto">
                        {eventsData?.length > 0 && eventsData?.map((item) => (
                            <Button colors={colors} item={item} selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent} />
                        ))}
                    </div>
                    <hr className="mt-[20px] border" style={{ borderColor: colors.line }} />
                    {/* markets mapped */}
                    <p className="text-[17px] font-[500] mt-[15px]" style={{ color: colors.subText }}>Markets List</p>
                    <div className="mt-[5px] flex gap-[15px] overflow-x-auto">
                        {marketsData?.length > 0 && marketsData?.map((item) => (
                            <MarketsButton colors={colors} item={item} selectedMarket={selectedMarket} setSelectedMarket={setSelectedMarket} />
                        ))}
                    </div>
                    <hr className="mt-[20px] border" style={{ borderColor: colors.line }} />
                    {/* runners mapped */}
                    <p className="text-[17px] font-[500] mt-[15px]" style={{ color: colors.subText }}>Runners List</p>
                    <div className="mt-[5px] grid grid-cols-2 gap-[10px] overflow-x-auto">
                        {runnersData?.map((item) => {
                            const runnerResult = declaredResult?.find((i: any) => i?.eventId === selectedEvent?.eventId && i?.marketId === selectedMarket?.marketId && i?.runnerName === item);

                            return (
                                <div
                                    style={{ backgroundColor: colors.light }}
                                    className="p-[7px] rounded-[10px] w-full flex justify-between items-center"
                                >
                                    <p className="text-[15px] font-[500] ms-[15px] capitalize" style={{ color: colors.text }}>{item}</p>
                                    {!runnerResult && (
                                        <div className="flex gap-[7px]">
                                            <button
                                                className={`min-w-[110px] text-nowrap text-[13px] font-[500] min-h-[40px] py-[5px] rounded-[5px] max-w-[max-content] px-[12px] flex flex-col justify-center items-center`}
                                                style={{ backgroundColor: colors.dark, color: colors.subText }}
                                                onClick={() =>
                                                    fn_setResultType(selectedEvent?.eventId, selectedMarket?.marketId, item, "auto")
                                                }
                                            >
                                                <span>Final Result</span>
                                            </button>
                                            <button
                                                className={`min-w-[110px] text-nowrap text-[13px] font-[500] min-h-[40px] py-[5px] rounded-[5px] max-w-[max-content] px-[12px] flex flex-col justify-center items-center`}
                                                style={{ backgroundColor: colors.dark, color: colors.subText }}
                                                onClick={() =>
                                                    fn_setResultType(selectedEvent?.eventId, selectedMarket?.marketId, item, "custom")
                                                }
                                            >
                                                <span>Custom Input</span>
                                            </button>
                                        </div>
                                    )}
                                    {runnerResult?.resultType === "auto" && (
                                        <div className="flex gap-[7px]">
                                            <button
                                                className={`min-w-[80px] text-nowrap text-[13px] font-[500] min-h-[35px] py-[5px] rounded-[5px] max-w-[max-content] px-[12px] flex flex-col justify-center items-center`}
                                                style={{ backgroundColor: colors.dark, color: colors.subText }}
                                                onClick={() => fn_updateResult(selectedEvent?.eventId, selectedMarket?.marketId, item, "win", "auto")}
                                            >
                                                <span>Win</span>
                                            </button>
                                            <button
                                                className={`min-w-[80px] text-nowrap text-[13px] font-[500] min-h-[35px] py-[5px] rounded-[5px] max-w-[max-content] px-[12px] flex flex-col justify-center items-center`}
                                                style={{ backgroundColor: colors.dark, color: colors.subText }}
                                                onClick={() => fn_updateResult(selectedEvent?.eventId, selectedMarket?.marketId, item, "loss", "auto")}
                                            >
                                                <span>Loss</span>
                                            </button>
                                        </div>
                                    )}
                                    {runnerResult?.resultType === "custom" && (
                                        <div className="flex gap-[7px]">
                                            <input
                                                placeholder="Enter Result"
                                                className="h-[35px] w-[130px] rounded-[5px] px-[13px] text-[13px] font-[500] outline-none border-[1px]"
                                                style={{ borderColor: colors.line }}
                                                onChange={(e: any) => fn_inputWrite(e.target.value, selectedMarket?.marketId, item)}
                                            />
                                            <button
                                                className={`min-w-[80px] text-nowrap text-[13px] font-[500] min-h-[35px] py-[5px] rounded-[5px] max-w-[max-content] px-[12px] flex flex-col justify-center items-center`}
                                                style={{ backgroundColor: colors.text, color: colors.light }}
                                                onClick={() => fn_updateResult(selectedEvent?.eventId, selectedMarket?.marketId, item, inputResult, "custom")}
                                            >
                                                <span>Submit</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BetsResults;

const Sport = ({ colors, sport, selectedSport, setSelectedSport, sportImage }: any) => {
    return (
        <button
            key={sport?.name}
            onClick={() => setSelectedSport(sport)}
            className={`text-nowrap text-[15px] font-[500] rounded-[7px] flex flex-col justify-center gap-[5px] items-center capitalize min-w-[100px] min-h-[100px] border`}
            style={selectedSport?.name === sport?.name ? { color: colors?.text, borderColor: colors?.text } : { color: colors?.subText }}
        >
            <img src={`${URL}/${sportImage?.image}`} className="w-[35px] h-[35px] object-contain" />
            {sport?.name}
        </button>
    )
};

const Button = ({ colors, item, selectedEvent, setSelectedEvent }: any) => {
    return (
        <button
            key={item?.eventId}
            onClick={() => setSelectedEvent(item)}
            className={`min-w-[max-content] text-nowrap text-[15px] font-[500] min-h-[40px] py-[7px] rounded-[7px] max-w-[max-content] px-[20px] flex flex-col justify-center items-center`}
            style={selectedEvent?.eventId === item?.eventId ? { backgroundColor: colors.text, color: colors?.light } : { backgroundColor: colors?.light, color: colors?.text }}
        >
            <span>{item?.gameName}</span>
        </button>
    )
};

const MarketsButton = ({ colors, item, selectedMarket, setSelectedMarket }: any) => {
    return (
        <button
            key={item?.marketId}
            onClick={() => setSelectedMarket(item)}
            className={`min-w-[max-content] text-nowrap text-[15px] font-[500] min-h-[40px] py-[7px] rounded-[7px] max-w-[max-content] px-[20px] flex flex-col justify-center items-center`}
            style={selectedMarket?.marketId === item?.marketId ? { backgroundColor: colors.text, color: colors?.light } : { backgroundColor: colors?.light, color: colors?.text }}
        >
            <span>{item?.marketName}</span>
        </button>
    )
};