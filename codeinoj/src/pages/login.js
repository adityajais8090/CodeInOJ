import '../styles/login.css';
import { useState } from 'react';
import { checkData } from '../service/api';
import { useNavigate } from 'react-router-dom';



const Login = () =>{

  const navigate = useNavigate();

  // setUser based on schema
  const [user,setUser] = useState({
    email : "",
    password : "",
  })

  //handle input change and update setUser
  const handleInput = (e)=>{
    let name = e.target.name;
    let value = e.target.value;

    setUser({
      ...user,
      [name] : value,
    });
  }
   
  // handle form submit and call api 
  const handleSubmit = async (e) =>{
    e.preventDefault();
    console.log(user);
    try {
      const response = await checkData(user);
      console.log('Response:', response);
      if(response.success === true){
        return navigate('/');
      }
      // Handle the response here 
    } catch (err) {
      console.error('Error:', err);
    }
  }


    return (
      // login page
        <>
        <div className="Login">
       <div class="container">
          <div class="row justify-content-center">
            <div class="col-md-8 col-lg-5">
                <div class="center-box bg-light">
      <form>
          <div class="form-group">
        <label for="exampleInputEmail1">Email address</label>
        <input type="email" 
        class="form-control" 
        id="exampleInputEmail1" 
        aria-describedby="emailHelp" 
        placeholder="Enter email" 
        name="email"
        value = {user.email}
        onChange={handleInput}
        />

        <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
      </div>

      <div class="form-group">
        <label for="exampleInputPassword1">Password</label>
        <input type="password" 
        class="form-control" 
        id="exampleInputPassword1" 
        placeholder="Password" 
        name="password"
        value = {user.password}
        onChange={handleInput}
        />
      </div>

      <div class="form-group form-check">
        <input type="checkbox" class="form-check-input" id="exampleCheck1"></input>
        <label class="form-check-label" for="exampleCheck1">Check me out</label>
      </div>
      <button type="submit" class="btn btn-primary" onClick={handleSubmit}>Login</button>
      </form>
      </div>
      </div>
      </div>
      </div>
    </div>
        </>
    )};
    
    export default Login;