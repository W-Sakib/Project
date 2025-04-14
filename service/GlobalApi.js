import axios from 'axios';

// Ensure you have the correct environment variables
const API_KEY = import.meta.env.VITE_STRAPI_API_KEY;
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

console.log('BASE_URL:', BASE_URL);

// Create axios client with baseURL and headers
const axiosClient = axios.create({
  baseURL: `${BASE_URL}/api/`,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,  // Make sure this header is correctly set
  },
});

// Define API methods
const CreateNewResume = (data) => axiosClient.post('/user-resumes', data);
const GetUserResumes = (userEmail) => axiosClient.get(`/user-resumes?filters[userEmail][$eq]=${userEmail}`);
const UpdateResumeDetail = (id, data) => axiosClient.put(`/user-resumes/${id}`, data);
const GetResumeById = (id) => axiosClient.get(`/user-resumes/${id}?populate=*`);
const DeleteResumeById = (id) => axiosClient.delete(`/user-resumes/${id}`);

export default {
  CreateNewResume,
  GetUserResumes,
  GetResumeById,
  UpdateResumeDetail,
  DeleteResumeById,
};
