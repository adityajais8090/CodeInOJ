import React, { useState, useEffect, useContext } from 'react';

import AuthContext from "./authContext";
import { checkData, getProfile, delSession } from '../../service/api';

export const AuthState = ({children}) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState(null);
    const [errorl, setErrorl] = useState(null);
    const [loading, setLoading] = useState(true);
   

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const data = await getProfile();
                console.log("get data from AuthUser", data);
                if (data.success) {
                    setUser(data.existUser);
                    setIsLoggedIn(true);
                }
            } catch (err) {
                console.error(err);
            }
            finally {
                setLoading(false);
              }
        };

        checkStatus();
    }, []);

    const login = async (userInput) => {
        try {
            const res = await checkData(userInput);
            if (res.success) {
                setUser(res.user);
                setIsLoggedIn(true);
                window.location.href = '/';
            } else {
                setErrorl(res.error);
            }
        } catch (err) {
            setErrorl("An error occurred during login.");
        }
    };

    const logout = async () => {
        try {
            const res = await delSession();
            if (res.success) {
                setUser(null);
                setIsLoggedIn(false);
                
            }
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, error, errorl, user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
