import axios from 'axios';





const API_URL = process.env.REACT_APP_BACKEND;
const COMPILE_API_URL = process.env.REACT_APP_COMPILE;




// post register json data to backend
export const uploadData = async (data) => {
    try {
        //store the response
        const response = await axios.post(`${API_URL}/register`, data , {
          withCredentials : true,
            headers: {
                "Content-Type": "application/json",
            },
        });
         
        return response;
    } catch (err) {
       // console.error("Error in Uploading form Data: " + err.response.data);
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
    //console.log("Response getAdmin api : ", response.data);
    return response.data;
 }catch(err){
   // console.log("Error in getting admin", err);
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
    // console.log("Response getProfile api : ", response.data);
     return response.data;
  }catch(err){
    // console.log("Error in getting profile", err);
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
    //console.log("Response:", response);
    const problems = Array.isArray(response.data) ? response.data : Object.values(response.data);
    return problems;
  } catch (err) {
   // console.log("Error in getting problemSet api:", err);
    return []; // Return an empty array in case of error
  }
};

export const getProblems = async (ObjectId) => {
  try {
    const response = await axios.get(`${API_URL}/problemset/problem`, {
      params: { id: ObjectId },
      withCredentials: true, // Ensure credentials are sent with the request if needed
      headers: {
        "Content-Type": "application/json",
      },
    });

   // console.log("Response from getProblems:", response.data);
    return response.data.existProblem;
  } catch (error) {
   // console.error("Error in getting problems:", error);
    throw error; // Rethrow the error to handle it further up the call chain
  }
};

export const getTestCases = async(code) => {
    try{
      const response = await axios.get(`${API_URL}/problemset/problem/testcases`, {
        params: { code },
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
     // console.log("Here is my response data : ", response.data);
      return response.data;
    }catch(err){
     // console.log("Error in getting testcases", err);
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
     // console.error("Error in Uploading form Data: " + err.response.data);
      return err;
  }
  }

  export const updateProblem = async(data) => {
    try{
     // console.log("Data in api", data);
      const response = await axios.post(`${API_URL}/problem/edit`, data , {
        withCredentials: true,
          headers: {
              "Content-Type": "application/json",
          },
      });
       
      return response;

    }catch(err){
      //console.error("Error in Updating form Data: " + err.response.data);
      return err;
    }
  }
  

  export const deleteProblem = async (data) => {
      try {
          // Store the response
        //  console.log("Data in api : " , data);
          const response = await axios.delete(`${API_URL}/problemset/problem/delete`, {
              data: data,
              withCredentials: true,
              headers: {
                  "Content-Type": "application/json",
              },
          });
          return response;
      } catch (err) {
         // console.error("Error in deleting the problem: " + err.response.data);
          return err;
      }
  }

  export const runOutput = async (payload) => {
    try {
      const { data } = await axios.post(`${COMPILE_API_URL}/run`, payload, {
          headers: {
              "Content-Type": "application/json",
          },
      });
      return data;
  } catch (error) {
     // console.log(error.response);
      throw error.response;
  }
  }


  export const postSubmissions = async (submitload) => {
    try {
        const response = await axios.post(`${API_URL}/submit`, submitload, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response;
    } catch (error) {
       // console.log("Axios error:", error);
        throw error; // Re-throw the error to handle it in the calling function
    }
}

 export const getSubmission = async (user) => {
  try{
    const response = await axios.post(`${API_URL}/getallSubmit`, user , {
      withCredentials: true,
      headers: {
          "Content-Type": "application/json",
      },
  });
  return response;
  }catch(error){
   // console.log("Axios getSubmission :", error);
    throw error;
  }
 }

 export const getAllSubmissions = async (user) => {
  try{
    const response = await axios.post(`${API_URL}/all/submissions`, user , {
      withCredentials: true,
      headers: {
          "Content-Type": "application/json",
      },
  });
 // console.log( "ALL Submission Response : ", response);
    return response.data;
  }catch(error){
  //  console.log("Axios getAllSubmission :", error);
    throw error;
  }
 }


  export const getSubmitResult = async(payload1) => {
    try{
      const { data } = await axios.post(`${COMPILE_API_URL}/submit`, payload1, {
        headers: {
            "Content-Type": "application/json",
        },
    });
   // console.log("here is api data :", data);
    return data;

    }catch(error){
     // console.log("Error is from api submit : " , error.response);
      throw error.response;
    }
  }

  export const createContest = async(contestData) => {
    try{
      const response = await axios.post(`${API_URL}/create/contest`, contestData , {
        withCredentials: true,
          headers: {
              "Content-Type": "application/json",
          },
      });
      return response.data;
    }catch(error){
     // console.log("Error in createContest : " , error);
    }
  }

  export const getAllContest = async () => {
    try{
      const response = await axios.get(`${API_URL}/contests/contest`, {
        withCredentials: true,
          headers: {
              "Content-Type": "application/json",
          },
      });
      return response.data;

    }catch(error){
     // console.log("Error in get all Contest : " , error);
    }
  }

  export const addProblemContest = async (payload) => {
    try {
        const response = await axios.post(`${API_URL}/update/contest`, payload, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
      //  console.error("Error adding problem in contest:", error);
        throw error; // Optionally, throw the error for handling in the calling code
    }
};


export const sendRatings = async(payload) => {
  try{
    const response = await axios.post(`${API_URL}/contest/complete`, payload, {
      withCredentials: true,
      headers: {
          "Content-Type": "application/json",
      },
    })
     return response;
  }catch(error){
   // console.error("Error adding rating in contest:", error);
        throw error; // Optionally, throw the error for handling in the calling code
  }
}

  


