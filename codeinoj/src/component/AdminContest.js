import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import '../styles/AdminContest.css';
import { createContest, getAllContest, addProblemContest } from '../service/api';
import ProblemSetModal from './ProblemSetModal';

const AdminContest = () => {
    const [showContestModal, setShowContestModal] = useState(false);
    const [showProblemModal, setShowProblemModal] = useState(false);
    const [selectedContestCode, setSelectedContestCode] = useState(null);
    const [selectedTableIndex, setSelectedTableIndex] = useState(null);
    const [allContest, setAllContest] = useState([]);
    const [contestData, setContestData] = useState({
        title: '',
        contestCode: '',
        startTime: '',
        endTime: '',
        duration: '',
    });
    

    const handleShowContestModal = () => setShowContestModal(true);
    const handleCloseContestModal = () => setShowContestModal(false);
    const handleShowProblemModal = (contestCode, tableIndex) => {
        setSelectedContestCode(contestCode);
        setSelectedTableIndex(tableIndex);
        setShowProblemModal(true);
    };
    const handleCloseProblemModal = () => setShowProblemModal(false);

    const handleChangeContest = (e) => {
        const { name, value } = e.target;
        setContestData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddContest = async () => {
        try {
            const response = await createContest(contestData);
            //console.log('Adding contest:', response);
            setContestData({
                title: '',
                contestCode: '',
                startTime: '',
                endTime: '',
                duration: '',
            });
            handleCloseContestModal();
        } catch (error) {
            console.error('Error adding contest:', error);
        }
    };

    const fetchData = async () => {
        try {
            const response = await getAllContest();
           // console.log("Here is my get contest:", response.data);
            setAllContest(response.data);
        } catch (error) {
           // console.log("Error in fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddProblem = async (problemData, selectedContestCode) => {
        try {
            const payload = {
                contestCode : selectedContestCode,
                problemCode : problemData.code,
            }
            //console.log(`Adding problem to selected table ${selectedTableIndex}:`, payload);
            // Add API call to add problem to the contest
            const response = await addProblemContest(payload);
           // console.log("Get response after add problem in contest : ", response);
            if(response.success){
                fetchData();
            }
        } catch (error) {
            console.error('Error adding problem:', error);
        }
    };

    const handleDeleteProblem = () => {
   try{

   }catch{

   }
    };

    return (
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
                                <button className="btn btn-primary" onClick={handleShowContestModal}>
                                    <FontAwesomeIcon icon={faPlus} /> Add Contest
                                </button>
                            </div>
                        </div>
                        <div className="contest-list mt-4">
                  {allContest.map(contest => (
                        <div key={contest._id} className="contest-item card mb-3">
                            <div className="card-body">
                                <h3 className="card-title">{contest.title}</h3>
                                <p className="card-text">Code: {contest.contestCode}</p>
                                <p className="card-text">Start Time: {new Date(contest.startTime).toLocaleString()}</p>
                                <p className="card-text">End Time: {new Date(contest.endTime).toLocaleString()}</p>
                                <p className="card-text">Duration: {contest.duration} minutes</p>
                                <div className="contest-tables">
                                    {[1, 2, 3, 4].map((tableIndex) => (
                                        <div key={tableIndex} className="contest-table mb-3">
                                            <h4>Table {tableIndex}</h4>
                                            {/* Render added problems */}
                                            {contest.problemId && contest.problemId[tableIndex - 1] ? (
                                                <div className="added-problem">
                                                    <p>{contest.problemId[tableIndex - 1]}</p>
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => handleDeleteProblem(contest.contestCode, tableIndex)}
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} /> Delete Problem
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button
                                                    variant="secondary"
                                                    onClick={() => handleShowProblemModal(contest.contestCode, tableIndex)}
                                                >
                                                    <FontAwesomeIcon icon={faPlus} /> Add Problem
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}


                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showContestModal} onHide={handleCloseContestModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Contest</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formContestTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={contestData.title}
                                onChange={handleChangeContest}
                            />
                        </Form.Group>
                        <Form.Group controlId="formContestCode">
                            <Form.Label>Contest Code</Form.Label>
                            <Form.Control
                                type="number"
                                name="contestCode"
                                value={contestData.contestCode}
                                onChange={handleChangeContest}
                            />
                        </Form.Group>
                        <Form.Group controlId="formStartTime">
                            <Form.Label>Start Time</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                name="startTime"
                                value={contestData.startTime}
                                onChange={handleChangeContest}
                            />
                        </Form.Group>
                        <Form.Group controlId="formEndTime">
                            <Form.Label>End Time</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                name="endTime"
                                value={contestData.endTime}
                                onChange={handleChangeContest}
                            />
                        </Form.Group>
                        <Form.Group controlId="formDuration">
                            <Form.Label>Duration</Form.Label>
                            <Form.Control
                                type="text"
                                name="duration"
                                value={contestData.duration}
                                onChange={handleChangeContest}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseContestModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAddContest}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            <ProblemSetModal
                show={showProblemModal}
                onHide={handleCloseProblemModal}
                onAddProblem={(problemData) => handleAddProblem(problemData, selectedContestCode)}
                    />

        </div>
    );
};

export default AdminContest;
