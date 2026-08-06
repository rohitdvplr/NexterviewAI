import mongoose from "mongoose";

const technicalQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },

    intention: {
      type: String,
      required: true,
    },

    answer: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const behavioralQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },

    intention: {
      type: String,
      required: true,
    },

    answer: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const skillGapSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: true,
    },

    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
    },
  },
  {
    _id: false,
  }
);

const preparationPlanSchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: true,
    },

    focus: {
      type: String,
      required: true,
    },

    task: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);
const resumeAnalysisSchema = new mongoose.Schema(
  {
    atsScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    weaknesses: {
      type: [String],
      required: true,
    },

    missingKeywords: {
      type: [String],
      required: true,
    },

    suggestions: {
      type: [String],
      required: true,
    },
  },
  {
    _id: false,
  }
);

const interviewReportSchema = new mongoose.Schema(
  {
    jobDescription: {
      type: String,
      required: [true, "Job Description required"],
    },

    resume: {
      type: String,
      required: true,
    },

    selfDescription: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },

    matchScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },

    technicalQuestion: {
      type: [technicalQuestionSchema],
      required: true,
    },

    behavioralQuestion: {
      type: [behavioralQuestionSchema],
      required: true,
    },

    skillGaps: {
      type: [skillGapSchema],
      required: true,
    },

    preparationPlan: {
      type: [preparationPlanSchema],
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    
    strengths: {
      type: [String],
      default: [],
    },
    
    overallFeedback: {
      type: String,
      default: "",
    },
    
    resumeAnalysis: {
      type: resumeAnalysisSchema,
      required: true,
    },
  
  },
  
  {
    timestamps: true,
  },
  
);

const interviewReportModel = mongoose.model(
  "InterviewReport",
  interviewReportSchema
);

export default interviewReportModel;
