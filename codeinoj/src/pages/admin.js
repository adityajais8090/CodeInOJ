import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Profile from './profile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenNib, faPlus } from '@fortawesome/free-solid-svg-icons';
import { getProblemSet, uploadProblem, deleteProblem, updateProblem, getTestCases} from '../service/api';

const Admin = () => {
  const [problems, setProblems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // State to track if modal is in edit mode
  const [activeSection, setActiveSection] = useState('dashboard');
  const [problem, setProblem] = useState({
    code: "",
    title: "",
    description: "",
    constraints : [""],
    tags: [""],
    input1: "",
    output1: "",
    input2: "",
    output2: "",
  });
 

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getProblemSet();
      setProblems(response);
    } catch (error) {
      console.error('Error fetching problems:', error);
    }
  };


  const handleDashboard = () => {
    setActiveSection('dashboard');
  };

  const handleProfile = () => {
    setActiveSection('profile');
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
  
    // For tags and constraints, split the comma-separated string into an array
    if (name === 'tags' || name === 'constraints') {
      const valuesArray = value.split(',').map(item => item.trim());
      setProblem({
        ...problem,
        [name]: valuesArray,
      });
    } else {
      setProblem({
        ...problem,
        [name]: value,
      });
    }
  };
  
  const handleAddProblem = async (e) => {
    e.preventDefault();
    try {
      const p_response = await uploadProblem(problem);
      console.log('Response at handleSubmit', p_response);
      if (p_response.status === 201) {
        setShowModal(false);
        fetchData(); // Reload problems after successful addition
      }
    } catch (err) {
      console.error('Error in handleSubmit', err);
    }
  };

  const handleDelProblem = async (code, event) => {
    event.preventDefault();
    try {
      const response = await deleteProblem({ code });
      console.log('Response at handleDelProblem', response);
      if (response.status === 200) {
        console.log('Problem deleted successfully:', response.data);
        fetchData(); // Reload problems after successful deletion
      } else {
        console.log('Failed to delete problem:', response.data);
      }
    } catch (err) {
      console.error('Error in deleteProblem:', err);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setIsEditing(false); // Reset edit mode when closing modal
    setProblem({
      code: "",
      title: "",
      description: "",
      constraints : [""],
      tags: [""],
      input1: "",
      output1: "",
      input2: "",
      output2: "",
    });
  };

  const handleShow = async (problemData = null) => {
    setShowModal(true);
    if (problemData) {
      const get_testcase = await getTestCases(problemData.code);
      if(get_testcase.success){
        console.log("Here is my 2 testcases :" , get_testcase);
        setIsEditing(true);
      setProblem({
        code: problemData.code,
        title: problemData.title,
        description: problemData.description,
        constraints : problemData.constraints,
        tags: problemData.tags,
        input1: get_testcase.testcases[0].input,
        output1: get_testcase.testcases[0].output,
        input2: get_testcase.testcases[1].input,
        output2: get_testcase.testcases[1].output,
      });
      }
      
    } else {
      setIsEditing(false);
      setProblem({
        code: "",
        title: "",
        description: "",
        constraints : [""],
        tags: [""],
        input1: "",
        output1: "",
        input2: "",
        output2: "",
      });
    }
  };

  const handleUpdateProblem = async () => {
    try {
        console.log("PROBLEM : ", problem);
      const response = await updateProblem(problem);
      console.log('Response at handleUpdateProblem', response);
      if (response.status === 200) {
        setShowModal(false);
        fetchData(); // Reload problems after successful update
      } else {
        console.log('Failed to update problem:', response.data);
      }
    } catch (err) {
      console.error('Error in updateProblem:', err);
    }
  };

  const handleAddtest = async () => {
    try{

    }catch(err){
      console.log(err).send("Error in adding test cases")
    }
  };
  

  

  return (
    <>
      <div className="container-fluid">
        <div className="row content">
          <div className="col-sm-3 sidenav">
            <h4>Admin</h4>
            <div className="p-3">
              <button className="btn btn-link" onClick={handleDashboard} style={{ textDecoration: 'none', color: 'inherit' }}>
                Dashboard
              </button>
            </div>
            <div className="p-3">
              <button className="btn btn-link" onClick={handleProfile} style={{ textDecoration: 'none', color: 'inherit' }}>
                Profile
              </button>
            </div>
          </div>

          <div className="col-sm-9">
            {activeSection === 'dashboard' && (
              <>
                <div className="container-fluid">
  <div className="row content">
    <div className="col-sm-12">
      <h4><small>Dashboard</small></h4>
      <hr />
      <div className="user-dashboard">
        <div className="row align-items-center">
          <div className="col">
            <h1>Hello, JS</h1>
          </div>
          <div className="col-auto">
            <button className="btn btn-primary" onClick={() => handleShow()}>
              <FontAwesomeIcon icon={faPlus} /> Add Problem
            </button>
          </div>
        </div>

        <div className="row custom-row-style">
          <div className="col-4 col-md-2 p-3 text-center">
            Statistics
          </div>
          <div className="col-4 col-md-4 p-3">
            Title
          </div>
          <div className="col-4 col-md-2 p-3">
            Update
          </div>
          <div className="col-4 col-md-2 p-3">
            Add
          </div>
          <div className="col-4 col-md-2 p-3">
            Delete
          </div>
        </div>

        <div className="table">
          {problems.map((prob, index) => (
            <div key={index} className={`row custom-row-style ${index % 2 === 0 ? 'even-row' : 'odd-row'}`}>
              <div className="col-4 col-md-2 p-3 text-center">
                {prob.status || "0%"}
              </div>
              <div className="col-4 col-md-4 p-3">
                {`${prob.code}. ${prob.title}`}
              </div>
              <div className="col-4 col-md-2 p-3">
                <button className="btn btn-primary" onClick={() => handleShow(prob)}>
                  <FontAwesomeIcon icon={faPenNib} />
                </button>
              </div>
              <div className="col-4 col-md-2 p-3">
                <button className="btn btn-primary" onClick={() => handleAddtest(prob)}>
                  <FontAwesomeIcon icon={faPenNib} />
                </button>
              </div>
              <div className="col-4 col-md-2 p-3">
                <button className="btn btn-primary" onClick={(event) => handleDelProblem(prob.code, event)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</div>

                <footer className="container-fluid">
                  <p>Footer Text</p>
                </footer>
              </>
            )}

            {activeSection === 'profile' && (  
           <Profile/>  
            )}
          </div>
        </div>
      </div>


      {/* Add/Edit Problem Modal */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit Problem' : 'Add Problem'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            { isEditing && (<Form.Group controlId="code">
              <Form.Label>Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter problem code"
                name="code"
                value={problem.code}
                onChange={handleInput}
                readOnly={isEditing}
              />
            </Form.Group>)}

            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                name="title"
                value={problem.title}
                onChange={handleInput}
              />
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter description"
                name="description"
                value={problem.description}
                onChange={handleInput}
              />
            </Form.Group>

            <Form.Group controlId="constraints">
              <Form.Label>Constraints</Form.Label>
              <Form.Control
                  type="text"
                  placeholder="Enter constraints (comma-separated)"
                  name="constraints"
                  value={problem.constraints} // Join constraints array into a comma-separated string
                  onChange={handleInput}
                />
              </Form.Group>

            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              <Form.Control
                  type="text"
                  placeholder="Enter tags (comma-separated)"
                  name="tags"
                  value={problem.tags} // Join tags array into a comma-separated string
                  onChange={handleInput}
                />
              </Form.Group>

              <Form.Group controlId="input1">
                <Form.Label>Case-I Input</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter input details"
                  name="input1"
                  value={problem.input1}
                  onChange={handleInput}
                />
              </Form.Group>

              <Form.Group controlId="output1">
                <Form.Label>Case-I Output</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter expected output"
                  name="output1"
                  value={problem.output1}
                  onChange={handleInput}
                />
              </Form.Group>

              <Form.Group controlId="input2">
                <Form.Label>Case-II Input</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter expected output"
                  name="input2"
                  value={problem.input2}
                  onChange={handleInput}
                />
              </Form.Group>

              <Form.Group controlId="output2">
                <Form.Label>Case-II Output</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter expected output"
                  name="output2"
                  value={problem.output2}
                  onChange={handleInput}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            {isEditing ? (
              <Button variant="primary" onClick={handleUpdateProblem}>
                Update Problem
              </Button>
            ) : (
              <Button variant="primary" onClick={handleAddProblem}>
                Add Problem
              </Button>
            )}
          </Modal.Footer>
        </Modal>

        {/* Profile Content */}
        <div className="container-fluid">
          <div className="row content">
            <div className="col-sm-9">
              {activeSection === 'profile' && (
                <div style={{ backgroundColor: '#eee' }}>
                  <div className="container py-5">
                    {/* Profile section content */}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <footer className="container-fluid">
          <p>Footer Text</p>
        </footer>
      </>
    );
};

export default Admin;
