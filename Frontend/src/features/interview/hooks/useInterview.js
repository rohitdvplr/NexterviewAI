import {
    getAllInterviewReports,
    generateInterviewReport,
    getInterviewReportById,
    generateResumePdf,
  } from "../services/interviewApi.js";
  import { useContext, useEffect } from "react";
  import { InterviewContext } from "../interviewContext.jsx";
  import { useParams } from "react-router";
  
  export const useInterview = () => {
    const context = useContext(InterviewContext);
    const { interviewId } = useParams();
  
    if (!context) {
      throw new Error("useInterview must be used within an InterviewProvider");
    }
  
    const {
      loading,
      setLoading,
      report,
      setReport,
      reports,
      setReports,
    } = context;
  
    const generateReport = async ({
      jobDescription,
      selfDescription,
      resumeFile,
      jobPdf
    }) => {
      setLoading(true);
  
      try {
        const response = await generateInterviewReport({
          jobDescription,
          selfDescription,
          resumeFile,
          jobPdf
        });
  
        setReport(response.interviewReport);
        return response.interviewReport;
      } catch (error) {
        console.log(error);
        return null;
      } finally {
        setLoading(false);
      }
    };
  
    const getReportById = async (id) => {
      setLoading(true);
  
      try {
        const response = await getInterviewReportById(id);
  
        setReport(response.interviewReport);
        return response.interviewReport;
      } catch (error) {
        console.log(error);
        return null;
      } finally {
        setLoading(false);
      }
    };
  
    const getReports = async () => {
      setLoading(true);
  
      try {
        const response = await getAllInterviewReports();
  
        setReports(response.interviewReports);
        return response.interviewReports;
      } catch (error) {
        console.log(error);
        return [];
      } finally {
        setLoading(false);
      }
    };

    const getResumePdf = async (interviewReportId) => {
      const blob = await generateResumePdf({
          interviewReportId,
      });
  
      const url = window.URL.createObjectURL(blob);
  
      const a = document.createElement("a");
  
      a.href = url;
      a.download = "Interview_Report.pdf";
      a.click();
  
      window.URL.revokeObjectURL(url);
  };
  
    useEffect(() => {
      if (interviewId) {
        getReportById(interviewId);
      } else {
        getReports();
      }
    }, [interviewId]);
  
    return {
      loading,
      report,
      reports,
      generateReport,
      getReportById,
      getReports,
      getResumePdf,
    };
  };