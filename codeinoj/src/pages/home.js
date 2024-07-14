import React, { useState, useEffect } from 'react';
import '../styles/home.css';
import {ContestCard , SpinnerLoader} from '../component'
import { getAllContest } from '../service/api';

const Home = () => {
  const [allContest, setAllContest] = useState([]);
  const [ loading, setLoading ] = useState(true);

  const fetchData = async () => {
    try {
        const response = await getAllContest();
        console.log("Here is my get contest:", response.data);
        setAllContest(response.data);
    } catch (error) {
        console.log("Error in fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    setLoading(false);
  }, []);

  const calculateDaysLeft = (startTime) => {
    const currentDate = new Date();
    const startDate = new Date(startTime);
    const timeDiff = startDate - currentDate;
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysLeft;
  };

  return (
    <>
    {loading ? <SpinnerLoader/> :
      <div className="container mt-5 mb-3">
        <div className="row">
          {allContest.map((contest, index) => (
            <ContestCard
              key={index}
              iconClass="bx bxl-mailchimp" // Example icon class, you can change this based on your requirements
              contestType="Contest"
              daysLeft={calculateDaysLeft(contest.startTime)}
              rating="0" // Set the initial rating or pass the actual rating if available
              title={contest.title}
              contestCode = {contest.contestCode}
              progress={0} // Set initial progress
              applied={0} // Initial participant count
              capacity={contest.capacity} // Assuming 'capacity' is part of your contest data
            />
          ))}
        </div>
      </div>
}
    </>
  );
};

export default Home;
