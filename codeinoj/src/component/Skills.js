import React, { useState, useEffect } from 'react';
import { getProblemSet, getSubmission } from '../service/api';
import SkillProgressBar from './SkillProgressBar';
import SpinnerLoader from './SpinnerLoader';

const Skills = ({ user }) => {
  const [submitProblem, setSubmitProblem] = useState([]);
  const [skillsProgress, setSkillsProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProblemSet();
        const problems = response;
        const allSubmissionsResponse = await getSubmission();
        const allSubmissions = allSubmissionsResponse.data.submissions;

        if (allSubmissions.length > 0 && problems.length > 0) {
          const matchedProblems = [];
          const skillsCount = {};

          allSubmissions.forEach((submission) => {
            if (submission.isPassed) {
              const matchedProblem = problems.find(
                (problem) => problem._id === submission.problemId
              );
              if (
                matchedProblem &&
                !matchedProblems.some(
                  (problem) => problem._id === matchedProblem._id
                )
              ) {
                matchedProblems.push(matchedProblem);
              }
            }
          });

          const skills = ['Array', 'String', 'TwoPointer', 'DP', 'Graph'];

          matchedProblems.forEach((problem) => {
            if (problem.tags) {
              problem.tags.forEach((tag) => {
                if (skills.includes(tag)) {
                  skillsCount[tag] = (skillsCount[tag] || 0) + 1;
                }
              });
            }
          });

          const totalSkills = skills.reduce((acc, skill) => {
            const total = problems.filter(
              (problem) => problem.tags && problem.tags.includes(skill)
            ).length;
            return { ...acc, [skill]: total };
          }, {});

          const skillsProgress = skills.reduce((acc, skill) => {
            const achieved = skillsCount[skill] || 0;
            const total = totalSkills[skill] || 1;
            return { ...acc, [skill]: (achieved / total) * 100 };
          }, {});

          setSubmitProblem(matchedProblems);
          setSkillsProgress(skillsProgress);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
    {loading ? <SpinnerLoader /> :
    <div className="card mb-4">
      <div className="card-body mb-md-0">
        <p className="mb-4">
          <span className="text-primary font-italic me-1">Skills</span> Submission Status
        </p>
        {['Array', 'String', 'TwoPointer', 'DP', 'Graph'].map((skill) => (
          <SkillProgressBar
            key={skill}
            skill={skill}
            progress={skillsProgress[skill] || 0}
          />
        ))}
      </div>
    </div>
}
    </div>
  );
};

export default Skills;
