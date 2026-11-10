const express = require("express")
const authMiddleware = require("../middleware/auth.middleware")
const interviewController = require("../controller/interview.controller")
const upload = require("../middleware/file.middleware")


const interviewRouter = express.Router() 

/**
 * POST/api/interview
 * Generate new interview repot on the bases of user self des, resume pdf, and job des
 */
interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterviewReportController)

/**
 * GET/api/interview/report/:interviewId
 * get interview report by id
 */
interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.interviewReportByIdController)

/**
 * GET/api/interview/
 * get all interview report of logged in user
 */
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportController)

module.exports = interviewRouter