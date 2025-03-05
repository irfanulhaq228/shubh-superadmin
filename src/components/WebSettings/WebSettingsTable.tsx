import toast from 'react-hot-toast';
import { ColorPicker, Modal } from 'antd';
import { useEffect, useRef, useState } from 'react';

import Loader from '../Loader';

import URL, { changeWebsiteLogo, changeWebsiteName, createBettingTimeApi, createColorApi, createWebsiteBanner, createWebsiteColor, deleteAdminWebsiteBanners, deleteColorByIdApi, deleteWebsiteColor, getAdminWebsiteBanners, getAllWebsiteColors, getBettingTimeApi, getWebsiteLogoApi, getWebsiteNameApi, updateColorStatusById, updateWebsiteColor } from '../../api/api';

import { FaImage } from 'react-icons/fa';
import { FaDeleteLeft } from 'react-icons/fa6';
import { MdDelete } from 'react-icons/md';

const WebSettingsTable = ({ colors, data, fn_getColors }: any) => {
    const [websiteName, setWebsiteName] = useState("");

    const [betDelayModal, setBetDelayModal] = useState(false);
    const [websiteNameModal, setWebsiteNameModal] = useState(false);
    const [websiteLogoModal, setWebsiteLogoModal] = useState(false);
    const [websiteColorModal, setWebsiteColorModal] = useState(false);
    const [panelColorModal, setPanelColorModal] = useState(false);
    const [websiteBannerModal, setWebsiteBannerModal] = useState(false);

    const [websiteLogo, setWebsiteLogo] = useState({});
    const [savedDelayTime, setSavedDelayTime] = useState("");
    const [savedWebsiteName, setSavedWebsiteName] = useState("");
    const [savedWebsiteLogo, setSavedWebsiteLogo] = useState("");

    const [savedWebsiteColors, setSavedWebsiteColors] = useState([]);
    const [savedWebsiteBanners, setSavedWebsiteBanners] = useState([]);

    const fn_getBettingDelayTime = async () => {
        const response = await getBettingTimeApi();
        if (response?.status) {
            setSavedDelayTime(response?.data?.delayTime)
        }
    }

    const fn_getWebsiteName = async () => {
        const response = await getWebsiteNameApi();
        if (response?.status) {
            setSavedWebsiteName(response?.data[0]?.name)
        }
    }

    const fn_getWebsiteLogo = async () => {
        const response = await getWebsiteLogoApi();
        if (response?.status) {
            setSavedWebsiteLogo(response?.data[0]?.image)
        }
    }

    const fn_getWebsiteColors = async () => {
        const response = await getAllWebsiteColors();
        setSavedWebsiteColors(response?.data.reverse());
    }

    const fn_getWebsiteBanners = async () => {
        const response = await getAdminWebsiteBanners();
        if (response?.status) {
            setSavedWebsiteBanners(response?.data);
        } else {
            setSavedWebsiteBanners([]);
        }
    }

    const fn_updateColor = async (e: any, id: string, status: boolean) => {
        e.stopPropagation();
        if (status) return;
        const response = await updateWebsiteColor(id);
        if (response?.status) {
            toast.success(response?.message);
            fn_getWebsiteColors();
        } else {
            toast.error(response?.message);
        }
    }

    const fn_updatePanelColor = async (e: any, id: string, status: boolean) => {
        e.stopPropagation();
        if (status) return;
        const response = await updateColorStatusById(id, !status);
        if (response?.status) {
            toast.success(response?.message);
            fn_getColors();
        } else {
            toast.error(response?.message);
        }
    }

    const fn_deleteColor = async (e: any, id: string) => {
        e.stopPropagation();
        const response = await deleteWebsiteColor(id);
        if (response?.status) {
            toast.success(response?.message);
            fn_getWebsiteColors();
        } else {
            toast.error(response?.message);
        }
    }

    const fn_deletePanelColor = async (e: any, id: string) => {
        e.stopPropagation();
        const response = await deleteColorByIdApi(id);
        if (response?.status) {
            fn_getColors();
            toast.success(response?.message)
        } else {
            toast.error(response?.message)
        }
    }

    const fn_deleteBanner = async (id: any) => {
        if (!id) return;
        const response = await deleteAdminWebsiteBanners(id);
        if (response?.status) {
            fn_getWebsiteBanners();
            return toast.success(response?.message);
        } else {
            return toast.error(response?.message);
        }
    }

    useEffect(() => {
        fn_getWebsiteName();
        fn_getWebsiteLogo();
        fn_getWebsiteColors();
        fn_getWebsiteBanners();
        fn_getBettingDelayTime();
    }, []);

    return (
        <>
            {/* Betting Deplay Time */}
            <div className='flex items-center justify-between'>
                <p className='text-[18px] font-[600]' style={{ color: colors.text }}>Bet Delay Time</p>
                <button
                    className="w-[max-content] text-[15px] font-[500] rounded-[5px] px-[12px] py-[7px] lg:w-[200px]"
                    style={{ backgroundColor: colors.text, color: colors.light }}
                    onClick={() => setBetDelayModal(!betDelayModal)}
                >
                    Change Bet Delay Time
                </button>
            </div>
            <div className='mb-[15px] text-[15px]' style={{ color: colors.subText }}>
                <p>Adjusted Delay Time: <span className='font-[700]'>{savedDelayTime} ms</span></p>
            </div>
            {/* Website color */}
            <div className='flex items-center justify-between'>
                <p className='text-[18px] font-[600]' style={{ color: colors.text }}>Website Color</p>
                <button
                    className="w-[max-content] text-[15px] font-[500] rounded-[5px] px-[12px] py-[7px] lg:w-[200px]"
                    style={{ backgroundColor: colors.text, color: colors.light }}
                    onClick={() => setWebsiteColorModal(!websiteColorModal)}
                >
                    Add Website Color
                </button>
            </div>
            <div className='mt-[10px] flex flex-wrap gap-[10px]'>
                {savedWebsiteColors?.map((item: any, index: any) => (
                    <div
                        key={index}
                        className='w-[100px] h-[100px] border rounded-[10px] relative cursor-pointer'
                        style={{ backgroundColor: item?.color }}
                        onClick={(e) => fn_updateColor(e, item?._id, item?.status)}
                    >
                        {!item?.status && (
                            <FaDeleteLeft className='absolute top-[5px] right-[8px] cursor-pointer text-white' onClick={(e) => fn_deleteColor(e, item?._id)} />
                        )}
                        <input type='radio' name='website-color' className='cursor-pointer absolute bottom-[10px] right-[10px] shadow-md bg-transparent scale-[1.2]' checked={item?.status} />
                    </div>
                ))}
            </div>
            {/* user panel color */}
            <div className='flex items-center justify-between mt-[30px]'>
                <p className='text-[18px] font-[600]' style={{ color: colors.text }}>User Panel Color</p>
                <button
                    className="w-[max-content] text-[15px] font-[500] rounded-[5px] px-[12px] py-[7px] lg:w-[200px]"
                    style={{ backgroundColor: colors.text, color: colors.light }}
                    onClick={() => setPanelColorModal(!panelColorModal)}
                >
                    Add User Panel Color
                </button>
            </div>
            <div className='flex gap-[10px] flex-wrap mt-[10px]'>
                {data?.map((item: any, index: any) => (
                    <div key={index} className='w-[100px] rounded-[10px] border relative cursor-pointer' onClick={(e) => fn_updatePanelColor(e, item?._id, item?.status)}>
                        <div className='h-[50px] w-full rounded-t-[10px] flex justify-center items-center text-[13px] font-[600]' style={{ backgroundColor: item?.mainColor }}>
                            Main Color
                        </div>
                        <div className='h-[50px] w-full rounded-b-[10px] flex justify-center items-center text-[13px] font-[600]' style={{ backgroundColor: item?.secColor }}>
                            Sec Color
                        </div>
                        {!item?.status && (
                            <FaDeleteLeft className='absolute top-[5px] right-[8px] cursor-pointer text-white' onClick={(e) => fn_deletePanelColor(e, item?._id)} />
                        )}
                        <input type='radio' name='user-panel-color' className='cursor-pointer absolute bottom-[10px] right-[10px] shadow-md bg-transparent scale-[1.2]' checked={item?.status} />
                    </div>
                ))}
            </div>
            {/* website name */}
            <div className='flex items-center justify-between mt-[30px]'>
                <p className='text-[18px] font-[600]' style={{ color: colors.text }}>Website Name</p>
                <button
                    className="w-[max-content] text-[15px] font-[500] rounded-[5px] px-[12px] py-[7px] lg:w-[200px]"
                    style={{ backgroundColor: colors.text, color: colors.light }}
                    onClick={() => setWebsiteNameModal(!websiteNameModal)}
                >
                    Change Website Name
                </button>
            </div>
            <div className="overflow-x-auto min-w-full mt-[10px]">
                <table className="min-w-[400px] w-full table-fixed">
                    <thead>
                        <tr
                            className="leading-[50px] font-[600] text-[15px]"
                            style={{ color: colors.text, backgroundColor: colors.light }}
                        >
                            <td className="ps-[5px]">Name</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            className="text-[15px] font-[500] leading-[40px] border-b"
                            style={{ borderColor: colors.line, color: colors.subText }}
                        >
                            <td className='ps-[5px]'>{savedWebsiteName}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            {/* website logo */}
            <div className='flex items-center justify-between mt-[30px]'>
                <p className='text-[18px] font-[600]' style={{ color: colors.text }}>Website Logo</p>
                <button
                    className="w-[max-content] text-[15px] font-[500] rounded-[5px] px-[12px] py-[7px] lg:w-[200px]"
                    style={{ backgroundColor: colors.text, color: colors.light }}
                    onClick={() => setWebsiteLogoModal(!websiteLogoModal)}
                >
                    Change Website Logo
                </button>
            </div>
            <div className="overflow-x-auto min-w-full mt-[10px]">
                <table className="min-w-[400px] w-full table-fixed">
                    <thead>
                        <tr
                            className="leading-[50px] font-[600] text-[15px]"
                            style={{ color: colors.text, backgroundColor: colors.light }}
                        >
                            <td className="ps-[5px]">Logo</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            className="text-[15px] font-[500] leading-[40px] border-b"
                            style={{ borderColor: colors.line, color: colors.subText }}
                        >
                            <td className='ps-[5px]'>
                                {savedWebsiteLogo ? (
                                    <img alt='logo' src={`${URL}/${savedWebsiteLogo}`} className=' h-[100px] w-[100px] object-cover py-[5px] rounded-[5px]' />
                                ) : (
                                    <p className='text-[15px] font-[500]'>No Image Selected</p>
                                )}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            {/* website banner */}
            <div className='flex items-center justify-between mt-[30px]'>
                <p className='text-[18px] font-[600]' style={{ color: colors.text }}>Website Banner</p>
                <button
                    className="w-[max-content] text-[15px] font-[500] rounded-[5px] px-[12px] py-[7px] lg:w-[200px]"
                    style={{ backgroundColor: colors.text, color: colors.light }}
                    onClick={() => setWebsiteBannerModal(!websiteBannerModal)}
                >
                    Add Website Banner
                </button>
            </div>
            <div className='flex flex-col gap-[10px] mb-[50px]'>
                {savedWebsiteBanners?.length > 0 && savedWebsiteBanners?.map((item: any, index) => (
                    <div key={index} className='max-w-[300px] max-h-[180px] rounded-[10px] border relative'>
                        <img src={`${URL}/${item?.image}`} alt='' className='object-cover w-full h-full rounded-[10px]' />
                        <div className='absolute shadow-md top-[8px] right-[8px] h-[30px] w-[30px] cursor-pointer rounded-full border flex justify-center items-center' onClick={() => fn_deleteBanner(item?._id)}>
                            <MdDelete className='text-red-500 cursor-pointer' />
                        </div>
                    </div>
                ))}
            </div>
            <BetDelayModal
                betDelayModal={betDelayModal}
                setBetDelayModal={setBetDelayModal}
                fn_getBettingDelayTime={fn_getBettingDelayTime}
            />
            <WebsiteNameModal
                websiteNameModal={websiteNameModal}
                setWebsiteNameModal={setWebsiteNameModal}
                websiteName={websiteName}
                setWebsiteName={setWebsiteName}
                fn_getWebsiteName={fn_getWebsiteName}
            />
            <WebsiteLogoModal
                websiteLogoModal={websiteLogoModal}
                setWebsiteLogoModal={setWebsiteLogoModal}
                websiteLogo={websiteLogo}
                setWebsiteLogo={setWebsiteLogo}
                fn_getWebsiteLogo={fn_getWebsiteLogo}
            />
            <WebsiteColorModal
                websiteColorModal={websiteColorModal}
                setWebsiteColorModal={setWebsiteColorModal}
                fn_getWebsiteColors={fn_getWebsiteColors}
            />
            <PanelColorModal
                panelColorModal={panelColorModal}
                setPanelColorModal={setPanelColorModal}
                fn_getColors={fn_getColors}
            />
            <WebsiteBannerModal
                websiteBannerModal={websiteBannerModal}
                setWebsiteBannerModal={setWebsiteBannerModal}
                fn_getWebsiteBanners={fn_getWebsiteBanners}
            />
        </>
    );
};

export default WebSettingsTable;

const BetDelayModal = ({ betDelayModal, setBetDelayModal, fn_getBettingDelayTime }: any) => {
    const [loader, setLoader] = useState(false);
    const [delayTime, setDelayTime] = useState<number | string>("");
    const fn_submit = async () => {
        if (delayTime === "" || delayTime === 0) {
            return toast.error("Set Proper Time");
        }
        setLoader(true);
        const response = await createBettingTimeApi({ delayTime });
        if (response?.status) {
            setDelayTime("");
            setLoader(false);
            setBetDelayModal(false);
            fn_getBettingDelayTime();
            return toast.success(response?.message);
        } else {
            setLoader(false);
            return toast.error(response?.message);
        }
    }
    return (
        <Modal
            title=""
            open={betDelayModal}
            onOk={() => setBetDelayModal(!betDelayModal)}
            onCancel={() => setBetDelayModal(!betDelayModal)}
            footer={null}
            centered
            style={{ fontFamily: "Roboto" }}
        >
            <p className='text-[18px] font-[700]'>Change Bet Time <span className='text-gray-600 text-[14px]'>(mili seconds)</span></p>
            <input
                min={1}
                value={delayTime}
                onChange={(e) => setDelayTime(e.target.value)}
                type='number'
                className='w-full my-[20px] border h-[40px] rounded-[7px] px-[10px] text-[14px] font-[500] focus:outline-none focus:border-gray-400'
            />
            <button className={`w-full h-[40px] rounded-[7px] bg-[--navy-dark] text-white text-[15px] pt-[1px] font-[500] flex justify-center items-center`} disabled={loader} onClick={fn_submit}>
                {!loader ? "Submit" : (<Loader color='white' size={25} />)}
            </button>
        </Modal>
    )
}

const WebsiteNameModal = ({ websiteNameModal, setWebsiteNameModal, websiteName, setWebsiteName, fn_getWebsiteName }: any) => {
    const [loader, setLoader] = useState(false);
    const fn_submit = async () => {
        if (websiteName === "") {
            return toast.error("Enter Website Name");
        }
        setLoader(true);
        const response = await changeWebsiteName(websiteName);
        if (response?.status) {
            setLoader(false);
            setWebsiteName("");
            fn_getWebsiteName();
            setWebsiteNameModal(false);
            return toast.success(response?.message)
        } else {
            setLoader(false);
            return toast.error(response?.message)
        }
    }
    return (
        <Modal
            title=""
            open={websiteNameModal}
            onOk={() => setWebsiteNameModal(!websiteNameModal)}
            onCancel={() => setWebsiteNameModal(!websiteNameModal)}
            footer={null}
            centered
            style={{ fontFamily: "Roboto" }}
        >
            <p className='text-[18px] font-[700]'>Change Website Name</p>
            <input
                className='w-full my-[20px] border h-[40px] rounded-[7px] px-[10px] text-[14px] font-[500] focus:outline-none focus:border-gray-400'
                value={websiteName}
                onChange={(e) => setWebsiteName(e.target.value)}
            />
            <button className={`w-full h-[40px] rounded-[7px] bg-[--navy-dark] text-white text-[15px] pt-[1px] font-[500] flex justify-center items-center`} disabled={loader} onClick={fn_submit}>
                {!loader ? "Submit" : (<Loader color='white' size={25} />)}
            </button>
        </Modal>
    )
}

const WebsiteLogoModal = ({ websiteLogoModal, setWebsiteLogoModal, fn_getWebsiteLogo }: any) => {
    const [loader, setLoader] = useState(false);
    const [image, setImage] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<any>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                setSelectedImage(file);
            };
            reader.readAsDataURL(file);
        }
    };

    const fn_submit = async () => {
        if (selectedImage === null) {
            return toast.error("Select Logo")
        }
        setLoader(true);
        const data = new FormData();
        data.append('image', selectedImage);
        const response = await changeWebsiteLogo(data);
        if (response?.status) {
            setImage(null);
            setLoader(false);
            fn_getWebsiteLogo();
            setSelectedImage(null);
            setWebsiteLogoModal(false);
            return toast.success(response?.message)
        } else {
            setLoader(false);
            return toast.error(response?.message)
        }
    }

    return (
        <Modal
            title=""
            open={websiteLogoModal}
            onOk={() => setWebsiteLogoModal(!websiteLogoModal)}
            onCancel={() => setWebsiteLogoModal(!websiteLogoModal)}
            footer={null}
            centered
            style={{ fontFamily: "Roboto" }}
        >
            <p className='text-[18px] font-[700]'>Change Website Logo</p>
            <div
                className='w-[120px] h-[120px] rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden my-[20px]'
                onClick={handleImageClick}
            >
                {image ? (
                    <img src={image} alt="Game Logo" className='w-full h-full object-cover' />
                ) : (
                    <div className='flex items-center justify-center text-gray-400'>
                        <FaImage className='text-[40px]' />
                    </div>
                )}
            </div>
            <input
                type='file'
                accept='image/*'
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
            <button className={`w-full h-[40px] rounded-[7px] bg-[--navy-dark] text-white text-[15px] pt-[1px] font-[500] flex justify-center items-center`} disabled={loader} onClick={fn_submit}>
                {!loader ? "Submit" : (<Loader color='white' size={25} />)}
            </button>
        </Modal>
    )
}

const WebsiteColorModal = ({ websiteColorModal, setWebsiteColorModal, fn_getWebsiteColors }: any) => {
    const [loader, setLoader] = useState(false);
    const [color, setColor] = useState("");
    const fn_handleChange = async (e: any) => {
        const { r, g, b, a } = e.metaColor;
        const rgbaColor = `rgba(${r}, ${g}, ${b}, ${a})`;
        setColor(rgbaColor);
    }
    const fn_addWebsiteColor = async () => {
        if (color === "") {
            return toast.error("Select Color");
        }
        setLoader(true);
        const response = await createWebsiteColor({ color });
        if (response?.status) {
            setLoader(false);
            setColor("");
            setWebsiteColorModal(false);
            fn_getWebsiteColors();
            return toast.success(response?.message);
        } else {
            setLoader(false);
            return toast.error(response?.message);
        }
    }
    return (
        <Modal
            title=""
            open={websiteColorModal}
            onOk={() => setWebsiteColorModal(!websiteColorModal)}
            onCancel={() => setWebsiteColorModal(!websiteColorModal)}
            footer={null}
            centered
            style={{ fontFamily: "Roboto" }}
        >
            <p className='text-[18px] font-[700]'>Add Website Color</p>
            <ColorPicker
                defaultValue=""
                style={{ backgroundColor: "transparent", border: "none", width: "max-content", margin: "20px 0px" }}
                showText={true}
                onChange={(e: any) => fn_handleChange(e)}
                value={color}
            />
            <button className={`w-full h-[40px] rounded-[7px] bg-[--navy-dark] text-white text-[15px] pt-[1px] font-[500] flex justify-center items-center`} disabled={loader} onClick={fn_addWebsiteColor}>
                {!loader ? "Submit" : (<Loader color='white' size={25} />)}
            </button>
        </Modal>
    )
}

const PanelColorModal = ({ panelColorModal, setPanelColorModal, fn_getColors }: any) => {
    const [loader, setLoader] = useState(false);
    const [mainColor, setMainColor] = useState("");
    const [secColor, setSecColor] = useState("");
    const fn_selectColor = (e: any, label: string) => {
        const { r, g, b, a } = e.metaColor;
        const rgbaColor = `rgba(${r}, ${g}, ${b}, ${a})`;
        if (label === "mainColor") return setMainColor(rgbaColor);
        if (label === "secColor") return setSecColor(rgbaColor);
    }
    const fn_handleSubmit = async () => {
        if (mainColor === "") {
            return toast.error("Select Main Color")
        }
        if (secColor === "") {
            return toast.error("Select Secondary Color")
        }
        const data = {
            mainColor, secColor
        }
        setLoader(true);
        const response = await createColorApi(data);
        if (response?.status) {
            setPanelColorModal(false);
            setMainColor("");
            setSecColor("");
            setLoader(false);
            fn_getColors();
            toast.success(response?.message);
        } else {
            setLoader(false);
            toast.error(response?.message);
        }
    }
    return (
        <Modal
            title=""
            open={panelColorModal}
            onOk={() => setPanelColorModal(!panelColorModal)}
            onCancel={() => setPanelColorModal(!panelColorModal)}
            footer={null}
            centered
            style={{ fontFamily: "Roboto" }}
        >
            <p className='text-[18px] font-[700]'>Add User Panel Color Combination</p>
            <div className="flex w-[max-content] mt-[25px]">
                <label className="text-[15px] font-[500] w-[200px]">Main Color</label>
                <ColorPicker
                    defaultValue=""
                    showText={true}
                    value={mainColor}
                    onChange={(e) => fn_selectColor(e, 'mainColor')}
                />
            </div>
            <div className="flex w-[max-content] mt-[10px] mb-[25px]">
                <label className="text-[15px] font-[500] w-[200px]">Secondary Color</label>
                <ColorPicker
                    defaultValue=""
                    showText={true}
                    value={secColor}
                    onChange={(e) => fn_selectColor(e, 'secColor')}
                />
            </div>
            <button className={`w-full h-[40px] rounded-[7px] bg-[--navy-dark] text-white text-[15px] pt-[1px] font-[500] flex justify-center items-center`} disabled={loader} onClick={fn_handleSubmit}>
                {!loader ? "Submit" : (<Loader color='white' size={25} />)}
            </button>
        </Modal>
    )
}

const WebsiteBannerModal = ({ websiteBannerModal, setWebsiteBannerModal, fn_getWebsiteBanners }: any) => {
    const [loader, setLoader] = useState(false);
    const [image, setImage] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<any>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                setSelectedImage(file);
            };
            reader.readAsDataURL(file);
        }
    };

    const fn_submit = async () => {
        if (selectedImage === null) {
            return toast.error("Select Banner")
        }
        setLoader(true);
        const response = await createWebsiteBanner(selectedImage);
        if (response?.status) {
            setLoader(false);
            fn_getWebsiteBanners();
            setImage(null);
            setSelectedImage(null);
            setWebsiteBannerModal(false);
            return toast.success(response?.message)
        } else {
            setLoader(false);
            return toast.error(response?.message)
        }
    };

    return (
        <Modal
            title=""
            open={websiteBannerModal}
            onOk={() => setWebsiteBannerModal(!websiteBannerModal)}
            onCancel={() => setWebsiteBannerModal(!websiteBannerModal)}
            footer={null}
            centered
            style={{ fontFamily: "Roboto" }}
        >
            <p className='text-[18px] font-[700]'>Select Website Banner</p>
            <div
                className='w-[300px] h-[180px] rounded-[10px] border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden my-[20px]'
                onClick={handleImageClick}
            >
                {image ? (
                    <img src={image} alt="Game Banner" className='w-full h-full object-cover' />
                ) : (
                    <div className='flex items-center justify-center text-gray-400'>
                        <FaImage className='text-[40px]' />
                    </div>
                )}
            </div>
            <input
                type='file'
                accept='image/*'
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
            <button className={`w-full h-[40px] rounded-[7px] bg-[--navy-dark] text-white text-[15px] pt-[1px] font-[500] flex justify-center items-center`} disabled={loader} onClick={fn_submit}>
                {!loader ? "Submit" : (<Loader color='white' size={25} />)}
            </button>
        </Modal>
    )
}
