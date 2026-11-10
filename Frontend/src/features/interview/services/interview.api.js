//communication layer between your React frontend and Express backend.
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

// Generate interview report
export const generateInterviewReport = async ({
    jobDescription,
    selfDescription,
    resumeFile
}) => {

    // FormData is used to send files to the backend
    const formData = new FormData();

    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription);
    formData.append("resume", resumeFile);

    const response = await api.post("/api/interview", formData);

    return response.data;
}

// Get interview report by ID
export const allInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}`);
    return response.data;
}

// Get all interview reports
export const getAllInterviewReport = async () => {
    const response = await api.get("/api/interview");
    return response.data;
}
