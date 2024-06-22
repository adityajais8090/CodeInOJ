import {useState} from 'react';
import '../styles/register.css';
import { uploadData } from '../service/api';
import { useNavigate } from 'react-router-dom';


const Register = () =>{

   const navigate = useNavigate();
   
  const[user, setUser] = useState({
    firstname : "",
    lastname : "",
    email : "",
    password : "",
  });

  const handleInput = (e)=>{
    let name = e.target.name;
    let value = e.target.value;
    
    setUser({
      ...user,
      [name] : value,
    });
  }

  const handleSubmit = async (e) => {
   e.preventDefault();
   console.log(user);
   try {
    const response = await uploadData(user);
    console.log('Response at handleSubmit', response);
    if(response.status == 201){
      return navigate('/');
    }
    
  } catch (err) {
    console.error('Error in handleSubmit', err);
  }
  }

  

  // useEffect((user)=>{
  //   const getData =  async ()=>{
  //     const data = new FormData(user);
  //    const response = await uploadData(data);
  //   };
  //   getData();
  // }, [user]);


    return (
        <>
        <div className="Register">
       <div class="container">
          <div class="row justify-content-center">
            <div class="col-md-8 col-lg-5">
                <div class="center-box bg-light">
      <form>
      <div class="row">
        <div class="col">
        <label for="InputFirstName">First Name</label>
          <input type="text" 
          class="form-control" 
          id="InputFirstName" 
          name="firstname" 
          placeholder="First name"
          value = {user.firstname}
          onChange={handleInput}
          />
          
        </div>


        <div class="col">
        <label for="InputLastName">Last Name</label>
          <input type="text" 
          class="form-control" 
          id="InputLastName" 
           name="lastname" 
           placeholder="Last name"
           value = {user.lastname}
          onChange={handleInput}
           />
        </div>
      </div>
          <div class="form-group">
        <label for="exampleInputEmail1">Email address</label>
        <input type="email" 
        class="form-control" 
        id="exampleInputEmail1"  
        name="email" 
        aria-describedby="emailHelp" 
        placeholder="Enter email" 
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
        name="password" 
        placeholder="Password" 
        value = {user.password}
          onChange={handleInput}
        />
      </div>

      <div class="form-group form-check">
        <input type="checkbox" class="form-check-input" id="exampleCheck1"></input>
        <label class="form-check-label" for="exampleCheck1">Check me out</label>
      </div>
      <button type="submit" class="btn btn-primary" onClick={handleSubmit}>Submit</button>
      </form>
      </div>
      </div>
      </div>
      </div>
    </div>
        </>
    )};
    
    export default Register;