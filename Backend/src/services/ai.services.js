const { GoogleGenAI } = require("@google/genai");
const {z} = require("zod")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GEMINI_API_KEY
});

const  interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 to 100 indicating  how well the candidates profile matches the job  description"),

    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question that can be asked in the interview"),
        intention: z.string().describe("The intention  of the interview behind  asking this question"),
        answer : z.string().describe("How to answer this question, what point to cover, what approch to take etc etc.")
    })).describe("Technical question that can be asked in the interview along with their intention and how to answer them"),

    behaviourQuestions: z.array(z.object({
        question: z.string().describe("The behaviour question that can be asked in the interview"),
        intention: z.string().describe("The intention  of the interview behind  asking this question"),
        answer : z.string().describe("How to answer this question, what point to cover, what approch to take etc etc.")
    })).describe("Behaviour question that can be asked in the interview along with their intention and how to answer them"),
    

    skillGaps: z.array(z.object({
        skills: z.string().describe("Which skills is the candidate is lagging"),
        severity: z.enum(["low", "medium", "high"]).describe("Severity of the skill gap")
    })).describe("List of skills gap the candidate have along with there severity"),

    preparationPlan: z.array(z.object({
        days: z.number().describe("the number of day in the preparation plan, starting from 1"),
        focus:z.string().describe("the main focus of this day in the preparation plan example: data structure, mock interview"),
        tasks: z.array(z.string()).describe("List of the last to be done on this day to follow the preparation plan, example: read a specific book")
    })).describe("A day wise preparation plan for the candidate to follow in order to prepare for the interview efffectively "),
    title: z.string().describe("The title of the job for which the interview report is generated ")

})
const { $schema, ...reportJsonSchema } = z.toJSONSchema(interviewReportSchema);

async function generateInterviewReport({resume, selfDescription, jobDescription}){
    
    const prompt = `
    You are an expert technical interviewer and career preparation assistant.

    Your task is to generate a personalized JOB INTERVIEW PREPARATION REPORT.

    IMPORTANT:
    - This is a preparation report, NOT an evaluation of a completed interview.
    - Do not generate candidate ratings, hiring recommendations, interviewer names, or interview dates.
    - Analyze the candidate's resume against the given job description.
    - Identify skills the candidate already possesses and skills they are missing.
    - Generate questions relevant to the specific job description.
    - Do not generate generic questions unrelated to the target role.
    - Base answers on the candidate's actual experience.
    - Never invent projects, skills, achievements, or work experience.

    Generate the following:

    1. matchScore:
    Give a score between 0 and 100 based on how well the candidate
    matches the job description.

    2. technicalQuestions:
    Generate at least 5 technical interview questions relevant
    to the target job.
    Include the intention behind each question and a detailed
    explanation of how the candidate should answer it.

    3. behaviourQuestions:
    Generate at least 5 behavioural interview questions.
    Include the interviewer's intention and suggested answer
    approaches using the candidate's real experiences.

    4. skillGaps:
    Identify missing or weak skills required by the job description.
    Assign each gap a severity: low, medium, or high.
    Do not classify a skill as missing if the resume demonstrates it.

    5. preparationPlan:
    Create a practical 7-day preparation plan.
    Each day must have a specific focus and at least 2 actionable tasks.

    CANDIDATE RESUME:
    ${resume}

    CANDIDATE SELF DESCRIPTION:
    ${selfDescription}

    TARGET JOB DESCRIPTION:
    ${jobDescription}
    `;


    let response;

    for (let attempt = 1; attempt <= 4; attempt++) {
        try {
            response = await ai.models.generateContent({
                model: "gemini-3.5-flash-lite",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseJsonSchema: reportJsonSchema
                }
            });

            break;

        } catch (error) {
            if (![503, 429, 500, 502].includes(error.status) || attempt === 4) {
                throw error;
            }

            const delay = 5000 * (2 ** (attempt - 1));

            console.log(`Gemini error ${error.status}. Retrying in ${delay / 1000}s...`);

            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    // Convert JSON string into JavaScript object
    const parsedResponse = JSON.parse(response.text);

    // Validate response structure
    const validatedResponse = interviewReportSchema.parse(parsedResponse);

    return validatedResponse;
}

module.exports = generateInterviewReport