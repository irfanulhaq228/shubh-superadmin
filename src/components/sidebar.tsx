import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { updateSmallsidebar } from "../features/features";

import { FaUser } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { MdCasino } from "react-icons/md";
import { LuLayoutDashboard } from "react-icons/lu";
import { RiArrowLeftDoubleLine } from "react-icons/ri";

const Sidebar = ({ colors, path }: any) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const smallSidebar = useSelector((state: any) => state.smallSidebar);
  const fn_logout = () => {
    Cookies.remove('superAdminToken');
    navigate("/");
  };
  return (
    <div
      className={`fixed min-h-[100vh] z-[9] shadow-lg lg:shadow-none transition-all duration-500 ${smallSidebar ? "w-[50px]" : "w-[250px]"
        }`}
      style={{ backgroundColor: colors.light }}
    >
      <RiArrowLeftDoubleLine
        className={`text-[18px] absolute top-[10px] cursor-pointer transition-all duration-300 ${smallSidebar ? "-rotate-180 right-[15px]" : "right-[10px]"
          }`}
        onClick={() => dispatch(updateSmallsidebar(!smallSidebar))}
        style={{ color: colors.text }}
      />
      {!smallSidebar && (
        <p
          className="text-[25px] text-center font-[500] mt-[40px]"
          style={{ color: colors.text }}
        >
          Shubh Exchange
        </p>
      )}
      <div className={`flex flex-col gap-[5px] ${smallSidebar ? "mt-[50px]" : "mt-[20px]"}`}>
        <Menus
          title={"Dashboard"}
          colors={colors}
          pathEquals={"dashboard"}
          path={path}
          url={"/dashboard"}
          icon={<LuLayoutDashboard className="text-[20px]" />}
          smallSidebar={smallSidebar}
        />
        <Menus
          title={"Admins"}
          colors={colors}
          pathEquals={"admins"}
          path={path}
          url={"/admins"}
          icon={<FaUser className="text-[18px] me-[3px]" />}
          smallSidebar={smallSidebar}
        />
        <Menus
          title={"Games"}
          colors={colors}
          pathEquals={"games"}
          path={path}
          url={"/games"}
          icon={<MdCasino className="text-[19px] me-[3px]" />}
          smallSidebar={smallSidebar}
        />
      </div>
      <div className="absolute bottom-[20px] flex justify-center items-center w-full cursor-pointer gap-[10px]" style={{ color: colors.text }} onClick={fn_logout}>
        <BiLogOut className="text-[22px]" />
        <span className="font-[600]">Logout</span>
      </div>
    </div>
  );
};

export default Sidebar;

const Menus = ({
  title,
  colors,
  pathEquals,
  path,
  url,
  icon,
  smallSidebar,
}: any) => {
  return (
    <Link
      to={url}
      className="account-sidebar-menu"
      style={{
        color: colors.text,
        backgroundColor: path === pathEquals && colors.dark,
      }}
    >
      {icon}
      {!smallSidebar && <p>{title}</p>}
    </Link>
  );
};
