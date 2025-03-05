import moment from "moment";
import { DatePicker } from "antd";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { FaCalendarAlt } from "react-icons/fa";

import Loader from "../../../components/Loader";
import { getClosedBetsByAdminApi } from "../../../api/api";
import ProfitLossTable from "../../../components/Bets/ProfitLoss/ProfitLossTable";

const ProfitLoss = ({ colors }: any) => {
  const [data, setData] = useState([]);
  const [originalData, setOriginal] = useState([]);
  const [loader, setLoader] = useState(true);
  const token = useSelector((state: any) => state.token);
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);
  const [selectedFilter, setSelectedFilter] = useState("");

  const onChangeStart = (date: any, dateString: any) => {
    setStartDate(dateString);
  };

  const onChangeEnd = (date: any, dateString: any) => {
    setEndDate(dateString);
  };

  const fn_getUserBets = async () => {
    const response = await getClosedBetsByAdminApi(token);
    if (response?.status) {
      setData(response?.data);
      setOriginal(response?.data);
    }
    setLoader(false);
  };

  useEffect(() => {
    fn_getUserBets();
  }, []);

  const fn_filterByDate = () => {
    if (startDate && endDate) {
      setSelectedFilter("");
      const filteredData = originalData.filter((item: any) => {
        const itemDate = moment(item.createdAt);
        const start = moment(startDate).startOf('day');
        const end = moment(endDate).endOf('day');
        return itemDate.isBetween(start, end, undefined, '[]');
      });
      setData(filteredData);
    } else {
      setData(originalData);
    }
  };

  const fn_filterByPreset = (days: number) => {
    const end = moment().endOf('day');
    const start = moment().subtract(days, 'days').startOf('day');
    const filteredData = originalData.filter((item: any) => {
      const itemDate = moment(item.createdAt);
      return itemDate.isBetween(start, end, undefined, '[]');
    });
    setData(filteredData);
  };

  return (
    <div className="mt-[30px]">
      <div className="flex items-center gap-[15px] overflow-auto">
        <p className="font-[500] text-[14px]" style={{ color: colors.text }}>Period</p>
        <DatePicker
          onChange={onChangeStart}
          placeholder="Start Date"
          format="YYYY-MM-DD"
          style={{
            backgroundColor: colors.light,
            border: "none",
            color: colors.text,
            fontWeight: "500",
            minWidth: "130px",
            height: "37px",
          }}
          suffixIcon={<FaCalendarAlt style={{ color: colors.text }} />}
        />
        <DatePicker
          onChange={onChangeEnd}
          placeholder="End Date"
          format="YYYY-MM-DD"
          style={{
            backgroundColor: colors.light,
            border: "none",
            color: colors.text,
            fontWeight: "500",
            minWidth: "130px",
            height: "37px",
          }}
          suffixIcon={<FaCalendarAlt style={{ color: colors.text }} />}
        />
        <button
          className="h-[37px] px-[13px] min-w-[max-content] rounded-[7px] shadow-sm pt-[1px] font-[500] text-[15px]"
          style={{
            backgroundColor: colors.text,
            color: "white",
          }}
          onClick={fn_filterByDate}
        >
          Get Statement
        </button>
      </div>
      <div className="my-[15px] flex gap-[15px] overflow-auto">
        <Button colors={colors} setSelectedFilter={setSelectedFilter} selectedFilter={selectedFilter} title={"Today"} onClick={() => fn_filterByPreset(0)} />
        <Button colors={colors} setSelectedFilter={setSelectedFilter} selectedFilter={selectedFilter} title={"From Yesterday"} onClick={() => fn_filterByPreset(1)} />
        <Button colors={colors} setSelectedFilter={setSelectedFilter} selectedFilter={selectedFilter} title={"Last 7 Days"} onClick={() => fn_filterByPreset(7)} />
        <Button colors={colors} setSelectedFilter={setSelectedFilter} selectedFilter={selectedFilter} title={"Last 30 Days"} onClick={() => fn_filterByPreset(30)} />
      </div>
      <div className="mt-[20px]">
        {!loader ? (
          <ProfitLossTable colors={colors} data={data} />
        ) : (
          <div className="flex justify-center w-full">
            <Loader size={30} color={colors.text} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfitLoss;

const Button = ({ colors, setSelectedFilter, selectedFilter, title, onClick }: any) => {
  return (
    <button
      className={`h-[35px] px-[13px] min-w-[max-content] rounded-[7px] shadow-sm font-[500] pt-[1px] text-[15px]`}
      style={{
        backgroundColor: selectedFilter === title ? colors.text : colors.light,
        color: selectedFilter === title ? "white" : colors.text,
      }}
      onClick={() => {
        onClick();
        setSelectedFilter(title);
      }}
    >
      {title}
    </button>
  );
};
