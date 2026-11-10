const mongoose = require('mongoose')

const technicalQuestionSchema = new mongoose.Schema({
        question:{
            type:String,
            required: [true, "Question is required"]
        },
        intention:{
            type: String,
            required:[true, "Intention is required"]
        },
        answer:{
            type:String,
            required:[true, "Answers is required"]
        }
}, {
    _id: false//do not need of id
})
const behaviourQuestionSchema = new mongoose.Schema({
    question:{
            type:String,
            required: [true, "Question is required"]
        },
        intention:{
            type: String,
            required:[true, "Intention is required"]
        },
        answer:{
            type:String,
            required:[true, "Answers is required"]
    }
},{
    _id:false
})
const skillGapSchema = new mongoose.Schema({
    skills:{
        type:String,
        required: [true, "Skills are required"]
    },
    severity:{
        type:String,
        enum: ["low", "medium", "high"],
        required: [true, "Severity is required"]
    }

}, {
    _id:false
})
const preparationPlanSchema = new mongoose.Schema({
    days:{
        type:Number,
        required:[true, "days are required"]
    },
    focus:{
        type:String,
        required:[true, "focus is required"]
    },
    tasks:[{
        type:String,
        required: [true, "Tasks is required"]
    }]

})


const interviewReportSchema = new mongoose.Schema({
    jobDescription:{
        type: String,
        required: [true,"Job description is required"]

    },
    resume:{
        type:String,
    },
    selfDescription:{
        type: String,
        required: [true, "self Description is require"]
    },
    matchScore:{
        type:Number,
        min: 0,
        max: 100
    },
    technicalQuestions: [technicalQuestionSchema],
    behaviourQuestions: [behaviourQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationPlan:[preparationPlanSchema],
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    title:{
        type:String,
        required:[true, "job title is required"]
    }
}, {
    timestamps: true
})

const interviewReportModel = mongoose.model("InterviewReport", interviewReportSchema)

module.exports = interviewReportModel