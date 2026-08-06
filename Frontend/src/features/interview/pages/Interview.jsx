import React, { useState } from "react";
import "./Interview.scss";
import { useInterview } from "../hooks/useInterview";

const Interview = () => {
  const { report, loading, getResumePdf } = useInterview();

  const [activeTab, setActiveTab] = useState("technical");

  if (loading) {
    return (
      <main className="interview">
        <div className="loading-screen">
          <h1>Generating Interview Report...</h1>
        </div>
      </main>
    );
  }

  if (!report) {
    return (
      <main className="interview">
        <div className="loading-screen">
          <h1>No Interview Report Found</h1>
        </div>
      </main>
    );
  }

  const {
    title,
    matchScore,
    overallFeedback,
    strengths = [],
    technicalQuestion = [],
    behavioralQuestion = [],
    skillGaps = [],
    preparationPlan = [],
    resumeAnalysis = {
      atsScore: 0,
      weaknesses: [],
      missingKeywords: [],
      suggestions: [],
    },
  } = report;

  const {
    atsScore,
    weaknesses,
    missingKeywords,
    suggestions,
  } = resumeAnalysis;

  return (
    <main className="interview">
      <div className="interview-wrapper">

        {/* ================= TOP ================= */}

        <section className="top-section">

          <h1 className="page-title">
            {title || "Interview Preparation Report"}
          </h1>

          <div className="score-card">

            <div className="score-circle">
              <span className="score-value">
                {matchScore}
              </span>

              <span className="score-text">
                Match Score
              </span>
            </div>

            <div className="score-info">
              <p>{overallFeedback}</p>
            </div>

          </div>

        </section>

        {/* ================= BODY ================= */}

        <div className="body-section">

          {/* ================= SIDEBAR ================= */}

          <aside className="sidebar">

            <button
              className={activeTab === "technical" ? "active" : ""}
              onClick={() => setActiveTab("technical")}
            >
              <span>💻</span>
              Technical Questions
              <small>{technicalQuestion.length}</small>
            </button>

            <button
              className={activeTab === "behavioral" ? "active" : ""}
              onClick={() => setActiveTab("behavioral")}
            >
              <span>💬</span>
              Behavioral Questions
              <small>{behavioralQuestion.length}</small>
            </button>

            <button
              className={activeTab === "roadmap" ? "active" : ""}
              onClick={() => setActiveTab("roadmap")}
            >
              <span>🗺️</span>
              Preparation Plan
              <small>{preparationPlan.length}</small>
            </button>

            <button
              className={activeTab === "resume" ? "active" : ""}
              onClick={() => setActiveTab("resume")}
            >
              <span>📄</span>
              Resume Analysis
            </button>

          </aside>

          {/* ================= CONTENT ================= */}

          <section className="content">

            {/* ================= TECHNICAL ================= */}

            {activeTab === "technical" && (
              <>
                <div className="section-title">
                  <h2>Technical Questions</h2>
                </div>

                <div className="question-list">

                  {technicalQuestion.map((item, index) => (
                    <div
                      className="question-card"
                      key={index}
                    >
                      <div className="question-number">
                        {index + 1}
                      </div>

                      <div className="question-body">

                        <h3>{item.question}</h3>

                        <div className="block">
                          <label>Interviewer's Intention</label>
                          <p>{item.intention}</p>
                        </div>

                        <div className="block">
                          <label>Ideal Answer</label>
                          <p>{item.answer}</p>
                        </div>

                      </div>
                    </div>
                  ))}

                </div>

              </>
            )}
                        {/* ================= BEHAVIORAL ================= */}

                        {activeTab === "behavioral" && (
              <>
                <div className="section-title">
                  <h2>Behavioral Questions</h2>
                </div>

                <div className="question-list">
                  {behavioralQuestion.map((item, index) => (
                    <div className="question-card" key={index}>
                      <div className="question-number">
                        {index + 1}
                      </div>

                      <div className="question-body">
                        <h3>{item.question}</h3>

                        <div className="block">
                          <label>Interviewer's Intention</label>
                          <p>{item.intention}</p>
                        </div>

                        <div className="block">
                          <label>Ideal Answer</label>
                          <p>{item.answer}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ================= ROADMAP ================= */}

            {activeTab === "roadmap" && (
              <>
                <div className="section-title">
                  <h2>Preparation Roadmap</h2>
                </div>

                <div className="roadmap">
                  {preparationPlan.map((item, index) => (
                    <div className="roadmap-card" key={index}>
                      <div className="roadmap-day">
                        Day
                        <strong>{item.day}</strong>
                      </div>

                      <div className="roadmap-content">
                        <h3>{item.focus}</h3>
                        <p>{item.task}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ================= RESUME ANALYSIS ================= */}

            {activeTab === "resume" && (
              <>
                <div className="section-title">
                  <h2>Resume Analysis</h2>
                </div>

                <div className="resume-analysis">

                  <div className="ats-card">
                    <h3>ATS Score</h3>

                    <div className="ats-score">
                      <span>{atsScore}%</span>
                    </div>

                    <p className="ats-status">
                      {atsScore >= 80
                        ? "Excellent ATS Compatibility"
                        : atsScore >= 60
                        ? "Good ATS Compatibility"
                        : "Needs Resume Improvement"}
                    </p>
                  </div>

                  <div className="analysis-card">
                    <h3>Resume Weaknesses</h3>

                    <ul>
                      {weaknesses.map((item, index) => (
                        <li key={index}>
                          ⚠️ {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="analysis-card">
                    <h3>Missing ATS Keywords</h3>

                    <div className="keywords">
                      {missingKeywords.map((item, index) => (
                        <span
                          key={index}
                          className="keyword"
                        >
                          #{item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="analysis-card">
                    <h3>Resume Improvement Suggestions</h3>

                    <ul>
                      {suggestions.map((item, index) => (
                        <li key={index}>
                          ✅ {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              </>
            )}

          </section>
                    {/* ================= RIGHT SIDEBAR ================= */}

                    <aside className="right-sidebar">

{/* ================= STRENGTHS ================= */}

<div className="skills-card">

  <h2>Strengths</h2>

  <div className="skills">
    {strengths.map((item, index) => (
      <div
        key={index}
        className="skill strength"
      >
        <span>✅ {item}</span>
      </div>
    ))}
  </div>

</div>

{/* ================= SKILL GAPS ================= */}

<div className="skills-card">

  <h2>Skill Gaps</h2>

  <div className="skills">

    {skillGaps.map((item, index) => (
      <div
        key={index}
        className={`skill ${item.severity}`}
      >
        <div>
          <span>{item.skill}</span>
        </div>

        <small>
          {item.severity === "high" && "🔴 High Priority"}
          {item.severity === "medium" && "🟡 Medium Priority"}
          {item.severity === "low" && "🟢 Low Priority"}
        </small>

      </div>
    ))}

  </div>

</div>

{/* ================= DOWNLOAD ================= */}

<button
  className="download-btn"
  onClick={() => getResumePdf(report._id)}
>
  📄 Download as PDF
</button>

</aside>

</div>

</div>

</main>
);
};

export default Interview;