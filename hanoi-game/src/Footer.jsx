import { FaCode, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <span>© {new Date().getFullYear()}</span>

      <span className="footer-divider">/</span>

      <span className="footer-dev">
        <FaCode className="footer-icon" />
        Developed by
        {'\u00A0'}
        <a
          href="https://linkedin.com/in/kishore-e-241369279"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          Kishore
        </a>
      </span>

      <span className="footer-divider">/</span>

      <a
        href="https://github.com/Kishore-Krish19/TowersOfHanoi"
        target="_blank"
        rel="noopener noreferrer"
        className="footer-link"
      >
        <FaGithub className="footer-icon" />
        View Source
      </a>
    </footer>
  );
}
