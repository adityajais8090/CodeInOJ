import React, { useState, useEffect } from 'react';
import ProblemContext from "./problemContext";
import { getProblems } from '../../service/api';

const ProblemState = (props) => {
    const [problem, setProblem] = useState(null);

    useEffect(() => {
        fetchProblem();
    }, []);

    const fetchProblem = async () => {
        try {
            const response = await getProblems();
            if (response.existProblem) {
                setProblem(response.existProblem);
            } else {
                setProblem(null);
            }
        } catch (err) {
            console.error("Error fetching user profile", err);
            setProblem(null);
        }
    };

    return (
        <ProblemContext.Provider value={{ problem, fetchProblem }}>
            {props.children}
        </ProblemContext.Provider>
    );
};

export default ProblemState;
