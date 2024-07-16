import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/problemset.css';
import { getProblemSet, getSubmission } from '../service/api';
import { useAuth } from '../context/auth/authState';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import SpinnerLoader from './SpinnerLoader';

// Register the required elements and plugins
ChartJS.register(ArcElement, Tooltip, Legend);

const CircularMetricsCard = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortedProblems, setSortedProblems] = useState([]);
  const [allSubmissions, setAllSubmissions] = useState([]);
  const [totaleasy, setEasy] = useState(0);
  const [totalmedium, setMedium] = useState(0);
  const [totalhard, setHard] = useState(0);
  const [solvedEasy, setSolvedEasy] = useState(0);
  const [solvedMedium, setSolvedMedium] = useState(0);
  const [solvedHard, setSolvedHard] = useState(0);
  const [ loadingdata , setLoading] = useState(true);

  const { user, loading } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProblemSet();
       // console.log("Response from ProblemSet:", response);
        setProblems(response);
        setSortedProblems(response);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };

   
    fetchData();
  }, [user]);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const response = await getSubmission();
      //  console.log("Response from getSubmission:", response.data.submissions);

        // Filter to include only passed submissions
        const passedSubmissions = response.data.submissions.filter(sub => sub.isPassed);
        setAllSubmissions(passedSubmissions);

        // Use a Set to track unique problem IDs
        const uniqueProblems = new Set();

        // Arrays to hold unique problem IDs based on difficulty
        const easyProblems = new Set();
        const mediumProblems = new Set();
        const hardProblems = new Set();

        passedSubmissions.forEach(sub => {
          if (!uniqueProblems.has(sub.problemId)) {
            uniqueProblems.add(sub.problemId);
            const problem = problems.find(problem => problem._id === sub.problemId);
            if (problem) {
              if (problem.difficulty === "easy") {
                easyProblems.add(sub.problemId);
              } else if (problem.difficulty === "medium") {
                mediumProblems.add(sub.problemId);
              } else if (problem.difficulty === "hard") {
                hardProblems.add(sub.problemId);
              }
            }
          }
        });

        setSolvedEasy(easyProblems.size);
        setSolvedMedium(mediumProblems.size);
        setSolvedHard(hardProblems.size);
       setLoading(false);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      }
    };

    if (problems.length > 0) {
      fetchSubmission();
    }
  }, [user, problems]);

  useEffect(() => {
    const sortedEasy = problems.filter(problem => problem.difficulty.includes("easy"));
    setEasy(sortedEasy.length);

    const sortedMedium = problems.filter(problem => problem.difficulty.includes("medium"));
    setMedium(sortedMedium.length);

    const sortedHard = problems.filter(problem => problem.difficulty.includes("hard"));
    setHard(sortedHard.length);
  }, [problems]);

  if (!problems) {
    return <div><SpinnerLoader/></div>; // Show a loading indicator while problems are fetched
  }

  const data = {
    labels: ['Solved', 'Unsolved'],
    datasets: [
      {
        data: [solvedEasy, totaleasy - solvedEasy],
        backgroundColor: ['#4caf50', '#c8e6c9'],
        hoverBackgroundColor: ['#388e3c', '#a5d6a7'],
      },
      {
        data: [solvedMedium, totalmedium - solvedMedium],
        backgroundColor: ['#ff9800', '#ffe0b2'],
        hoverBackgroundColor: ['#f57c00', '#ffcc80'],
      },
      {
        data: [solvedHard, totalhard - solvedHard],
        backgroundColor: ['#f44336', '#ffcdd2'],
        hoverBackgroundColor: ['#d32f2f', '#ef9a9a'],
      },
    ],
  };

  const options = {
    cutout: '70%',
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
 <div>
    {loadingdata && loading ? <SpinnerLoader/> : 
    <div className="card mb-4">
      <div className="card-body text-center">
        <div className="row">
          <div className="col-12 mb-3">
            <h5>Total Solved: {solvedEasy + solvedMedium + solvedHard} / {totaleasy + totalmedium + totalhard}</h5>
          </div>
          <div className="col-4">
            <h6>Easy</h6>
            <Doughnut data={{ ...data, datasets: [data.datasets[0]] }} options={options} />
            <p>{solvedEasy} / {totaleasy}</p>
          </div>
          <div className="col-4">
            <h6>Medium</h6>
            <Doughnut data={{ ...data, datasets: [data.datasets[1]] }} options={options} />
            <p>{solvedMedium} / {totalmedium}</p>
          </div>
          <div className="col-4">
            <h6>Hard</h6>
            <Doughnut data={{ ...data, datasets: [data.datasets[2]] }} options={options} />
            <p>{solvedHard} / {totalhard}</p>
          </div>
        </div>
      </div>
    </div>
} </div>
  );
};

export default CircularMetricsCard;
