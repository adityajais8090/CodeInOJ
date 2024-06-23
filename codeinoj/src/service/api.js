import axios from 'axios';

// backend server
const API_URL = 'http://localhost:8000';

// post register json data to backend
export const uploadData = async (data) => {
    try {
        //store the response
        const response = await axios.post(`${API_URL}/register`, JSON.stringify(data), {
            headers: {
                "Content-Type": "application/json",
            },
        });
         console.log(response.data);
        return response;
    } catch (err) {
        console.error("Error in Uploading form Data: " + err.response.data);
    }
}

// post login json data to backend
export const checkData = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/login`, JSON.stringify(data), {
            headers: {
                "Content-Type": "application/json",
            },
        });

        return response.data;
    } catch (err) {
        console.error("Error in Upload Login data: " + err);
       
    }
}

export const getProfile = async (cookie) =>{
 try{
    console.log(cookie);
    const response = await axios.get(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${cookie}` // Assuming cookie contains the token
        }
      });
    return response.data;
 }catch(err){
    console.log("Error in getting profile", err);
 }
}


