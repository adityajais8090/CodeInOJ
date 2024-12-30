import React, { useState, useEffect } from 'react';
import '../styles/home.css';
import {ContestCard , SpinnerLoader} from '../component'
import { getAllContest } from '../service/api';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const Home = () => {
  const [allContest, setAllContest] = useState([]);
  const [ loading, setLoading ] = useState(true);

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
    setLoading(false);
  }, []);

  const calculateDaysLeft = (startTime) => {
    const currentDate = new Date();
    const startDate = new Date(startTime);
    const timeDiff = startDate - currentDate;
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysLeft;
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Number of cards to show in one row
    slidesToScroll: 1,
    autoplay: true, // Enable autoplay
    autoplaySpeed: 2500, // Set the speed to 3 seconds (3000 milliseconds)
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
    ],
  };
  

  return (
    <>
    <div style={{ justifyContent: "space-evenly", alignItems: "center", background: "white", height: "90vh" }} className='d-flex'>
      <div>
        <div style={{ background: "#B1AFFF", padding: "30px 40px", borderRadius: "6px 6px 500px 6px" }}>
          <h1 style={{ fontWeight: "700", fontSize: "50px" }}>Start Your Coding</h1>
          <h1 style={{ fontWeight: "700", color: "white" }}>Journey</h1>
        </div>
        <div style={{ fontSize: "30px", fontWeight: "500", marginTop: "50px", display: "flex", justifyContent: "center", alignItems: "center" }}>
          Participate now
          <img style={{ marginLeft: "20px", width: "15%" }} src={require('../images/icon.png')} alt='img' />
        </div>
      </div>
      <img style={{ width: "40%" }} src={require("../images/home.png")} alt='img' />
    </div>

    {loading ? <SpinnerLoader /> : (
      <div className="container mb-3">
        <div className="row">
        <div style={{ textAlign: "left", marginBottom: "20px", padding: "30px 40px", borderRadius: "6px" }}>
      <h2 style={{ fontWeight: "700", fontSize: "40px", color: "#333", margin: "0" }}>Upcoming Contests</h2>
      <p style={{ fontSize: "18px", color: "#666", margin: "10px 0 0" }}>Join our latest coding contests and improve your skills!</p>
    </div>
          <Slider {...settings}>
            {allContest.map((contest, index) => (
              <div key={index}>
                <ContestCard
                  iconClass="bx bxl-mailchimp" // Example icon class, you can change this based on your requirements
                  contestType="Contest"
                  daysLeft={calculateDaysLeft(contest.startTime)}
                  rating="0" // Set the initial rating or pass the actual rating if available
                  title={contest.title}
                  contestCode={contest.contestCode}
                  progress={0} // Set initial progress
                  applied={0} // Initial participant count
                  capacity={contest.capacity} // Assuming 'capacity' is part of your contest data
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    )}
  </>
  );
};

export default Home;
