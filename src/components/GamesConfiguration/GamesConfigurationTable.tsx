import toast from 'react-hot-toast';
import { Modal, Switch, Select } from 'antd';
import { useEffect, useRef, useState } from 'react';
import type { ConfigProviderProps } from 'antd';

import { FaEdit, FaImage } from 'react-icons/fa';
import { MdDeleteForever } from "react-icons/md";
import { FaIndianRupeeSign } from 'react-icons/fa6';

import Loader from '../Loader';
import API_URL, { deleteGameByIdApi, getAdminsApi, updateGameApi, updateGameStatusByIdApi } from '../../api/api';

type SizeType = ConfigProviderProps['componentSize'];

const GamesConfigurationTable = ({ colors, data, loading, setData, fn_getGames }: any) => {
    const [editGameModel, setEditGameModel] = useState(false);
    const [selectedGame, setSelectedGame] = useState(null);
    const [adminData, setAdminData] = useState([]);
    const fn_getAdminData = async () => {
        const response = await getAdminsApi();
        if (response?.status) {
            setAdminData(response?.data);
        }
    };
    useEffect(() => {
        fn_getAdminData();
    }, []);
    return (
        <>
            {/* table */}
            <div className="overflow-auto min-w-full">
                <table className="w-[950px] xl:w-full">
                    <thead>
                        <tr
                            className="leading-[40px] font-[600] text-[15px]"
                            style={{ color: colors.text, backgroundColor: colors.light }}
                        >
                            <td className="ps-[5px]">Game</td>
                            {/* <td>Bets Running</td> */}
                            {/* <td>Current Bets Amount</td> */}
                            {/* <td>P/L Ratio</td> */}
                            <td>Registered Admins</td>
                            <td>Disable/Delete</td>
                        </tr>
                    </thead>
                    <tbody className='games-table'>
                        {loading && (
                            <tr>
                                <td colSpan={5} className='text-center py-[10px] font-[500]' style={{ color: colors.subText }}><Loader color={colors.text} size={30} /></td>
                            </tr>
                        )}
                        {!loading && (
                            data?.length > 0 ? data?.map((item: any) => (
                                <TableRows fn_getGames={fn_getGames} adminData={adminData} colors={colors} game={item} data={data} setData={setData} editGameModel={editGameModel} setEditGameModel={setEditGameModel} setSelectedGame={setSelectedGame} selectedGame={selectedGame} />
                            )) : (
                                <tr>
                                    <td colSpan={5} className='text-center py-[10px] font-[500]' style={{ color: colors.subText }}>No Game Found</td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default GamesConfigurationTable;

const TableRows = ({ adminData, colors, game, data, setData, editGameModel, setEditGameModel, selectedGame, setSelectedGame, fn_getGames }: any) => {
    const fn_delete = async (id: string) => {
        const response: any = await deleteGameByIdApi(id);
        if (response.status) {
            const updatedData = data.filter((item: any) => item?._id !== game?._id);
            setData(updatedData);
            return toast.success(response?.message);
        } else {
            return toast.error(response?.message);
        }
    }
    const fn_updateGame = async (value: boolean) => {
        const response: any = await updateGameStatusByIdApi(!value, game?._id);
        if (response.status) {
            return toast.success(response?.message);
        } else {
            return toast.error(response?.message);
        }
    }
    const fn_editClicked = (item: any) => {
        setSelectedGame(item);
        setEditGameModel(true);
    }
    return (
        <>
            <tr
                className="text-[13px] font-[500] border-b leading-[60px]"
                style={{ borderColor: colors.line, color: colors.subText }}
            >
                <td className="ps-[5px] flex items-center gap-[13px]">
                    <a href={`${API_URL}/${game?.image}`} target='__blank'><img alt='img' src={`${API_URL}/${game?.image}`} className='h-[35px] w-[35px] rounded-[3px] object-cover object-center' /></a>
                    <span className='capitalize'>{game.name}</span>
                </td>
                {/* <td>4.5K</td> */}
                {/* <td><FaIndianRupeeSign className='inline-block' />100.3K</td> */}
                {/* <td>Loss</td> */}
                <td>{game?.admins?.length}</td>
                <td>
                    <Switch size="small" defaultChecked={!game?.disabled} title='disable' onChange={fn_updateGame} />
                    <FaEdit className='text-[18px] text-yellow-600 cursor-pointer inline-block ms-[10px]' style={{ color: colors.text }} onClick={() => fn_editClicked(game)} />
                    <MdDeleteForever className='text-[21px] text-red-600 cursor-pointer inline-block ms-[10px]' title='delete' onClick={() => fn_delete(game?._id)} />
                </td>
            </tr>
            <EditGameModel fn_getGames={fn_getGames} adminData={adminData} editGameModel={editGameModel} setEditGameModel={setEditGameModel} selectedGame={selectedGame} setSelectedGame={setSelectedGame} />
        </>
    );
};

const EditGameModel = ({ adminData, editGameModel, setEditGameModel, selectedGame, setSelectedGame, fn_getGames }: any) => {
    const [image, setImage] = useState<string>("");
    const [newImage, setNewImage] = useState<any>(null);
    const [name, setName] = useState<string>("");
    const [loader, setLoader] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [selectedAdmins, setSelectedAdmins] = useState<any[]>([]);
    const [options, setOptions] = useState<any[]>([]);
    const [size, setSize] = useState<SizeType>('middle');

    useEffect(() => {
        const adminOptions = adminData.map((item: any) => ({
            value: item._id,
            label: item.email
        }));
        setOptions(adminOptions);
    }, [adminData]);

    useEffect(() => {
        if (selectedGame) {
            setImage(`${API_URL}/${selectedGame?.image}`);
            setName(selectedGame?.name);
            setSelectedAdmins(selectedGame?.admins?.map((ad: any) => ad.admin) || []);
        }
    }, [selectedGame]);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const fileURL = URL.createObjectURL(file);
            setImage(fileURL);
            setNewImage(file);
        }
    };

    const fn_closeModel = () => {
        setEditGameModel(false);
        setSelectedGame(null);
        setSelectedAdmins([]);
    };

    const handleSelectAdmin = (value: any) => {
        setSelectedAdmins(value);
    };

    const handleSubmit = async (id: string) => {
        const formData = new FormData();
        const updateAdminFormat = selectedAdmins.map((ad) => {
            return { status: true, admin: ad }
        })
        formData.append('admins', JSON.stringify(updateAdminFormat));
        if (selectedGame?.name !== name) {
            formData.append('name', name);
        }
        if (newImage) {
            formData.append('image', newImage);
        }
        setLoader(true);
        const response = await updateGameApi(id, formData);
        if (response?.status) {
            fn_getGames();
            setLoader(false);
            fn_closeModel();
            toast.success("Game Updated");
        } else {
            toast.error(response?.message);
        }


    };

    return (
        <Modal
            title=""
            open={editGameModel}
            onOk={fn_closeModel}
            onCancel={fn_closeModel}
            centered
            style={{ fontFamily: "roboto" }}
            footer={null}
        >
            <p className='text-[22px] font-[600]'>Edit Game</p>
            <hr className='mt-[5px] mb-[10px]' />
            <form className='flex flex-col gap-[20px]' onSubmit={(e) => { e.preventDefault(); handleSubmit(selectedGame._id); }}>
                <div className='flex flex-col gap-[5px]'>
                    <label className='font-[500] text-[15px]'>Upload Game Logo</label>
                    <div
                        className='w-[120px] h-[120px] rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden'
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
                </div>
                <div className='flex flex-col gap-[5px]'>
                    <label className='font-[500] text-[15px]'>Game Name</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className='h-[40px] border rounded-[7px] px-[10px] text-[14px] font-[500] focus:outline-none focus:border-gray-300'
                    />
                </div>
                <Select
                    showSearch
                    mode="multiple"
                    size={size}
                    placeholder="Please select"
                    value={selectedAdmins}
                    onChange={handleSelectAdmin}
                    style={{ width: '100%', minHeight: '40px' }}
                    options={options}
                    filterOption={(input: any, option: any) => option?.label.toLowerCase().includes(input.toLowerCase())}
                />
                <button
                    className='h-[40px] rounded-[7px] text-[15px] font-[500] bg-gray-600 text-white pt-[1px] my-[5px] flex justify-center items-center'
                    disabled={loader}
                >
                    {!loader ? "Submit" : <Loader color='white' size={20} />}
                </button>
            </form>
        </Modal>
    );
};
