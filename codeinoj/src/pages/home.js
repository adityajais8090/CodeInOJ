import '../styles/home.css';
//import { delUser } from '../service/api';
//import { useNavigate } from 'react-router-dom';

const Home = () =>{

  // const navigate = useNavigate();

  // const handleSubmit = async (e)=>{
  //   e.preventDefault();
  //   try{
  //      const response = await delUser();
  //      console.log(response);
  //      if (response.success) {
  //       alert("Logged out successfully!");
  //       return navigate ('/login');
  //   }
  //   }catch(err){
  //     console.error("Error in handle Logout" + err);
  //   }
  // }

return (
    <>
    <div className="Home">
       <div class="container">
          <div class="row justify-content-center">
            <div class="col-md-8 col-lg-5">
                <div class="center-box bg-light">
            Welcome To Home !
            </div>
            <div class="center-box bg-light">
            <button class="btn btn-info btn-lg">
          <span class="glyphicon glyphicon-log-out"></span> Profile
         </button>
      </div>
      </div>
      </div>
      </div>
    </div>
    
    
    </>
)};

export default Home;
