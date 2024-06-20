import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
       <div class="container">
          <div class="row justify-content-center">
            <div class="col-md-8 col-lg-5">
                <div class="center-box bg-light">
      <form>
      <div class="row">
        <div class="col">
        <label for="InputFirstName">First Name</label>
          <input type="text" class="form-control" id="InputFirstName" placeholder="First name"></input>
        </div>
        <div class="col">
        <label for="InputLastName">Last Name</label>
          <input type="text" class="form-control" id="InputLastName" placeholder="Last name"></input>
        </div>
      </div>
          <div class="form-group">
        <label for="exampleInputEmail1">Email address</label>
        <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"></input>
        <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Password</label>
        <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password"></input>
      </div>
      <div class="form-group form-check">
        <input type="checkbox" class="form-check-input" id="exampleCheck1"></input>
        <label class="form-check-label" for="exampleCheck1">Check me out</label>
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
      </form>
      </div>
      </div>
      </div>
      </div>
    </div>
  );
}

export default App;
