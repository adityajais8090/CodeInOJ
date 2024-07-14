import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ProblemFormModal = ({ showModal, handleClose, handleInput, handleAddProblem, handleUpdateProblem, isEditing, problem }) => {
  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? 'Edit Problem' : 'Add Problem'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {isEditing && (
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
          )}

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
              value={problem.constraints.join(', ')}
              onChange={handleInput}
            />
          </Form.Group>

          <Form.Group controlId="tags">
            <Form.Label>Tags</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter tags (comma-separated)"
              name="tags"
              value={problem.tags.join(', ')}
              onChange={handleInput}
            />
          </Form.Group>

          <Form.Group controlId="timelimit">
            <Form.Label>Time Constraints</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter timelimit"
              name="timelimit"
              value={problem.timelimit}
              onChange={handleInput}
            />
          </Form.Group>

          <Form.Group controlId="memorylimit">
            <Form.Label>Memory Constraints</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter memory limit"
              name="memorylimit"
              value={problem.memorylimit}
              onChange={handleInput}
            />
          </Form.Group>

          <Form.Group controlId="difficulty">
            <Form.Label>Difficulty</Form.Label>
            <Form.Control
              type="text"
              placeholder="easy/medium/hard"
              name="difficulty"
              value={problem.difficulty}
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
  );
};

export default ProblemFormModal;
