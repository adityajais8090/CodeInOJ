import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Profile from './profile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenNib, faPlus } from '@fortawesome/free-solid-svg-icons';
import { getProblemSet, uploadProblem, deleteProblem, updateProblem, getTestCases } from '../service/api';

const Admin = () => {
  const [problems, setProblems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // State to track if modal is in edit mode
  const [activeSection, setActiveSection] = useState('dashboard');
  const [problem, setProblem] = useState({
    code: "",
    title: "",
    description: "",
    tags: [""],
    input: "",
    output: ""
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

    // For tags, split the comma-separated string into an array of tags
    if (name === 'tags') {
      const tagsArray = value.split(',').map(tag => tag.trim());
      setProblem({
        ...problem,
        [name]: tagsArray,
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
      const response = await uploadProblem(problem);
      console.log('Response at handleSubmit', response);
      if (response.status === 201) {
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
      tags: [""],
      input: "",
      output: ""
    });
  };

  const handleShow = (problemData = null) => {
    setShowModal(true);
    if (problemData) {
      setIsEditing(true);
      setProblem(problemData);
      
    } else {
      setIsEditing(false);
      setProblem({
        code: "",
        title: "",
        description: "",
        tags: [""],
        input: "",
        output: ""
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
                        <div className="row">
                          <div className="col">
                            <div><h1>Hello, JS</h1></div>
                          </div>
                          <div className="col-auto">
                            <button className="btn btn-primary" onClick={() => handleShow()}>
                              <FontAwesomeIcon icon={faPlus} /> Add Problem
                            </button>
                          </div>
                        </div>

                        <div className="row custom-row-style">
                          <div className="col-6 col-md-2 p-3 text-center">
                            Statistics
                          </div>
                          <div className="col-6 col-md-6 p-3">
                            Title
                          </div>
                          <div className="col-6 col-md-2 p-3">
                            Add TestCases
                          </div>
                          <div className="col-6 col-md-2 p-3">
                            Delete
                          </div>
                        </div>

                        <div className="table">
                          {problems.map((prob, index) => (
                            <div key={index} className={`row custom-row-style ${index % 2 === 0 ? 'even-row' : 'odd-row'}`}>
                              <div className="col-6 col-md-2 p-3 text-center">
                                {prob.status || "0%"}
                              </div>
                              <div className="col-6 col-md-6 p-3">
                                {`${prob.code}. ${prob.title}`}
                              </div>
                              <div className="col-6 col-md-2 p-3">
                                <button className="btn btn-primary" onClick={() => handleShow(prob)}>
                                  <FontAwesomeIcon icon={faPenNib} />
                                </button>
                              </div>
                              <div className="col-6 col-md-2 p-3">
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
            <Form.Group controlId="code">
              <Form.Label>Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter problem code"
                name="code"
                value={problem.code}
                onChange={handleInput}
                readOnly={isEditing}
              />
            </Form.Group>

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

            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              <Form.Control
                  type="text"
                  placeholder="Enter tags (comma-separated)"
                  name="tags"
                  value={problem.tags.join(', ')} // Join tags array into a comma-separated string
                  onChange={handleInput}
                />
              </Form.Group>

              <Form.Group controlId="input">
                <Form.Label>Input</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter input details"
                  name="input"
                  value={problem.input}
                  onChange={handleInput}
                />
              </Form.Group>

              <Form.Group controlId="output">
                <Form.Label>Output</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter expected output"
                  name="output"
                  value={problem.output}
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
