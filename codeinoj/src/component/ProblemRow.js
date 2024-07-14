import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenNib } from '@fortawesome/free-solid-svg-icons';

const ProblemRow = ({ prob, handleShow, handleDelProblem, handleAddtest, index }) => {
  return (
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
  );
};

export default ProblemRow;
