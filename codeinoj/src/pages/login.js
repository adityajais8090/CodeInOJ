import '../styles/login.css';
import { useState , useEffect, useContext } from 'react';
import { uploadData } from '../service/api';
import { checkData } from '../service/api';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/auth/authState';
import { SpinnerLoader } from '../component';



 const Login = () => {
 const navigate = useNavigate();
 const {isLoggedIn, errorl, login} = useAuth();
 const [loading, setLoading ] = useState(false);
 const [isRegisterActive, setIsRegisterActive] = useState(false);


 //Register
 const [user, setUser] = useState({
  firstname: "",
  lastname: "",
  email: "",
  password: "",
  role : "",
 });

 //Login
 const [userInput, setUserInput] = useState({
  email: "",
  password: "",
});


 const handleRegisterInput = (e) => {
  let name = e.target.name;
  let value = e.target.value;
  //console.log(`Updating field: ${name}, Value: ${value}`);
  setUser({
    ...user,
    [name]: value,
    role : "user",
  });
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
     //console.log("User is here : ", user);
    try {
      const response = await uploadData(user);
    //console.log('Response at handleSubmit', response);
      if (response.status === 201) {
        setLoading(false);
        setIsRegisterActive(false);
        return navigate('/login');
      }
    } catch (err) {
      console.error('Error in handleSubmit', err);
      setLoading(false); // Stop loading in case of an error
    }
  }

  

    useEffect(() => {
        if (isLoggedIn) {
            console.log("login is ",isLoggedIn)
           
            setLoading(false);
            return navigate("/");
        }
    }, [isLoggedIn]);


 

  const handleLoginInput = (e) => {
    const { name, value } = e.target;
    setUserInput({
      ...userInput,
      [name]: value,
    });
  };

  
const handleLoginSubmit = async (e) => {
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

    const handleRegisterClick = () => {
      setIsRegisterActive(true);
    };

    const handleLoginClick = () => {
      setIsRegisterActive(false);
    };


  return (
    <div class = "UserPage">
    
    <div className={`container-login ${isRegisterActive ? 'active' : ''}`} id="container-login">

    <div class="form-container-login sign-up">
            <form>
                <h1>Create Account</h1>
                <div class="social-icons">
                    <a href="#" class="icon"><i class="fa-brands fa-google-plus-g"></i></a>
                    <a href="#" class="icon"><i class="fa-brands fa-facebook-f"></i></a>
                    <a href="#" class="icon"><i class="fa-brands fa-github"></i></a>
                    <a href="#" class="icon"><i class="fa-brands fa-linkedin-in"></i></a>
                </div>
                <span>or use your email for registeration</span>
                <div className="row row-login" >
                <div className="col col-login" >
                <input type="text" 
                 name="firstname"
                 placeholder="First name*"
                 value={user.firstname}
                 onChange={handleRegisterInput} />
                 </div>
                 <div className="col col-login">
                <input type="text" 
                name="lastname"
                placeholder="Last name*"
                value={user.lastname}
                onChange={handleRegisterInput} />
                </div>
                </div>

                <input type="email" 
                placeholder="Email*"
                name="email"
                value={user.email}
                onChange={handleRegisterInput} />

                <input type="password" 
                placeholder="Password*" 
                name="password"
                value={user.password}
                onChange={handleRegisterInput}/>
                
                <button type="submit" onClick={handleRegisterSubmit}>Sign Up</button>
            </form>
            {loading && <SpinnerLoader />}
        </div>

      <div class="form-container-login sign-in">
            
            <form>
                <h1>Sign In</h1>
                <div class="social-icons">
                    <a href="#" class="icon"><i class="fa-brands fa-google-plus-g"></i></a>
                    <a href="#" class="icon"><i class="fa-brands fa-facebook-f"></i></a>
                    <a href="#" class="icon"><i class="fa-brands fa-github"></i></a>
                    <a href="#" class="icon"><i class="fa-brands fa-linkedin-in"></i></a>
                </div>
                <span>or use your email password</span>

                <input type="email" 
                placeholder="Email*"
                name="email"
                value={userInput.email}
                onChange={handleLoginInput} />

                <input type="password" 
                placeholder="Password*"
                name="password"
                value={userInput.password}
                onChange={handleLoginInput} />

                <button type="submit" onClick={handleLoginSubmit}>Sign In</button>
            </form>
        </div>

        <div class="toggle-container-login">
            <div class="toggle">
                <div class="toggle-panel toggle-left">
                    <h1>Welcome Back!</h1>
                    <p>Enter your personal details to use all of site features</p>
                    <button class="hidden" id="login" onClick={handleLoginClick}>Sign In</button>
                </div>
                <div class="toggle-panel toggle-right">
                    <h1>Hello, Friend!</h1>
                    <p>Register with your personal details to use all of site features</p>
                    <button class="hidden" id="register" onClick={handleRegisterClick}>Sign Up</button>
                </div>
            </div>
        </div>
    </div>
    </div>
                  
  );
};

export default Login;
