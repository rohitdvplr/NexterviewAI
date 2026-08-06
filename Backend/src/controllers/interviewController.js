import interviewReportModel from "../model/interviewReportModel.js";
import { PDFParse } from "pdf-parse";
import generateInterviewReport from "../services/aiService.js";
import PDFDocument from "pdfkit";

async function generateInterviewReportController(req, res) {
  try {
    const resumeFile = req.files?.resume?.[0];
    const jobPdf = req.files?.jobPdf?.[0];

    if (!resumeFile) {
      return res.status(400).json({
        message: "Resume PDF is required",
      });
    }

    const { selfDescription } = req.body;

    let finalJobDescription = req.body.jobDescription || "";
    if (jobPdf) {
      const parsedJob = await new PDFParse(
        Uint8Array.from(jobPdf.buffer)
      ).getText();

      finalJobDescription = parsedJob.text;
    }

    if (!finalJobDescription) {
      return res.status(400).json({
        message: "Job Description or Job PDF is required",
      });
    }

    if (!selfDescription) {
      return res.status(400).json({
        message: "Self description is required",
      });
    }

    const resumeContent = await new PDFParse(
      Uint8Array.from(resumeFile.buffer)
    ).getText();  

    const interviewReportByAi = await generateInterviewReport({
      resume: resumeContent.text,
      selfDescription,
      jobDescription: finalJobDescription,
        });
       

    const interviewReport = await interviewReportModel.create({
      user: req.user.id,

      resume: resumeContent.text,
      selfDescription,
      jobDescription: finalJobDescription,
      title: interviewReportByAi.title,

      matchScore: interviewReportByAi.matchScore,

      technicalQuestion: interviewReportByAi.technicalQuestion,

      behavioralQuestion: interviewReportByAi.behavioralQuestion,

      skillGaps: interviewReportByAi.skillGaps,

      preparationPlan: interviewReportByAi.preparationPlan,

      strengths: interviewReportByAi.strengths,

      overallFeedback: interviewReportByAi.overallFeedback,
      resumeAnalysis: interviewReportByAi.resumeAnalysis,
    });

    return res.status(201).json({
      message: "Interview report generated successfully",
      interviewReport,
    });
  } catch (error) {
    console.error("INTERVIEW REPORT ERROR:", error);

    return res.status(500).json({
      message: "Failed to generate interview report",
      error: error.message,
    });
  }
}

async function getInterviewReportByIdController(req, res) {
  const { interviewId } = req.params;

  const interviewReport = await interviewReportModel.findOne({
    _id: interviewId,
    user: req.user.id,
  });

  console.log(JSON.stringify(interviewReport.resumeAnalysis, null, 2));

  res.status(200).json({
    message: "Interview report fetched successfully",
    interviewReport,
  });
}
async function getAllInterviewReportsController(req, res) {
  const interviewReports = await interviewReportModel
    .find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .select(
      "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan"
    );

  res.status(200).json({
    message: "Interview reports fetched successfully.",
    interviewReports,
  });
}
async function generateResumePdfController(req, res) {
  try {
    const { interviewId } = req.params;

    const report = await interviewReportModel.findOne({
      _id: interviewId,
      user: req.user.id,
    });

    if (!report) {
      return res.status(404).json({
        message: "Interview report not found",
      });
    }

    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=AI_Interview_Report.pdf"
    );

    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    // =========================
    // COLORS
    // =========================

    const PRIMARY = "#2563eb";
    const GREEN = "#16a34a";
    const RED = "#dc2626";
    const ORANGE = "#ea580c";
    const DARK = "#111827";
    const GRAY = "#6b7280";
    const LIGHT = "#f3f4f6";

    // =========================
    // HEADER
    // =========================

    doc.fontSize(28).fillColor(PRIMARY).text("AI Interview Report", {
      align: "center",
    });

    doc.moveDown(0.3);

    doc
      .fontSize(18)
      .fillColor(DARK)
      .text(report.title || "Interview Analysis", {
        align: "center",
      });

    doc.moveDown();

    doc
      .strokeColor(PRIMARY)
      .lineWidth(2)
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .stroke();

    doc.moveDown();

    // =========================
    // SUMMARY
    // =========================

    doc.fontSize(20).fillColor(DARK).text("Summary");

    doc.moveDown(0.5);

    doc
      .fontSize(14)
      .fillColor(GRAY)
      .text(
        `Generated On : ${new Date(report.createdAt).toLocaleDateString()}`
      );

    doc.moveDown(0.5);

    doc
      .fontSize(16)
      .fillColor(PRIMARY)
      .text(`Overall Match Score : ${report.matchScore}%`);

    doc.moveDown(1);

    // =========================
    // SKILL GAPS
    // =========================

    doc.fontSize(20).fillColor(DARK).text("Skill Gap Analysis");

    doc.moveDown();

    report.skillGaps.forEach((skill) => {
      let color = GREEN;

      if (skill.severity === "medium") color = ORANGE;

      if (skill.severity === "high") color = RED;

      doc
        .fillColor(color)
        .fontSize(13)
        .text(`• ${skill.skill} (${skill.severity.toUpperCase()})`);
    });

    doc.moveDown();

    // =========================
    // TECHNICAL QUESTIONS
    // =========================

    doc.fontSize(20).fillColor(DARK).text("Technical Interview Questions");

    doc.moveDown();

    report.technicalQuestion.forEach((q, index) => {
      doc
        .fillColor(PRIMARY)
        .fontSize(15)
        .text(`${index + 1}. ${q.question}`);

      doc.moveDown(0.3);

      doc.fillColor(DARK).fontSize(12).text(`Purpose:`);

      doc.fillColor(GRAY).text(q.intention);

      doc.moveDown(0.3);

      doc.fillColor(DARK).text("Ideal Answer:");

      doc.fillColor(GRAY).text(q.answer);

      doc.moveDown();
    });

    doc.addPage();

    // =========================
    // BEHAVIORAL
    // =========================

    doc.fontSize(20).fillColor(DARK).text("Behavioral Interview Questions");

    doc.moveDown();

    report.behavioralQuestion.forEach((q, index) => {
      doc
        .fillColor(PRIMARY)
        .fontSize(15)
        .text(`${index + 1}. ${q.question}`);

      doc.moveDown(0.3);

      doc.fillColor(DARK).fontSize(12).text("Purpose:");

      doc.fillColor(GRAY).text(q.intention);

      doc.moveDown(0.3);

      doc.fillColor(DARK).text("Ideal Answer:");

      doc.fillColor(GRAY).text(q.answer);

      doc.moveDown();
    });

    doc.addPage();

    // =========================
    // ROADMAP
    // =========================

    doc.fontSize(20).fillColor(DARK).text("Preparation Roadmap");

    doc.moveDown();

    report.preparationPlan.forEach((day) => {
      doc.fillColor(PRIMARY).fontSize(15).text(`Day ${day.day}`);

      doc.moveDown(0.2);

      doc.fillColor(DARK).fontSize(13).text(`Focus : ${day.focus}`);

      doc.fillColor(GRAY).fontSize(12).text(day.task);

      doc.moveDown();
    });

    // =========================
    // FOOTER
    // =========================

    doc.moveDown(2);

    doc.strokeColor(LIGHT).moveTo(50, doc.y).lineTo(545, doc.y).stroke();

    doc.moveDown();

    doc
      .fontSize(11)
      .fillColor(GRAY)
      .text(
        "Generated by AI Interview Prep • Personalized Interview Preparation Report",
        {
          align: "center",
        }
      );

    doc.end();
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to generate PDF",
    });
  }
}

export default {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController,
};
