import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/problemset.css';
import { getProblemSet , getSubmission } from '../service/api';
import UserContext from '../context/user/userContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { CircularMetricsCard, SubmissionStatus, Skills, SpinnerLoader } from '../component';

const Problemset = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [problems, setProblems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortedProblems , setSortedProblems] = useState([]);
  const [allSubmissions, setAllSubmissions] = useState([]);
  const [ totaleasy, setEasy ] = useState([]);
  const [ totalmedium , setMedium ] = useState(0);
  const [ totalhard, setHard ] = useState(0);
  const [ solvedEasy ,setSolvedEasy] = useState(0);
  const [ solvedMedium ,setSolvedMedium] = useState(0);
  const [ solvedHard ,setSolvedHard] = useState(0);

  
  const { user, fetchUserProfile } = useContext(UserContext);



  
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
    if (!user) {
      fetchUserProfile();
    }
    fetchData();

    
      setLoading(false);
   

  }, [user]);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const response = await getSubmission();
        //console.log("Response from getSubmission:", response.data.submissions);

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


      } catch (error) {
        console.error('Error fetching submissions:', error);
      }
    };

    if (problems.length > 0) {
      fetchSubmission();
    }
   
      setLoading(false);
   

  }, [user, problems]);
  
  useEffect(() => {
    const sortedEasy = problems.filter(problem => problem.difficulty.includes("easy"));
    setEasy(sortedEasy.length);
  
    const sortedMedium = problems.filter(problem => problem.difficulty.includes("medium"));
    setMedium(sortedMedium.length);
  
    const sortedHard = problems.filter(problem => problem.difficulty.includes("hard"));
    setHard(sortedHard.length);
   
      setLoading(false);
    

  }, [problems]);
  


  const handleProblem = (problem, event) => {
    event.preventDefault();
    navigate(`/problemset/problem/${problem.code}`);
  };

  const getSubmissionStatus = (problemId) => {
    if (user && user.submissions) {
      const submission = user.submissions.find(sub => sub.problemId === problemId);
      return submission ? (submission.status ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faTimes} />) : ' ';
    }
    return 'pending';
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearchTerm(value);

    const sorted = problems
      .filter((problem) => problem.title.toLowerCase().includes(value.toLowerCase()))
      .sort((a, b) => a.title.localeCompare(b.title));

    setSortedProblems(sorted);
  };

  const sortArray = () => {
    const sortedArray = problems.filter(problem => problem.tags.includes("Array"));
    setSortedProblems(sortedArray);
  };
  const sortHash = () => {
    const sortedHash = problems.filter(problem => problem.tags.includes("HashTable"));
    setSortedProblems(sortedHash);
  };
  const sortString = () => {
    const sortedString = problems.filter(problem => problem.tags.includes("String"));
    setSortedProblems(sortedString);
  };
  const sortEasy = () => {
    const sortedEasy = problems.filter(problem => problem.difficulty.includes("easy"));
    setEasy(sortedEasy.length);
    setSortedProblems(sortedEasy);
  };
  const sortMedium = () => {
    const sortedMedium = problems.filter(problem => problem.difficulty.includes("medium"));
    setMedium(sortedMedium.length);
    setSortedProblems(sortedMedium);
  };
  const sortHard = () => {
    const sortedHard = problems.filter(problem => problem.difficulty.includes("hard"));
    setHard(sortedHard.length);
    setSortedProblems(sortedHard);
  };

 
  

  return (
    <>
    <div>
    {loading ? <SpinnerLoader /> :
      <div className="container py-2 px-2">
        <div className="row">
        <div className="col-lg-9">
          <div className="row align-items-center mb-2 p-2">
          <div className="col-md-2">
        <div className="btn-group">
            <button
                type="button"
                className="btn btn-white:hover btn-white dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                aria-label="Default select example"
            >
                Difficulty
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
                <li><button className="dropdown-item" type="button" onClick = {sortEasy}>Easy</button></li>
                <li><button className="dropdown-item" type="button" onClick = {sortMedium}>Medium</button></li>
                <li><button className="dropdown-item" type="button" onClick = {sortHard}>Hard</button></li>
            </ul>
        </div>
    </div>

    <div className="col-md-2">
        <div className="btn-group">
            <button
                type="button"
                className="btn btn-white:hover btn-white dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                aria-label="Default select example"
            >
                Status
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
                <li><button className="dropdown-item" type="button">Solved</button></li>
                <li><button className="dropdown-item" type="button">Attempted</button></li>
                <li><button className="dropdown-item" type="button">Unsolved</button></li>
            </ul>
        </div>
    </div>

    <div className="col-md-2">
        <div className="btn-group">
            <button
                type="button"
                className="btn btn-white:hover btn-white dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                aria-label="Default select example"
            >
                Tags
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
                <li><button className="dropdown-item" type="button" onClick = {sortArray}>Array</button></li>
                <li><button className="dropdown-item" type="button" onClick={sortString}>String</button></li>
                <li><button className="dropdown-item" type="button" onClick = {sortHash}>HashTable</button></li>
            </ul>
        </div>
    </div>

            <div className="col-md-4">
        <div className="input-group">
            <span className="input-group-text" id="searchIcon">
               <FontAwesomeIcon icon={faSearch} />
            </span>
            <input
                type="text"
                className="form-control"
                id="searchBar"
                placeholder="Search..."
                onChange = {handleSearch}
                aria-label="Search"
                aria-describedby="searchIcon"
            />
        </div>
    </div>
        </div>

      <div className="row-header row custom-row-style">
        <div className="col-6 col-md-2 p-3">
          <div className="text-center">Status</div>
        </div>
        <div className="col-6 col-md-6 p-3">Title</div>
        <div className="col-6 col-md-2 p-3">Difficulty</div>
        <div className="col-6 col-md-2 p-3">Solution</div>
      </div>
      
      <div className="table">
        {sortedProblems.map((problem, index) => (
          <div key={index} className={`row custom-row-style ${index % 2 === 0 ? 'even-row' : 'odd-row'}`}>
            <div className="col-6 col-md-2 p-3 text-center">
            <SubmissionStatus problemId={problem._id} />
            </div>
            <div className={`col-6 col-md-6 p-3`}>
              <a
                className={`${index % 2 === 0 ? 'even-row' : 'odd-row'}`}
                href="/problemset/problem"
                onClick={(event) => handleProblem(problem, event)}
              >
                {`${problem.code}. ${problem.title}`}
              </a>
            </div>
            <div className="col-6 col-md-2 p-3">
              {problem.difficulty || "medium"}
            </div>
            <div className="col-6 col-md-2 p-3">
            <SubmissionStatus problemId={problem._id} />
            </div>
          </div>
        ))}
      </div>
      </div>
      <div className="col-lg-3 p-2">

            <CircularMetricsCard/>

            <div className="card mb-4 mb-lg-0">
              <div className="card-body mb-md-0">
              <Skills user={user} />
              </div>
            </div>

      </div>
      </div>
      </div>

}
    </div>
      
    </>
  );
};

export default Problemset;
