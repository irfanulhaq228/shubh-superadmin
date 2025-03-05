import { useSelector } from "react-redux";

import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import useColorScheme from "../../hooks/useColorScheme";

import { FaUser } from "react-icons/fa";

const Profile = ({ darkTheme }: any) => {
  const smallSidebar = useSelector((state: any) => state.smallSidebar);
  const dashboardDarkTheme = useSelector(
    (state: any) => state.dashboardDarkTheme
  );
  const colorScheme = useSelector((state: any) => state.colorScheme);
  const colors = useColorScheme(dashboardDarkTheme, colorScheme);

  return (
    <div className={`min-h-[100vh]`} style={{ backgroundColor: colors.bg }}>
      <Sidebar colors={colors} path={"dashboard"} />
      <div
        className={`relative p-[1px] transition-all duration-500 ${smallSidebar ? "ps-[50px]" : "ps-[50px] lg:ps-[250px]"
          }`}
      >
        <Navbar pageName={"Dashboard"} darkTheme={darkTheme} colors={colors} />
        <div className="mt-[15px] px-[10px] sm:px-[20px]">
          {/* boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:sm:grid-cols-3 gap-[10px] sm:gap-[15px]">
            <Boxes
              colors={colors}
              sub="Total Admin"
              main={10}
              icon={<FaUser className="text-[25px]" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

const Boxes = ({
  colors,
  sub,
  main,
  icon,
}: {
  colors: any;
  sub: string;
  main: string | number;
  icon: any;
}) => {
  return (
    <div
      className={`min-h-[70px] md:min-h-[100px] rounded-[22px] flex items-center px-[12px] md:px-[20px] gap-[20px]`}
      style={{ backgroundColor: colors.dark }}
    >
      <div
        className="w-[50px] md:w-[60px] h-[50px] md:h-[60px] rounded-full flex items-center justify-center text-[20px] md:text-[24px]"
        style={{ backgroundColor: colors.light, color: colors.text }}
      >
        {icon}
      </div>
      <div>
        <p className="text-[13px] md:text-[15px] text-gray-400 font-[500] leading-[13px] md:leading-[15px]">
          {sub}
        </p>
        <p className="text-[18px] md:text-[22px] font-[700]" style={{ color: colors.text }}>
          {main}
        </p>
      </div>
    </div>
  );
};
