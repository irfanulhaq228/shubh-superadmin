import { Modal } from 'antd';
import { FormEvent, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { FaImage } from 'react-icons/fa';
import { createGameApi } from '../../api/api';
import Loader from '../Loader';

const CreateGameModal = ({ createGame, setCreateGame, fn_getGames }: any) => {
    const [image, setImage] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<any>(null);
    const [name, setName] = useState("");
    const [loader, setLoader] = useState(false);
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
    const fn_submit = async (e: FormEvent) => {
        e.preventDefault();
        if (!selectedImage) {
            return toast.error("Select Game Logo");
        }
        if (name === "") {
            return toast.error("Enter Game Name");
        }
        setLoader(true);
        const formData = new FormData();
        formData.append('name', name.toLocaleLowerCase());
        formData.append('image', selectedImage);
        const response = await createGameApi(formData);
        if (response?.status) {
            setName("");
            setSelectedImage(null);
            setImage(null);
            setCreateGame(false);
            setLoader(false);
            fn_getGames();
            return toast.success(response?.message)
        } else {
            setLoader(false);
            return toast.error(response?.message)
        }
    }
    return (
        <Modal
            title=""
            open={createGame}
            onOk={() => setCreateGame(!createGame)}
            onCancel={() => setCreateGame(!createGame)}
            centered
            footer={null}
            style={{ fontFamily: "Roboto" }}
        >
            <p className='text-[22px] font-[600]'>Add New Game</p>
            <hr className='mt-[5px] mb-[10px]' />
            <form className='flex flex-col gap-[20px]' onSubmit={fn_submit}>
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
                <button className='h-[40px] rounded-[7px] text-[15px] font-[500] bg-gray-600 text-white pt-[1px] my-[5px] flex justify-center items-center' disabled={loader}>
                    {!loader ? "Submit" : <Loader color='white' size={20} />}
                </button>
            </form>
        </Modal>
    )
}

export default CreateGameModal