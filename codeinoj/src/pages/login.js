import '../styles/login.css';
import { useState , useContext } from 'react';
import { checkData } from '../service/api';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/user/userContext';



const Login = () => {
  const { fetchUserProfile } = useContext(UserContext);
 
 const navigate = useNavigate();
  const [userInput, setUserInput] = useState({
    email: "",
    password: "",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUserInput({
      ...userInput,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await checkData(userInput);
      if (response.success) {
        console.log("Checkers :", response.existUser);
     fetchUserProfile();
        navigate('/');
      } else {
        console.error('Login failed:', response.message);
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
