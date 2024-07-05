import { useState, useEffect } from 'react';
import '../styles/compiler.css';
import { runOutput, getTestCases, postSubmissions, getSubmitResult } from '../service/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand, faPlay, faUpload } from '@fortawesome/free-solid-svg-icons';
import 'codemirror/lib/codemirror.css';
import 'codemirror/lib/codemirror';
import 'codemirror/mode/clike/clike';
import 'codemirror/theme/dracula.css';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/matchbrackets';
import CodeMirror from 'codemirror';

const Compiler = ({ problem }) => {
    const initialCode = `// Your First C++ Program
        #include <bits/stdc++.h>
        using namespace std;

        int main(){
            cout << "Hello World !";
            return 0;
        }
    `;

    const [inputExpanded, setInputExpanded] = useState(false);
    const [outputExpanded, setOutputExpanded] = useState(false);
    const [fontSize] = useState(14); // Initial font size
    const [activeSection, setActiveSection] = useState('TestCase');
    const [code, setCode] = useState(initialCode);
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [results, setResults] = useState([]);
    const [totalTestCases, setTotalTestCases] = useState(0);
    const [currentTestCase, setCurrentTestCase] = useState(0);
    const [stderr, setStderr] = useState('');
    const [wrongOutput, setWrongOutput] = useState(false);
    

    useEffect(() => {
        const editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
            mode: "text/x-c++src",
            theme: "dracula",
            lineNumbers: true,
            autoCloseBrackets: true,
            matchBrackets : true,
        });

        // Apply initial font size
        editor.getWrapperElement().style.fontSize = `${fontSize}px`;

        editor.on('change', (instance) => {
            setCode(instance.getValue());
        });

        return () => {
            if (editor) {
                editor.toTextArea();
            }
        };
    }, [fontSize]);

    const handleExpandInput = () => {
        setInputExpanded(!inputExpanded);
    };

    const handleExpandOutput = () => {
        setOutputExpanded(!outputExpanded);
    };

    const handleTestCase = () => {
        setActiveSection('TestCase');
    };

    const handleTestResult = () => {
        setActiveSection('TestResult');
    };

    const handleSubmit = async () => {
        try {
            const { existTestcase } = await getTestCases(problem.code);
            setTotalTestCases(existTestcase.length);
            setActiveSection('TestResult');
            let result = [];
            let count = 0;
            try {
                const payload = {
                    language : 'cpp',
                    code,
                    testcases : existTestcase,
                }
                 const response = await getSubmitResult(payload);
                 console.log("Here is my submission response :", response);
                   count = response.count;
                   if (response.failedTestcase) {
                    result.push(response.failedTestcase)
                    setResults(result);
                } else {
                    setResults([]);
                }
                   setCurrentTestCase(count);
                  
                setStderr('');
            } catch (error) {
                console.log("Error running code:", error);
                setStderr(error.data.error.stderr || error.message || "Unknown error occurred"); 
            }

            console.log("currTestcase :", currentTestCase);
            console.log("here is Results :", results);
        

            if(count === existTestcase.length){
                setWrongOutput(false);
                const submitload = {
                    problemId : problem._id,
                    code,
                    status : "passed",
                }
                const response = await postSubmissions(submitload);
                console.log("submissions res :", response);
            }else{
                setWrongOutput(true);
                const submitload = {
                    problemId : problem._id,
                    code,
                    status : "failed",
                }
                const response = await postSubmissions(submitload);
                console.log("submissions res :", response);
            }

        } catch (err) {
            console.log("Error fetching test cases:", err);
            setStderr(err.message || "Unknown error occurred"); // Set stderr state
        }
    };
    

    const handleRun = async () => {
        const payload = {
            language: 'cpp',
            code,
            input,
        };
        try {
            const response = await runOutput(payload);
            console.log("Here is my response :" , response);
            setOutput(response.output);
            setStderr('');
        } catch (error) {
            console.log("Error running code:", error.data);
            setStderr(error.data.error.stderr || error.message || "Unknown error occurred"); 
            console.log("here is my stderr :", stderr);
        }
    };

    return (
        <div className="compiler-container">
            <div className="row no-gutters">
                <div className="col-lg-12 mb-2">
                    <div className="card">
                        <div className="card-body">
                            <form>
                                <div className="row align-items-center mb-2">
                                    <div className="col-md-3">
                                        <select className="form-select" id="languageSelect" aria-label="Default select example">
                                            <option value="1">C++</option>
                                            <option value="2">Java</option>
                                            <option value="3">Python</option>
                                        </select>
                                    </div>
                                    <div className="col-md-2 px-0">
                                        <button type="button" onClick={handleRun} className="btn btn-light d-flex align-items-center justify-content-start">
                                            <FontAwesomeIcon icon={faPlay} className="me-2" />
                                            <span className="fw-light">Run</span>
                                        </button>
                                    </div>
                                    <div className="col-md-2 px-0">
                                        <button type="button" onClick={handleSubmit} className="btn btn-light d-flex align-items-center justify-content-start" style={{ color: 'green' }}>
                                            <FontAwesomeIcon icon={faUpload} className="me-2" />
                                            <span className="fw-light text-success">Submit</span>
                                        </button>
                                    </div>
                                </div>
                                <textarea
                                    className="form-control expanding-textarea"
                                    id="editor"
                                    value={code}
                                    rows="10"
                                    aria-label="Code Editor"
                                ></textarea>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-lg-12 mb-2">
                    <div className="card">
                        <div className="card-body">
                            <div className="p-1">
                                <button type="button" className={`btn btn-outline-secondary ${activeSection === 'TestCase' ? 'active' : ''}`} onClick={handleTestCase}>
                                    TestCase
                                </button>
                                <span>   </span>
                                <button type="button" className={`btn btn-outline-secondary ${activeSection === 'TestResult' ? 'active' : ''}`} onClick={handleTestResult}>
                                    TestResult
                                </button>
                            </div>
                            {activeSection === 'TestCase' && (
                                <form>
                                    <div className="form-group mb-3">
                                        <label htmlFor="input">Input</label>
                                        <div className="input-group">
                                            <textarea
                                                className={`form-control expanding-textarea ${inputExpanded ? 'expanded' : ''}`}
                                                id="input"
                                                value={input}
                                                onChange={(e) => setInput(e.target.value)}
                                                rows={inputExpanded ? "3" : "1"}
                                                aria-label="Input Text"
                                            ></textarea>
                                            <button
                                                className="btn btn-outline-secondary"
                                                type="button"
                                                onClick={handleExpandInput}
                                            >
                                                <FontAwesomeIcon icon={faExpand} />
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            )}

                            {activeSection === 'TestCase' && (
                               <>
                                {!stderr ? (
                                    <form>
                                    <div className="form-group mb-0">
                                        <label htmlFor="output">Output</label>
                                        <div className="input-group">
                                            <textarea
                                                className={`form-control expanding-textarea ${outputExpanded ? 'expanded' : ''}`}
                                                id="output"
                                                value={output}
                                                readOnly
                                                rows={outputExpanded ? "3" : "1"}
                                                aria-label="Output Text"
                                            ></textarea>
                                            <button
                                                className="btn btn-outline-secondary"
                                                type="button"
                                                onClick={handleExpandOutput}
                                            >
                                                <FontAwesomeIcon icon={faExpand} />
                                            </button>
                                        </div>
                                    </div>
                                </form>
                                ):(
                                    <form>
                                    <div className="form-group mb-0">
                                        <label htmlFor="output">Error</label>
                                        <div className="input-group">
                                            <textarea
                                                className={`form-control expanding-textarea ${outputExpanded ? 'expanded' : ''}`}
                                                id="output"
                                                value={stderr}
                                                readOnly
                                                rows={outputExpanded ? "10" : "1"}
                                                aria-label="Output Text"
                                            ></textarea>
                                            <button
                                                className="btn btn-outline-secondary"
                                                type="button"
                                                onClick={handleExpandOutput}
                                            >
                                                <FontAwesomeIcon icon={faExpand} />
                                            </button>
                                        </div>
                                    </div>
                                </form>
                                )}
                                </>
                            )}


                            {activeSection === 'TestResult' && (
                               <>
                               <div>
                                   <h4>Test Result</h4>
                                   <p>{currentTestCase} / {totalTestCases} Test Cases</p>
                           
                                   {currentTestCase === totalTestCases ? (
                                       <p>Successfully Submitted</p>
                                   ) : (
                                       wrongOutput && results.length > 0 && (
                                           <div className="mb-3">
                                               <h6>Test Case {currentTestCase}</h6>
                                               <p>Input: {results[0].input}</p>
                                               <p>Expected Output: {results[0].expectedOutput}</p>
                                               <p>Your Output: {results[0].yourOutput}</p>
                                               <p>Status: Failed</p>
                                           </div>
                                       )
                                   )}
                               </div>
                           </>
                           
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Compiler;
