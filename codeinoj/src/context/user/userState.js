import React, { useState, useEffect } from 'react';
import UserContext from "./userContext";
import { getProfile, delSession } from '../../service/api';

const UserState = (props) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await getProfile();
            if (response.existUser) {
                setUser(response.existUser);
            } else {
                setUser(null);
            }
        } catch (err) {
            console.error("Error fetching user profile", err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await delSession();
            if (response.success) {
                setUser(null);
                window.location.href = '/login';
            }
        } catch (err) {
            console.error("Error while logout", err);
        }
    };

    return (
        <UserContext.Provider value={{ user, fetchUserProfile, handleLogout, loading }}>
            {props.children}
        </UserContext.Provider>
    );
};

export default UserState;
