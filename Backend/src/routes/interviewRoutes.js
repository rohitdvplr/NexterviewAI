import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js"; 
import interviewController from "../controllers/interviewController.js";
import upload from "../middlewares/fileMiddleware.js";


const interviewRouter = express.Router()

interviewRouter.post(
    "/",
    authMiddleware,
    upload.fields([
      {
        name: "resume",
        maxCount: 1,
      },
      {
        name: "jobPdf",
        maxCount: 1,
      },
    ]),
    interviewController.generateInterviewReportController
  );

interviewRouter.get("/report/:interviewId", authMiddleware , interviewController.getInterviewReportByIdController)
interviewRouter.get("/", authMiddleware , interviewController.getAllInterviewReportsController)
interviewRouter.post(
    "/resume/pdf/:interviewId",
    authMiddleware,
    interviewController.generateResumePdfController
)

export default interviewRouter;