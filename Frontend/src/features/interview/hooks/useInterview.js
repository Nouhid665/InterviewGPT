//CUSTOM HOOK for managing the interview
import { getAllInterviewReport, generateInterviewReport, allInterviewReportById } from "../services/interview.api"
import { useContext } from "react"
import { InterviewContext } from "../interview.context"

export const useInterview = () => {
    const context = useContext(InterviewContext) // access and manage data from context

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        try {
            const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            console.log('generate response:', response) // check the real shape here
            setReport(response.interviewReport)
            return response.interviewReport
        } catch (error) {
            console.log(error)
            throw error // let the page show the error message
        } finally {
            setLoading(false)
        }
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        try {
            const response = await allInterviewReportById(interviewId)
            setReport(response.interviewReport)
            return response.interviewReport
        } catch (error) {
            console.log(error)
            setReport(null)
            return null
        } finally {
            setLoading(false)
        }
    }

    const getReport = async () => {
        setLoading(true)
        try {
            const response = await getAllInterviewReport()
            setReports(response.interviewReports || response.interviewReport || [])
            return response.interviewReports || response.interviewReport || []
        } catch (error) {
            console.log(error)
            return []
        } finally {
            setLoading(false)
        }
    }

    return { loading, report, reports, generateReport, getReportById, getReport }
}