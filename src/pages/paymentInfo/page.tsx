import Aos from "aos";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { Banks } from "../../json-data/bank";
import useColorScheme from "../../hooks/useColorScheme";

import Navbar from "../../components/navbar";
import Loader from "../../components/Loader";
import Sidebar from "../../components/sidebar";
import { createBankApi, getAllBanksApi } from "../../api/api";
import PaymentInformationTable from "../../components/PaymentInformation/PaymentInformationTable";

import selectBank from "../../assets/banks/select-bank.png";

const PaymentInfo = ({ darkTheme }: any) => {
  const smallSidebar = useSelector((state: any) => state.smallSidebar);
  const dashboardDarkTheme = useSelector(
    (state: any) => state.dashboardDarkTheme
  );
  const colorScheme = useSelector((state: any) => state.colorScheme);
  const colors = useColorScheme(dashboardDarkTheme, colorScheme);
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState([]);

  const [state, setState] = useState({
    accountNo: "",
    name: "",
    ibn: "",
    bank: ""
  });
  const [selectedBank, setSelectedBank] = useState<null | { title: string; img: string; }>(null);

  useEffect(() => {
    Aos.init({ once: true });
    fn_getAllBanks();
  }, []);

  useEffect(() => {
    const bank = Banks.find((item) => item.title === state.bank);
    if (bank) {
      setSelectedBank(bank);
    }
  }, [state.bank]);

  const handleInputChange = (evt: any) => {
    const { name, value } = evt.target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  const fn_submit = async () => {
    if (state.bank !== "UPI Payment") {
      if (state.accountNo === "" || state.bank === "" || state.ibn === "" || state.name === "") {
        return toast.error("Fill all Fields");
      }
    } else {
      if (state.accountNo === "" || state.name === "") {
        return toast.error("Fill all Fields");
      }
    }
    setLoader(true);
    const response: any = await createBankApi({
      accountNo: state.accountNo,
      name: state.name,
      bank: state.bank,
      ibn: state.bank !== "UPI Payment" ? state.ibn : ""
    });
    if (response.status) {
      fn_getAllBanks();
      setLoader(false);
      setState((prev) => ({ ...prev, accountNo: "", name: "", ibn: "", bank: "" }));
      return toast.success(response?.message);
    } else {
      setLoader(false);
      return toast.error(response?.message);
    }
  };

  const fn_getAllBanks = async () => {
    const response = await getAllBanksApi();
    if (response?.status) {
      setData(response?.data.reverse());
    } else {
      setData([])
    }
  }

  return (
    <div className={`min-h-[100vh]`} style={{ backgroundColor: colors.bg }}>
      <Sidebar colors={colors} path={"payment"} />
      <div
        className={`relative p-[1px] transition-all duration-500 ${smallSidebar ? "ps-[50px]" : "ps-[50px] lg:ps-[250px]"
          }`}
      >
        <Navbar
          pageName={"Payment Information"}
          darkTheme={darkTheme}
          colors={colors}
        />
        <div className="mt-[15px] px-[10px] sm:px-[20px]">
          <div className="flex flex-col lg:flex-row lg:gap-[20px]">
            {/* card fields */}
            <div className="flex-1">
              <form className="flex flex-col gap-[20px]" autoComplete="new-password">
                <div className="flex flex-col gap-[3px]">
                  <label
                    className="font-[500] text-[15px]"
                    style={{ color: colors.subText }}
                  >
                    Bank Name
                  </label>
                  <select
                    name="bank"
                    onChange={handleInputChange}
                    style={{ color: colors.text, backgroundColor: colors.dark }}
                    className="h-[40px] px-[10px] rounded-[5px] focus:outline-none text-[15px] font-[500]"
                  >
                    <option value={""} selected disabled>---Select Bank---</option>
                    {Banks.map((item, index) => (
                      <option key={index} value={item.title} >{item.title}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-[3px]">
                  <label
                    className="font-[500] text-[15px]"
                    style={{ color: colors.subText }}
                  >
                    Account Number
                  </label>
                  <input
                    type="number"
                    name="accountNo"
                    placeholder="Enter Account Number"
                    value={state.accountNo}
                    onChange={handleInputChange}
                    className="h-[40px] px-[10px] rounded-[5px] focus:outline-none text-[15px]"
                    style={{ color: colors.text, backgroundColor: colors.dark }}
                    autoComplete="false"
                  />
                </div>
                <div className="flex flex-col gap-[3px]">
                  <label
                    className="font-[500] text-[15px]"
                    style={{ color: colors.subText }}
                  >
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter Account Holder Name"
                    value={state.name}
                    onChange={handleInputChange}
                    className="h-[40px] px-[10px] rounded-[5px] focus:outline-none text-[15px]"
                    style={{ color: colors.text, backgroundColor: colors.dark }}
                  />
                </div>
                {selectedBank?.title !== "UPI Payment" && (
                  <div className="flex flex-col gap-[3px]">
                    <label
                      className="font-[500] text-[15px]"
                      style={{ color: colors.subText }}
                    >
                      IBN Number
                    </label>
                    <input
                      type="text"
                      name="ibn"
                      placeholder="Enter IBN Number"
                      value={state.ibn}
                      onChange={handleInputChange}
                      className="h-[40px] px-[10px] rounded-[5px] focus:outline-none text-[15px]"
                      style={{ color: colors.text, backgroundColor: colors.dark }}
                    />
                  </div>
                )}
              </form>
            </div>
            {/* card image */}
            <div className={`flex-1 flex flex-col items-center`}>
              <img src={selectedBank ? selectedBank.img : selectBank} alt="bank" className="h-[270px] max-w-[350px] object-contain" />
              <button
                className="w-[max-content] px-[15px] sm:w-[350px] sm:mt-[10px] rounded-[7px] h-[43px] text-[15px] font-[500] flex justify-center items-center"
                style={{ backgroundColor: colors.text, color: colors.light }}
                onClick={fn_submit}
                disabled={loader}
              >
                {!loader ? "Save Account Info" : <Loader size={25} color="white" />}
              </button>
            </div>
          </div>
          <div className={`sm:mt-[20px]`}>
            <PaymentInformationTable colors={colors} data={data} fn_getAllBanks={fn_getAllBanks} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentInfo;
