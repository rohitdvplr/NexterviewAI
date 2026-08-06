import "./footer.scss";

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-left">
          <h2>AI Interview Prep</h2>

          <p>
            Prepare smarter with AI-generated interview questions,
            personalized preparation plans, and resume analysis.
          </p>
        </div>

        <div className="footer-center">
          <h3>Quick Links</h3>

          <a href="/">Home</a>
          <a href="/">Generate Report</a>
          <a href="/">Previous Reports</a>
        </div>

        <div className="footer-right">
          <h3>Developer</h3>

          <a
            href="https://github.com/rohitdvplr"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>

          <a
            href="https://www.linkedin.com/in/rohitttgupta/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>

          <p>Made by Rohit Gupta</p>
        </div>

      </div>

      <div className="footer-bottom">
        © 2026 AI Interview Prep • All Rights Reserved.
      </div>

    </footer>
  );
};

export default Footer;