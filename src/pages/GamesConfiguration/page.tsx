import Aos from "aos";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import useColorScheme from "../../hooks/useColorScheme";
import GamesConfigurationTable from "../../components/GamesConfiguration/GamesConfigurationTable";

import { IoMdAdd } from "react-icons/io";

import { getGamesApi } from "../../api/api";
import CreateGameModal from "../../components/GamesConfiguration/CreateGameModal";

const Games = ({ darkTheme }: any) => {
  const smallSidebar = useSelector((state: any) => state.smallSidebar);
  const dashboardDarkTheme = useSelector((state: any) => state.dashboardDarkTheme);
  const colorScheme = useSelector((state: any) => state.colorScheme);
  const colors = useColorScheme(dashboardDarkTheme, colorScheme);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createGame, setCreateGame] = useState(false);

  useEffect(() => {
    Aos.init({ once: true });
    fn_getGames();
  }, []);

  const fn_getGames = async () => {
    setLoading(true);
    const response = await getGamesApi();
    setLoading(false);
    if (response?.status) {
      setData(response?.data)
    }
  }

  return (
    <>
      <div className={`min-h-[100vh]`} style={{ backgroundColor: colors.bg }}>
        <Sidebar colors={colors} path={"games"} />
        <div
          className={`relative p-[1px] transition-all duration-500 ${smallSidebar ? "ps-[50px]" : "ps-[50px] lg:ps-[250px]"
            }`}
        >
          <Navbar pageName={"Games"} darkTheme={darkTheme} colors={colors} />
          <div className="mt-[15px] mx-[10px] sm:mx-[20px] flex justify-end">
            <button onClick={() => setCreateGame(!createGame)} style={{ backgroundColor: colors.text, color: colors.light }} className="font-[500] text-[15px] h-[40px] px-[20px] rounded-[5px] flex justify-center items-center">
              <IoMdAdd className="inline-block text-[20px] me-[7px]" />Add Game
            </button>
          </div>
          <div className="mt-[15px] px-[10px] sm:px-[20px]">
            <GamesConfigurationTable colors={colors} data={data} loading={loading} setData={setData} fn_getGames={fn_getGames} />
          </div>
        </div>
      </div>
      <CreateGameModal createGame={createGame} setCreateGame={setCreateGame} fn_getGames={fn_getGames} />
    </>
  );
};

export default Games;
