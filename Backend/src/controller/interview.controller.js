const generateInterviewReport = require("../services/ai.services")
const interviewReportModel = require("../model/interviewReport.model")
const pdfParse = require("pdf-parse")


async function generateInterviewReportController(req, res){
    // fetch the resume pdf, selfDescription jobDescription from frontend

    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
    const { selfDescription, jobDescription} = req.body

    const interviewReportAi = await generateInterviewReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    })

    console.log(
    JSON.stringify(interviewReportAi, null, 2));
    const interviewReport = await interviewReportModel.create({
        user: req.user.id, //only logged in user
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        ...interviewReportAi
    })
    res.status(201).json({
        message: "Interview report generated successfully",
        interviewReport
    })
}
async function interviewReportByIdController(req, res) {
    const {interviewId} = req.params
    const interviewReport = await interviewReportModel.findOne({_id: interviewId, user: req.user.id})

    if(!interviewReport){
        return res.status(404).json({
            message: "Interview report not found"
        })
    }
    return res.status(200).json({
        message: "Interview report fetched successfully",
        interviewReport
    });
}

async function getAllInterviewReportController(req, res) {
    const interviewReports = await interviewReportModel
        .find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behaviourQuestions -skillGaps -preparationPlan");

    return res.status(200).json({
        message: "Interview report fetched successfully",
        interviewReports
    });
}

module.exports = {
    generateInterviewReportController,
    interviewReportByIdController,
    getAllInterviewReportController
};
