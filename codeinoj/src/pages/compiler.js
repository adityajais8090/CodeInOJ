import { useState, useEffect } from 'react';
import '../styles/compiler.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand } from '@fortawesome/free-solid-svg-icons';
import 'codemirror/lib/codemirror.css';
import 'codemirror/lib/codemirror';
import 'codemirror/mode/clike/clike';
import 'codemirror/theme/dracula.css';
import 'codemirror/addon/edit/closebrackets';
import CodeMirror from 'codemirror';

const Compiler = () => {
    const [inputExpanded, setInputExpanded] = useState(false);
    const [outputExpanded, setOutputExpanded] = useState(false);

    useEffect(() => {
        const editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
            mode: "text/x-c++src",
            theme: "dracula",
            lineNumbers: true,
            autoCloseBrackets: true,
        });

        return () => {
            if (editor) {
                editor.toTextArea();
            }
        };
    }, []);

    const handleExpandInput = () => {
        setInputExpanded(!inputExpanded);
    };

    const handleExpandOutput = () => {
        setOutputExpanded(!outputExpanded);
    };

    return (
        <div className="compiler-container ">
            <div className="row no-gutters">
                <div className="col-lg-12 mb-2">
                    <div className="card">
                        <div className="card-body text-start">
                            <form>
                                <div className="form-group">
                                    <div className="col-md-3 mb-2 p-0">
                                        <select className="form-select" id="languageSelect" aria-label="Default select example">
                                            <option value="1">C++</option>
                                            <option value="2">Java</option>
                                            <option value="3">Python</option>
                                        </select>
                                    </div>
                                    <textarea
                                        className="form-control expanding-textarea"
                                        id="editor"
                                        rows="1"
                                        aria-label="Code Editor"
                                    ></textarea>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-lg-12 mb-2">
                    <div className="card">
                        <div className="card-body">
                            <form>
                                <div className="form-group">
                                    <label htmlFor="input">Input</label>
                                    <div className="input-group">
                                        <textarea
                                            className={`form-control expanding-textarea ${inputExpanded ? 'expanded' : ''}`}
                                            id="input"
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
                            <form>
                                <div className="form-group">
                                    <label htmlFor="output">Output</label>
                                    <div className="input-group">
                                        <textarea
                                            className={`form-control expanding-textarea ${outputExpanded ? 'expanded' : ''}`}
                                            id="output"
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Compiler;
