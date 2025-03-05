import { IoIosFootball } from "react-icons/io";
import { MdOutlineSportsTennis, MdSportsCricket } from "react-icons/md";
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";
import { FaIndianRupeeSign } from "react-icons/fa6";

const Table1 = ({ colors }: any) => {
  return (
    <div className="overflow-auto min-w-full">
      <table className="w-[950px] xl:w-full">
        <thead>
          <tr
            className="leading-[44px] font-[600] text-[15px]"
            style={{ color: colors.text, backgroundColor: colors.light }}
          >
            <td className="ps-[5px] w-[150px]">Game</td>
            <td className="text-center">Running Bets<SortingArrows /></td>
            <td className="text-center">Current Net Amount of Betting<SortingArrows /></td>
            <td className="text-center">Users Involved<SortingArrows /></td>
            <td className="text-center">Users Winning Ratio<SortingArrows /></td>
            <td className="text-center">Users Losing Ratio<SortingArrows /></td>
          </tr>
        </thead>
        <tbody>
          <TableRows colors={colors} no={"Cricket"} icon={<MdSportsCricket className="w-[24px] h-[24px]" />} />
          <TableRows colors={colors} no={"Tennis"} icon={<MdOutlineSportsTennis className="w-[24px] h-[24px]" />} />
          <TableRows colors={colors} no={"Football"} icon={<IoIosFootball className="w-[24px] h-[24px]" />} />
        </tbody>
      </table>
    </div>
  );
};

export default Table1;

const TableRows = ({ colors, no, icon }: any) => {
  return (
    <tr
      className="text-[13px] font-[500] leading-[37px] border-b"
      style={{ borderColor: colors.line, color: colors.subText }}
    >
      <td className="ps-[5px] flex items-center gap-[13px]">{icon}{no}</td>
      <td className="text-center">4,000</td>
      <td className="text-center"><FaIndianRupeeSign className="inline-block" />8,934,360</td>
      <td className="text-center">34000</td>
      <td className="text-center">34%</td>
      <td className="text-center">66%</td>
    </tr>
  );
};

const SortingArrows = () => {
  return(
    <div className="inline-block ms-[10px] mb-[-4px]">
      <BiSolidUpArrow className="h-[9px] cursor-pointer" />
      <BiSolidDownArrow className="h-[9px] cursor-pointer" />
    </div>
  )
}
