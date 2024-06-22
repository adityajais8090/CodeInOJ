import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/profile.css';

// backend server
const API_URL = 'http://localhost:8000';

const Profile = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const response = await axios.get(`${API_URL}/profile`, {
                    withCredentials: true, // Send cookies along with the request if using cookies for authentication
                });
                console.log(response.data); // Log response from the server
                setAuthenticated(true); // Set authenticated state to true upon successful response
                setLoading(false); // Set loading state to false after authentication check
            } catch (err) {
                console.error("Error checking authentication:", err);
                setAuthenticated(false); // Set authenticated state to false if error occurs
                setLoading(false); // Set loading state to false after authentication check
                setError(err.message); // Set error state if request fails
            }
        };

        checkAuthentication();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Show loading indicator while checking authentication
    }

    if (error) {
        return <div>Error: {error}</div>; // Show error message if authentication check fails
    }

    if (!authenticated) {
        return <div>Unauthorized Access</div>; // Handle unauthorized access here (e.g., redirect to login)
    }

    return (
        <div className="Home">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-5">
                        <div className="center-box bg-light">
                            <h1>Profile Page</h1>
                            <p>This is the profile page content.</p>
                            {/* Add more profile details or components as needed */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
