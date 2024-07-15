import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { getProblemSet } from '../service/api';

const ProblemSetModal = ({ show, onHide, onAddProblem }) => {
    const [problems, setProblems] = useState([]);

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const response = await getProblemSet();
                setProblems(response);
            } catch (error) {
               // console.log("Error fetching problems:", error);
            }
        };

        if (show) {
            fetchProblems();
        }
    }, [show]);
    

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Select Problem</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ListGroup>
                    {problems.map(problem => (
                        <ListGroup.Item
                            key={problem._id}
                            action
                            onClick={() => onAddProblem(problem)}
                        >
                            {problem.title}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ProblemSetModal;
