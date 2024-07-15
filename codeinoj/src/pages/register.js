import { useState } from 'react';
import '../styles/register.css';
import { uploadData } from '../service/api';
import { useNavigate } from 'react-router-dom';
import SpinnerLoader from '../component/SpinnerLoader';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    role: "",
  });

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setUser({
      ...user,
      [name]: value,
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
   // console.log(user);
    try {
      const response = await uploadData(user);
    //  console.log('Response at handleSubmit', response);
      if (response.status === 201) {
        setLoading(false);
        return navigate('/');
      }
    } catch (err) {
      console.error('Error in handleSubmit', err);
      setLoading(false); // Stop loading in case of an error
    }
  }

  return (
    <>
      <div className="Register">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-5">
              <div className="center-box bg-light">
                <form>
                  <div className="row">
                    <div className="col">
                      <label htmlFor="InputFirstName">First Name</label>
                      <input type="text"
                        className="form-control"
                        id="InputFirstName"
                        name="firstname"
                        placeholder="First name"
                        value={user.firstname}
                        onChange={handleInput}
                      />
                    </div>
                    <div className="col">
                      <label htmlFor="InputLastName">Last Name</label>
                      <input type="text"
                        className="form-control"
                        id="InputLastName"
                        name="lastname"
                        placeholder="Last name"
                        value={user.lastname}
                        onChange={handleInput}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <input type="email"
                      className="form-control"
                      id="exampleInputEmail1"
                      name="email"
                      aria-describedby="emailHelp"
                      placeholder="Enter email"
                      value={user.email}
                      onChange={handleInput}
                    />
                    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                  </div>
                  <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input type="password"
                      className="form-control"
                      id="exampleInputPassword1"
                      name="password"
                      placeholder="Password"
                      value={user.password}
                      onChange={handleInput}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="exampleInputRole">Role</label>
                    <select
                      className="form-control"
                      id="exampleInputRole"
                      name="role"
                      value={user.role}
                      onChange={handleInput}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="form-group form-check">
                    <input type="checkbox" className="form-check-input" id="exampleCheck1"></input>
                    <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
                  </div>
                  <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
                </form>
                {loading && <SpinnerLoader />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
};

export default Register;
