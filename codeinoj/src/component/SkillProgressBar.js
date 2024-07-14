import React from 'react';


const SkillProgressBar = ({ skill, progress }) => {
 

  return (
    
        <div>
          <p className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>{skill}</p>
          <div className="progress rounded" style={{ height: '5px' }}>
            <div className="progress-bar" role="progressbar" style={{ width: `${progress}%` }} aria-valuenow={progress}
              aria-valuemin="0" aria-valuemax="100"></div>
          </div>
        </div>
      
  );
};

export default SkillProgressBar;
