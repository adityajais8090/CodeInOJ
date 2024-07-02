import axios from 'axios';

// backend server
const API_URL = 'http://localhost:8000';

// post register json data to backend
export const uploadData = async (data) => {
    try {
        //store the response
        const response = await axios.post(`${API_URL}/register`, data , {
            headers: {
                "Content-Type": "application/json",
            },
        });
         
        return response;
    } catch (err) {
        console.error("Error in Uploading form Data: " + err.response.data);
    }
}

// post login json data to backend
export const checkData = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/login`, data , {
            withCredentials : true,
            headers: {
                "Content-Type": "application/json",
            },
        });
        console.log("here is my response data : ", response.data);
       
        return response.data;
    } catch (err) {
        console.error("Error in Upload Login data: " + err);
       
    }
}

export const delSession = async () => {
  try{
    const response = await axios.delete(`${API_URL}/logout`, {
      withCredentials : true,
      headers: {
          "Content-Type": "application/json",
      },
  } );
  console.log(response);
  return response.data;
  }catch(err){
    console.log("Error in deleting Session :", err);
    return err;
  }
}

export const getAdmin = async () => {
 try{
const response = await axios.get(`${API_URL}/admin`,{
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
    });
    console.log("Response getAdmin api : ", response.data);
    return response.data;
 }catch(err){
    console.log("Error in getting admin", err);
    return { success: false, message: 'Failed to fetch admin', Error : err };
 }
}

export const getProfile = async () => {
  try{
 const response = await axios.get(`${API_URL}/profile`,{
     withCredentials: true,
     headers: {
       "Content-Type": "application/json",
     },
     });
     console.log("Response getProfile api : ", response.data);
     return response.data;
  }catch(err){
     console.log("Error in getting profile", err);
     return { success: false, message: 'Failed to fetch profile', Error : err };
  }
 }

export const getProblemSet = async () => {
  try {
    const response = await axios.get(`${API_URL}/problemset`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Response:", response);
    const problems = Array.isArray(response.data) ? response.data : Object.values(response.data);
    return problems;
  } catch (err) {
    console.log("Error in getting problemSet api:", err);
    return []; // Return an empty array in case of error
  }
};

export const getProblems = async (code) => {
    try {
      const response = await axios.get(`${API_URL}/problemset/problem`, {
        params: { code },
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      console.log("Response from getProblems :", response.data);
      return response.data;
    } catch (err) {
      console.log("Error in getting problems", err);
      return err;
    }
  }

export const getTestCases = async(code) => {
    try{
      const response = await axios.get(`${API_URL}/problemset/problem/testcases`, {
        params: { code },
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Here is my response data : ", response.data);
      return response.data;
    }catch(err){
      console.log("Error in getting testcases", err);
      return err;
    }
  }

  export const uploadProblem = async (data) => {
    try {
      //store the response
      const response = await axios.post(`${API_URL}/profile/add`, data , {
        withCredentials: true,
          headers: {
              "Content-Type": "application/json",
          },
      });
       
      return response;
  } catch (err) {
      console.error("Error in Uploading form Data: " + err.response.data);
      return err;
  }
  }

  export const updateProblem = async(data) => {
    try{
      console.log("Data in api", data);
      const response = await axios.post(`${API_URL}/problem/edit`, data , {
        withCredentials: true,
          headers: {
              "Content-Type": "application/json",
          },
      });
       
      return response;

    }catch(err){
      console.error("Error in Updating form Data: " + err.response.data);
      return err;
    }
  }
  

  export const deleteProblem = async (data) => {
      try {
          // Store the response
          console.log("Data in api : " , data);
          const response = await axios.delete(`${API_URL}/problemset/problem/delete`, {
              data: data,
              withCredentials: true,
              headers: {
                  "Content-Type": "application/json",
              },
          });
          return response;
      } catch (err) {
          console.error("Error in deleting the problem: " + err.response.data);
          return err;
      }
  }

  export const runOutput = async (payload) => {
    try {
      const { data } = await axios.post('http://localhost:5000/run', payload, {
          headers: {
              "Content-Type": "application/json",
          },
      });
      return data;
  } catch (error) {
      console.log(error.response);
  }
  }
  


