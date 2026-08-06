import React, { useState, useRef, useEffect } from "react";
import "./Home.scss";
import { useInterview } from "../hooks/useInterview";
import { useNavigate } from "react-router";
import {
  FileText,
  User,
  Upload,
  Sparkles,
  History,
} from "lucide-react";

const Home = () => {
  const {
    loading,
    generateReport,
    reports,
    getReports,
  } = useInterview();

  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [jobPdf, setJobPdf] = useState(null);

  const resumeInputRef = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    getReports();
  }, []);

  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current.files[0]  ;
    if (!resumeFile) {
      return alert("Please upload your resume.");
    }
    
    if (!jobDescription.trim() && !jobPdf) {
      return alert("Please provide Job Description or upload JD PDF.");
    }
    
    if (!selfDescription.trim()) {
      return alert("Please enter self description.");
    }
   

    const data = await generateReport({
      jobDescription,
      selfDescription,
      resumeFile,
      jobPdf,
    });

    if (!data) {
      alert("Interview Report generation failed");
      return;
    }

    navigate(`/interview/${data._id}`);
  };

  if (loading) {
    return (
      <main className="loading-screen">
        <h1>Generating your AI Interview Report...</h1>
      </main>
    );
  }

  return (
    <main className="home">

      {/* LEFT SIDE */}

      <div className="left">
      <div className="section-header">
  <h2>
    <FileText size={22} strokeWidth={2} />
    Job Description
  </h2>

  <p>
    Paste the complete Job Description to generate a more accurate
    interview report.
  </p>
</div>

        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          name="jobDescription"
          id="jobDescription"
          placeholder="Paste the Job Description here..."
          disabled={jobPdf !== null}
        />
        <div className="upload-box">
 {jobPdf && (
  <>
    <p className="selected-file">📄 {jobPdf.name}</p>

    <button
      type="button"
      className="remove-pdf"
      onClick={() => setJobPdf(null)}
    >
      Remove PDF
    </button>
  </>
)}
  <label>OR Upload Job Description PDF</label>

  <input
    type="file"
    accept=".pdf"
    onChange={(e) => setJobPdf(e.target.files[0])}
  />
</div>

      </div>

      {/* RIGHT SIDE */}

      <div className="right">

      <div className="section-header">
  <h2>
    <User size={22} strokeWidth={2} />
    Candidate Information
  </h2>

  <p>
    Upload your resume and tell AI a little about yourself.
  </p>
</div>

        {/* Resume */}

        <div className="input-group">

        <label htmlFor="resume">
  <Upload size={18} />
  Resume (PDF)
</label>

          <input
            ref={resumeInputRef}
            type="file"
            id="resume"
            accept=".pdf"
          />

        </div>

        {/* Self Description */}

        <div className="input-group">

          <label htmlFor="selfDescription">
            Self Description

            <p>
              Use Resume + Self Description together for the best AI analysis.
            </p>

          </label>

          <textarea
            value={selfDescription}
            onChange={(e) => setSelfDescription(e.target.value)}
            id="selfDescription"
            placeholder="Example: I'm a MERN Stack Developer passionate about backend development..."
          />

        </div>
        <button
  className="generate-btn"
  onClick={handleGenerateReport}
>
  <Sparkles size={18} />
  Generate Interview Report
</button>

        {/* Previous Reports */}

        <div className="previous-reports">

        <h3>
  <History size={20} />
  Previous Reports
</h3>

          {reports.length === 0 ? (
            <p>No Reports Found</p>
          ) : (
            reports.map((report) => (
              <div
                key={report._id}
                className="report-card"
                onClick={() => navigate(`/interview/${report._id}`)}
              >

                <div className="report-top">

                  <h4>{report.title}</h4>

                  <span>{report.matchScore}%</span>

                </div>

                <small>
                  {new Date(report.createdAt).toLocaleDateString()}
                </small>

              </div>
            ))
          )}

        </div>

      </div>

    </main>
  );
};

export default Home;