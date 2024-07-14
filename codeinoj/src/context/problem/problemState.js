import React, { useState, useEffect } from 'react';
import ProblemContext from "./problemContext";
import { getProblemSet } from '../../service/api';

const ProblemState = (props) => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true); // Added loading state

    useEffect(() => {
        fetchContextProblems();
    }, []);

    const fetchContextProblems = async () => {
        try {
            const response = await getProblemSet();
            console.log("Response from ProblemSet Context:", response);
            if (response) {
                setProblems(response);
            } else {
                setProblems([]);
            }
        } catch (err) {
            console.error("Error fetching user profile", err);
            setProblems([]); // Set problems to empty array on error
        } finally {
            setLoading(false); // Set loading state to false regardless of success or failure
        }
    };

    return (
        <ProblemContext.Provider value={{ problems, fetchContextProblems, loading }}> {/* Pass loading state */}
            {loading ? (
                <div>Loading...</div> // Display a loading indicator
            ) : (
                props.children
            )}
        </ProblemContext.Provider>
    );
};

export default ProblemState;
