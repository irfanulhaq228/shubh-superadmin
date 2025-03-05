import Cookies from 'js-cookie';
import React, { ReactNode, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from '../Loader';

interface AuthCheckProps {
    children: ReactNode;
}

const AuthCheck: React.FC<AuthCheckProps> = ({ children }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const token = Cookies.get('superAdminToken');
    const [loader, setLoader] = useState(true);

    useEffect(() => {
        setLoader(true);
        if (location.pathname !== "/") {
            if (token) {
                setLoader(false);
            } else {
                navigate("/");
                setLoader(false);
            }
        }else{
            if (token) {
                navigate("/dashboard");
                setLoader(false);
            } else {
                setLoader(false);
            }
        }
    }, [location.pathname, token, dispatch, navigate]);

    if (loader) {
        return <div className='flex justify-center items-center min-h-[100vh]'><Loader color='var(--navy)' size={50} /></div>
    }
    return <>{children}</>;
};

export default AuthCheck;
