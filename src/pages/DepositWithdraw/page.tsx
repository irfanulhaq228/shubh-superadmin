import Aos from "aos";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import useColorScheme from "../../hooks/useColorScheme";
import AllLedger from "../../components/DepositWithdraw/AllLedger";

import { CiGift } from "react-icons/ci";
import { GiStabbedNote } from "react-icons/gi";
import { BsGraphDownArrow, BsGraphUpArrow } from "react-icons/bs";
import { PiHandDeposit, PiHandWithdraw, PiNotebook } from "react-icons/pi";
import DepositTable from "../../components/DepositWithdraw/DepositTable";
import WithdrawTable from "../../components/DepositWithdraw/WithdrawTable";
import WinTable from "../../components/DepositWithdraw/WinTable";

const DepositWithdraw = ({ darkTheme }: any) => {
  const dashboardDarkTheme = useSelector((state: any) => state.dashboardDarkTheme);
  const smallSidebar = useSelector((state: any) => state.smallSidebar);
  const colorScheme = useSelector((state: any) => state.colorScheme);
  const colors = useColorScheme(dashboardDarkTheme, colorScheme);

  const [selectedTab, setSelectedTab] = useState("all");

  useEffect(() => {
    Aos.init({ once: true });
  }, []);

  return (
    <div className={`min-h-[100vh]`} style={{ backgroundColor: colors.bg }}>
      <Sidebar colors={colors} path={"deposit-withdraw"} />
      <div
        className={`relative p-[1px] transition-all duration-500 ${smallSidebar ? "ps-[50px]" : "ps-[50px] lg:ps-[250px]"
          }`}
      >
        <Navbar pageName={"Deposit/Withdraw Information"} darkTheme={darkTheme} colors={colors} />
        <div className="mt-[15px] px-[10px] sm:px-[20px]">
          <div className="flex gap-[15px]">
          <Button
              colors={colors}
              title={"All"}
              selectedTab={selectedTab}
              setSelectedTab={() => setSelectedTab("all")}
              value={"all"}
              icon={<PiNotebook className="text-[22px] mt-[-1px]" />}
            />
            <Button
              colors={colors}
              title={"Deposit"}
              selectedTab={selectedTab}
              setSelectedTab={() => setSelectedTab("deposit")}
              value={"deposit"}
              icon={<PiHandDeposit className="text-[22px]" />}
            />
            <Button
              colors={colors}
              title={"Withdraw"}
              selectedTab={selectedTab}
              setSelectedTab={() => setSelectedTab("withdraw")}
              value={"withdraw"}
              icon={<PiHandWithdraw className="text-[22px]" />}
            />
            <Button
              colors={colors}
              title={"Win"}
              selectedTab={selectedTab}
              setSelectedTab={() => setSelectedTab("win")}
              value={"win"}
              icon={<BsGraphUpArrow className="text-[18px]" />}
            />
            <Button
              colors={colors}
              title={"Loss"}
              selectedTab={selectedTab}
              setSelectedTab={() => setSelectedTab("loss")}
              value={"loss"}
              icon={<BsGraphDownArrow className="text-[18px]" />}
            />
            <Button
              colors={colors}
              title={"Bonus"}
              selectedTab={selectedTab}
              setSelectedTab={() => setSelectedTab("bonus")}
              value={"bonus"}
              icon={<CiGift className="text-[22px]" />}
            />
            <Button
              colors={colors}
              title={"Charge"}
              selectedTab={selectedTab}
              setSelectedTab={() => setSelectedTab("charge")}
              value={"charge"}
              icon={<GiStabbedNote className="text-[22px]" />}
            />
          </div>
        </div>
        <div className="mt-[30px] px-[10px] sm:px-[20px]">
          {selectedTab === "all" && <AllLedger colors={colors} />}
          {selectedTab === "deposit" && <DepositTable colors={colors} />}
          {selectedTab === "withdraw" && <WithdrawTable colors={colors} />}
          {selectedTab === "win" && <WinTable colors={colors} label="win" />}
          {selectedTab === "loss" && <WinTable colors={colors} label="loss" />}
        </div>
      </div>
    </div>
  );
};

export default DepositWithdraw;

const Button = ({ colors, title, selectedTab, value, setSelectedTab, icon }: any) => {
  return (
    <button
      className="h-[40px] px-[17px] min-w-[140px] rounded-[7px] shadow-sm font-[500] pt-[1px] text-[15px] flex items-center justify-center gap-[10px]"
      style={{
        backgroundColor: selectedTab === value ? colors.text : colors.light,
        color: selectedTab === value ? colors.light : colors.text,
      }}
      onClick={setSelectedTab}
    >
      {icon}
      {title}
    </button>
  );
};