import axios from "axios";
import Cookies from "js-cookie";

const URL = "https://backend.shubhexchange.com";
// const URL = "https://test-backend.shubhexchange.com";

export const formatDate = (dateString: any) => {
    const optionsDate: any = { day: '2-digit', month: 'short', year: 'numeric' };
    const optionsTime: any = { hour: '2-digit', minute: '2-digit', hour12: true };
    const date = new Date(dateString);

    const formattedDate = date.toLocaleDateString('en-US', optionsDate);
    const formattedTime = date.toLocaleTimeString('en-US', optionsTime);

    return `${formattedDate}, ${formattedTime}`;
};

export const fn_getPendingBets = async (selectedGameName: string | null, selectedSide: string | null, selectedMarketName: string | null) => {
    try {
        const token = Cookies.get('superAdminToken');
        const response = await axios.get(`${URL}/betting/super-admin?${selectedGameName ? `gameName=${selectedGameName}` : ""}&${selectedSide ? `side=${selectedSide}` : ""}&${selectedMarketName ? `marketName=${selectedMarketName}` : ""}`);
        if (response.status === 200) {
            return {
                status: true,
                data: response?.data?.data,
                gameNames: response?.data?.gameNames,
                marketNames: response?.data?.marketNames,
            }
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
}

export const fn_betsResultsManuallyApi = async (data: any) => {
    try {
        const response = await axios.post(`${URL}/betting/super-admin/result`, data);
        if (response.status === 200) {
            return { status: true }
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
}

export const superAdminLoginApi = async (data: { email: string; password: string }) => {
    try {
        const response = await axios.post(`${URL}/super-admin/login`, data);
        if (response.status === 200) {
            Cookies.set('superAdminToken', response?.data?.token)
            return { status: true, message: "Loggedin Successfull", id: response.data.id }
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
};

export const getAllAdminsApi = async () => {
    try {
        const token = Cookies.get('superAdminToken');
        const response = await axios.get(`${URL}/super-admin/admins`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        if (response?.status === 200) {
            return { status: true, data: response?.data?.data };
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
};

export const createAdminApi = async (data: any) => {
    try {
        const token = Cookies.get('superAdminToken');
        const response = await axios.post(`${URL}/super-admin/create-admin`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        if (response?.status === 200) {
            return { status: true, data: response?.data?.data };
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
};

export const editAdminApi = async (data: any, id: string) => {
    try {
        const token = Cookies.get('superAdminToken');
        const response = await axios.patch(`${URL}/super-admin/admin/update/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        if (response?.status === 200) {
            return { status: true, data: response?.data?.data };
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
};

export const updateBetDelayApi = async (id: any, data: any) => {
    try {
        const token = Cookies.get('superAdminToken');
        const response = await axios.post(`${URL}/website/betting-time?id=${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        if (response?.status === 200) {
            return { status: true, message: response?.data?.message };
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
};

export const adminStatusUpdateApi = async (value: boolean, id: string) => {
    try {
        const token = Cookies.get('superAdminToken');
        const response = await axios.post(`${URL}/super-admin/update-admin/${id}`, { value }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        if (response.status === 200) {
            return { status: true, message: "Admin Updated" }
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
};

export const adminWalletUpdateApi = async (value: number, id: string) => {
    try {
        const token = Cookies.get('superAdminToken');
        const response = await axios.post(`${URL}/super-admin/update-admin/wallet/${id}`, { value }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        if (response.status === 200) {
            return { status: true, message: "Admin Points Updated" }
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
};

export const createGameApi = async (data: any) => {
    try {
        const response = await axios.post(`${URL}/game`, data);
        if (response.status === 200) {
            return { status: true, message: "Game Created Successfully" }
        }
    } catch (error: any) {
        if (error?.status === 409) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
};

export const getGamesApi = async () => {
    try {
        const response = await axios.get(`${URL}/game`);
        if (response.status === 200) {
            return { status: true, data: response?.data?.data }
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
}

export const getAdminsApi = async () => {
    try {
        const response = await axios.get(`${URL}/admin`);
        if (response.status === 200) {
            return { status: true, data: response?.data?.data }
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
}

export const updateGameApi = async (id: string, data: any) => {
    try {
        const response = await axios.patch(`${URL}/game/${id}`, data);
        if (response.status === 200) {
            return { status: true, data: response?.data?.data }
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
}

// =====================================================================================

export const getAllUsersApi = async () => {
    try {
        const response = await axios.get(`${URL}/user`);
        if (response?.status === 200) {
            return { status: true, message: "User Created Successfully", data: response?.data?.data };
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
}

export const adminLoginApi = async (data: { email: string; password: string }) => {
    try {
        const response = await axios.post(`${URL}/admin/login`, data);
        if (response.status === 200) {
            return { status: true, message: "OTP sent to your Email", id: response.data.id }
        }
    } catch (error: any) {
        if (error?.status === 401) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
}

export const adminOTPApi = async (data: { id: string; otp: string }) => {
    try {
        const response = await axios.post(`${URL}/admin/otp`, data);
        if (response.status === 200) {
            return { status: true, message: "Email Verified" }
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
}

export const deleteUserByIdApi = async (id: string) => {
    try {
        const response = await axios.delete(`${URL}/user/${id}`);
        if (response?.status === 200) {
            return { status: true, message: "User Deleted" }
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
}

export const userStatusUpdateApi = async (value: boolean, id: string) => {
    try {
        const response = await axios.post(`${URL}/user/status/${id}`, { value });
        if (response.status === 200) {
            return { status: true, message: "User Updated" }
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
}

export const deleteGameByIdApi = async (id: string) => {
    try {
        const response = await axios.delete(`${URL}/game/${id}`);
        if (response.status === 200) {
            return { status: true, message: "Game Deleted Successfully" }
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
}

export const updateGameStatusByIdApi = async (value: boolean, id: string) => {
    try {
        const response = await axios.post(`${URL}/game/status/${id}`, { value });
        if (response.status === 200) {
            return { status: true, message: "Game Updated Successfully" }
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
}

export const createColorApi = async (data: any) => {
    try {
        const response = await axios.post(`${URL}/website/color`, data);
        if (response.status === 200) {
            return { status: true, message: "Color Added Successfully" }
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
}

export const getAllColorsApi = async () => {
    try {
        const response = await axios.get(`${URL}/website/color`);
        if (response.status === 200) {
            return { status: true, data: response?.data?.data }
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
}

export const deleteColorByIdApi = async (id: string) => {
    try {
        const response = await axios.delete(`${URL}/website/color/${id}`);
        if (response.status === 200) {
            return { status: true, message: "Color Deleted" }
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
}

export const updateColorStatusById = async (id: string, status: boolean) => {
    try {
        const response = await axios.patch(`${URL}/website/color/status/${id}`, { status });
        if (response.status === 200) {
            return { status: true, message: "Color Updated" }
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
}

export const changeWebsiteName = async (name: string) => {
    try {
        const response = await axios.post(`${URL}/website/name`, { name });
        if (response.status === 200) {
            return { status: true, message: "Website Name Updated" }
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
}

export const getWebsiteNameApi = async () => {
    try {
        const response = await axios.get(`${URL}/website/name`);
        if (response.status === 200) {
            return { status: true, data: response?.data?.data }
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
}

export const changeWebsiteLogo = async (data: any) => {
    try {
        const response = await axios.post(`${URL}/website/logo`, data);
        if (response.status === 200) {
            return { status: true, message: "Website Logo Updated" }
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
}

export const getWebsiteLogoApi = async () => {
    try {
        const response = await axios.get(`${URL}/website/logo`);
        if (response.status === 200) {
            return { status: true, data: response?.data?.data }
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
}

export const createWebsiteColor = async (data: any) => {
    try {
        const response = await axios.post(`${URL}/website/website-color`, data);
        if (response.status === 200) {
            return { status: true, message: "Website Color Added" }
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
}

export const getAllWebsiteColors = async () => {
    try {
        const response = await axios.get(`${URL}/website/website-color`);
        if (response.status === 200) {
            return { status: true, data: response?.data?.data }
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
}

export const updateWebsiteColor = async (id: string) => {
    try {
        const response = await axios.patch(`${URL}/website/website-color/${id}`);
        if (response.status === 200) {
            return { status: true, message: "Color Updated" }
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
}

export const deleteWebsiteColor = async (id: string) => {
    try {
        const response = await axios.delete(`${URL}/website/website-color/${id}`);
        if (response.status === 200) {
            return { status: true, message: "Color Deleted" }
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
}

export const createBankApi = async (data: any) => {
    try {
        const token = Cookies.get('adminToken');
        const response = await axios.post(`${URL}/bank`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (response.status === 200) {
            return { status: true, message: "Bank Added " }
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
}

export const getAllBanksApi = async () => {
    try {
        const response = await axios.get(`${URL}/bank/admin`);
        if (response.status === 200) {
            return { status: true, data: response?.data?.data }
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
}

export const updateBankApi = async (id: string, data: any) => {
    try {
        const response = await axios.patch(`${URL}/bank/${id}`, data);
        if (response.status === 200) {
            return { status: true, message: "Bank Updated" }
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
}

export const deleteBankByIdApi = async (id: string) => {
    try {
        const response = await axios.delete(`${URL}/bank/${id}`);
        if (response.status === 200) {
            return { status: true, message: "Bank Deleted" }
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
}

export const updateBankDetailsApi = async (id: string, data: any) => {
    try {
        const response = await axios.patch(`${URL}/bank/${id}`, data);
        if (response.status === 200) {
            return { status: true, message: "Bank Updated" }
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
}

export const getDepositApi = async () => {
    try {
        const token = Cookies.get('adminToken');
        const response = await axios.get(`${URL}/deposit/admin`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (response.status === 200) {
            return { status: true, data: response?.data?.data }
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
}

export const getWithdrawApi = async () => {
    try {
        const token = Cookies.get('adminToken');
        const response = await axios.get(`${URL}/withdraw/admin`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (response.status === 200) {
            return { status: true, data: response?.data?.data }
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
}

export const updateDepositApi = async (id: string, value: string) => {
    try {
        const response = await axios.patch(`${URL}/deposit/status/${id}`, { value });
        if (response.status === 200) {
            return { status: true, message: "Status Updated" }
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
}

export const updateWithdrawApi = async (id: string, value: string) => {
    try {
        const response = await axios.patch(`${URL}/withdraw/status/${id}`, { value });
        if (response.status === 200) {
            return { status: true, message: "Status Updated" }
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
}

export const getAllLedgerApi = async () => {
    try {
        const token = Cookies.get('adminToken');
        const response = await axios.get(`${URL}/ledger/admin`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (response.status === 200) {
            return { status: true, data: response?.data?.data }
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
}

export const createWebsiteBanner = async (image: any) => {
    try {
        const data = new FormData();
        data.append('image', image);
        const token = Cookies.get('adminToken');
        const response = await axios.post(`${URL}/website/banner`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.status === 200) {
            return { status: true, message: "Website Banner Added" }
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
}

export const getAdminWebsiteBanners = async () => {
    try {
        const token = Cookies.get('adminToken');
        const response = await axios.get(`${URL}/website/banner/admin`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.status === 200) {
            return { status: true, data: response?.data?.data }
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
}

export const deleteAdminWebsiteBanners = async (id: string) => {
    try {
        const response = await axios.delete(`${URL}/website/banner/${id}`);
        if (response.status === 200) {
            return { status: true, message: "Website Banner Deleted Successfully" }
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
}

export const createBettingTimeApi = async (data: any) => {
    try {
        const token = Cookies.get('adminToken');
        const response = await axios.post(`${URL}/website/betting-time`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.status === 200) {
            return { status: true, message: "Delay Time Updated" }
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
}

export const getBettingTimeApi = async () => {
    try {
        const token = Cookies.get('adminToken');
        const response = await axios.get(`${URL}/website/betting-time`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.status === 200) {
            return { status: true, data: response?.data?.data }
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
}

export const getBetsApi = async (label: string) => {
    try {
        const token = Cookies.get('adminToken');
        const response = await axios.get(`${URL}/bet/admin`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.status === 200) {
            return { status: true, data: response?.data?.data?.filter((item: any) => item?.status === label) };
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
}

export const getOpenBetsByAdminApi = async (savedToken: any) => {
    try {
        const token = savedToken || Cookies.get('adminToken');
        const response = await axios.get(`${URL}/bet/admin/open`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        if (response.status === 200) {
            return { status: true, data: response?.data?.data }
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
}

export const getClosedBetsByAdminApi = async (savedToken: any) => {
    try {
        const token = savedToken || Cookies.get('adminToken');
        const response = await axios.get(`${URL}/bet/admin/close`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        if (response.status === 200) {
            return { status: true, data: response?.data?.data }
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
}

export const getAdminDetailsApi = async () => {
    try {
        const token = Cookies.get('adminToken');
        const response = await axios.get(`${URL}/admin/login-details`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        if (response?.status === 200) {
            return { status: true, data: response?.data?.data }
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
}

export const getAdminDashboardDataApi = async () => {
    try {
        const token = Cookies.get('adminToken');
        const response = await axios.get(`${URL}/admin/dashboard-data`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        if (response?.status === 200) {
            return { status: true, data: response?.data }
        }
    } catch (error: any) {
        if (error?.status === 400) {
            return { status: false, message: error?.response?.data?.message };
        } else {
            return { status: false, message: "Network Error" }
        }
    }
}

export default URL;