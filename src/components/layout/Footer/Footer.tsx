import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.scss';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__section">
          <h3 className="footer__title">Company</h3>
          <ul className="footer__links">
            <li><Link to="/">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer__section">
          <h3 className="footer__title">Support</h3>
          <ul className="footer__links">
            <li><Link to="/support-form">Help Center</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
          </ul>
        </div>

        <div className="footer__section">
          <h3 className="footer__title">Connect</h3>
          <ul className="footer__links">
            <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
            <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
            <li><a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a></li>
          </ul>
        </div>

        <div className="footer__section">
          <h3 className="footer__title">Newsletter</h3>
          <p className="footer__text">Subscribe to our newsletter for updates and news.</p>
          <form className="footer__form">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="footer__input"
            />
            <button type="submit" className="footer__button">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="footer__bottom">
        <p className="footer__copyright">
          © {new Date().getFullYear()} Your Company. All rights reserved.
        </p>
      </div>
    </footer>
  );
}; 