import React, { useState, useEffect } from 'react';
import UserContext from "./userContext";
import { getProfile } from '../../service/api';

const UserState = (props) => {
    const [user, setUser] = useState(null);

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
        }
    };

    return (
        <UserContext.Provider value={{ user, fetchUserProfile }}>
            {props.children}
        </UserContext.Provider>
    );
};

export default UserState;