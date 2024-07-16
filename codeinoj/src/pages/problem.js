import '../styles/problem.css';
import React, { useEffect, useState, useContext } from 'react';
import { useAuth } from '../context/auth/authState';
import { useParams } from 'react-router-dom';
import { getTestCases } from '../service/api';
import Compiler from './compiler';
import { DescriptionCard, SubmissionCard, AllSubmissionsCard, EditorialCard, SpinnerLoader } from '../component';


const Problem = () => {
  const { code } = useParams();
  const { user, loading } = useAuth();

  const initialCode = `// Your First C++ Program
    #include <bits/stdc++.h>
    using namespace std;

    int main(){
        cout << "Hello World !";
        return 0;
    }
  `;

  const [problem, setProblem] = useState({
    code: "",
    title: "",
    description: "",
    constraints: [""],
    tags: [""],
    testcaseId: [""],
    timelimit: 0,
    memorylimit: 0,
    difficulty: "",
  });

  const [testcases, setTestcases] = useState({
    input1: '',
    output1: '',
    input2: '',
    output2: '',
  });

  const [loadingDescription, setLoadingDescription] = useState(true);
  const [loadingSubmission, setLoadingSubmission] = useState(false);
  const [loadingEditorial, setLoadingEditorial] = useState(false);
  const [loadingAllSubmissions, setLoadingAllSubmissions] = useState(false);
  const [loadingCompiler, setLoadingCompiler] = useState(true);

  const [showDescription, setShowDescription] = useState(true);
  const [showSubmission, setShowSubmission] = useState(false);
  const [showEditorial, setShowEditorial] = useState(false);
  const [showAllSubmissions, setShowAllSubmissions] = useState(false);

  useEffect(() => {
    const fetchTestCases = async () => {
      try {
        const response = await getTestCases(code);
        if (response.success) {
          setTestcases({
            input1: response.testcases[0].input,
            output1: response.testcases[0].output,
            input2: response.testcases[1].input,
            output2: response.testcases[1].output,
          });
          setProblem(response.existProblem);
        }
        setLoadingDescription(false);
        setLoadingCompiler(false);
      } catch (err) {
        //console.log("Error in getting TestCases", err);
        setLoadingDescription(false);
        setLoadingCompiler(false);
      }
    };

   
    fetchTestCases();
  }, [user, code]);

  const handleDescriptionClick = () => {
    setShowDescription(true);
    setShowSubmission(false);
    setShowEditorial(false);
    setShowAllSubmissions(false);
  };

  const handleSubmissionClick = () => {
    setLoadingSubmission(true);
    setShowDescription(false);
    setShowSubmission(true);
    setShowEditorial(false);
    setShowAllSubmissions(false);
    setLoadingSubmission(false);
  };

  const handleEditorialClick = () => {
    setLoadingEditorial(true);
    setShowDescription(false);
    setShowSubmission(false);
    setShowEditorial(true);
    setShowAllSubmissions(false);
    setLoadingEditorial(false);
  };

  const handleAllSubmissionsClick = () => {
    setLoadingAllSubmissions(true);
    setShowDescription(false);
    setShowSubmission(false);
    setShowEditorial(false);
    setShowAllSubmissions(true);
    setLoadingAllSubmissions(false);
  };

  if (loading) {
    // You can return a loading spinner or null while loading
    return <div><SpinnerLoader/></div>;
  }

  return (
    <div className="Problem" style={{ backgroundColor: '#eee', minHeight: '120vh' }}>
      <div className="container-fluid py-2 h-100">
        <div className="row h-100 ">
          {/* Problem card */}
          <div className="col-lg-5 d-flex flex-column" style={{ maxHeight: '100vh', overflowY: 'auto' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <button type="button" className={`btn ${showDescription ? 'btn-primary' : 'btn-light'} flex-grow-1`} onClick={handleDescriptionClick}>Description</button>
              <button type="button" className={`btn ${showSubmission ? 'btn-primary' : 'btn-light'} flex-grow-1`} onClick={handleSubmissionClick}>Submission</button>
              <button type="button" className={`btn ${showEditorial ? 'btn-primary' : 'btn-light'} flex-grow-1`} onClick={handleEditorialClick}>Editorial</button>
              <button type="button" className={`btn ${showAllSubmissions ? 'btn-primary' : 'btn-light'} flex-grow-1`} onClick={handleAllSubmissionsClick}>All Submission</button>
            </div>

            {/* Conditionally render cards based on button click */}
            {showDescription && (loadingDescription ? <SpinnerLoader /> : <DescriptionCard problem={problem} testcases={testcases} />)}
            {showSubmission && (loadingSubmission ? <SpinnerLoader /> : <SubmissionCard problemId={problem._id} userId={user._id} />)}
            {showEditorial && (loadingEditorial ? <SpinnerLoader /> : <EditorialCard problem={problem} />)}
            {showAllSubmissions && (loadingAllSubmissions ? <SpinnerLoader /> : <AllSubmissionsCard problemId={problem._id} />)}
          </div>

          {/* Compiler card */}
          <div className="col-lg-7" style={{ maxHeight: '100vh', overflowY: 'auto', backgroundColor: '#eee' }}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">Compiler</h5>
                {loadingCompiler ? <SpinnerLoader /> : <Compiler problem={problem} initialCode={initialCode} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Problem;
