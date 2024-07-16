import '../styles/login.css';
import { useState , useEffect, useContext } from 'react';
import { checkData } from '../service/api';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/auth/authState';
import { SpinnerLoader } from '../component';





const Login = () => {

  const {isLoggedIn, errorl, login} = useAuth();
 const [loading, setLoading ] = useState();
  const [userInput, setUserInput] = useState({
    email: "",
    password: "",
  });


  const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            console.log("login is ",isLoggedIn)
           
            setLoading(false);
            return navigate("/");
        }
    }, [isLoggedIn]);


 

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUserInput({
      ...userInput,
      [name]: value,
    });
  };

  
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
     await login(userInput);

     if(errorl){
      console.log("Error while login", errorl);
     }
  
  } catch (err) {
    console.error('Error:', err);
  }
};


  return (
    <div className="Login">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-5">
            <div className="center-box bg-light">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    placeholder="Enter email"
                    name="email"
                    value={userInput.email}
                    onChange={handleInput}
                  />
                  <small id="emailHelp" className="form-text text-muted">
                    We'll never share your email with anyone else.
                  </small>
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputPassword1">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="exampleInputPassword1"
                    placeholder="Password"
                    name="password"
                    value={userInput.password}
                    onChange={handleInput}
                  />
                </div>
                <div className="form-group form-check">
                  <input type="checkbox" className="form-check-input" id="exampleCheck1"></input>
                  <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
