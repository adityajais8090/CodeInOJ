import { useState, useEffect } from 'react';
import '../styles/compiler.css';
import { runOutput, getTestCases } from '../service/api';
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
            let results = [];

            for (let i = 0; i < existTestcase.length; i++) {
                const input = existTestcase[i].input;
                const payload = {
                    language: 'cpp',
                    code,
                    input,
                };

                try {
                    const response = await runOutput(payload);
                    const output = response.output;
                    results.push({
                        input: existTestcase[i].input,
                        output: existTestcase[i].output,
                        yourOutput: output,
                        success: output === existTestcase[i].output,
                    });
                } catch (err) {
                    console.log("Error executing test case:", err);
                    results.push({
                        input: existTestcase[i].input,
                        output: existTestcase[i].output,
                        yourOutput: "Error",
                        success: false,
                    });
                }

                setResults([...results]); // Update results state with each test case
                setCurrentTestCase(i + 1); // Update current test case count
            }

            console.log("All test cases completed.");
        } catch (err) {
            console.log("Error fetching test cases:", err);
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
            setOutput(response.output);
        } catch (err) {
            console.log("Error running code:", err);
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
                            )}
                            {activeSection === 'TestResult' && (
                                <div>
                                    <h4>Test Result</h4>
                                    <p>{currentTestCase} / {totalTestCases} Test Cases</p>
                                    {results.map((result, index) => (
                                        <div key={index} className="mb-3">
                                            <h6>Test Case {index + 1}</h6>
                                            <p>Input: {result.input}</p>
                                            <p>Expected Output: {result.output}</p>
                                            <p>Your Output: {result.yourOutput}</p>
                                            <p>Status: {result.success ? 'Passed' : 'Failed'}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Compiler;
