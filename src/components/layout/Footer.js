// src/components/layout/Footer.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="greek-footer">
      {/* Greek meander pattern as top border */}
      <div className="greek-meander-top"></div>
      
      <div className="footer-main">
        <Container>
          <Row>
            <Col md={4} className="footer-column">
              <h4 className="footer-heading">ABOUT HERACLES AUCTIONS</h4>
              <p className="footer-text">
                Founded with the strength and determination of Heracles himself, 
                our auction house connects collectors with the rarest treasures 
                of the modern world.
              </p>
              <div className="footer-social">
                <a href="#" className="social-icon">
                  <i className="fa fa-facebook"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fa fa-twitter"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fa fa-instagram"></i>
                </a>
              </div>
            </Col>
            
            <Col md={4} className="footer-column">
              <h4 className="footer-heading">QUICK LINKS</h4>
              <ul className="footer-links">
                <li><Link to="/">Browse Auctions</Link></li>
                <li><Link to="/how-it-works">How It Works</Link></li>
                <li><Link to="/faq">FAQ</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
              </ul>
            </Col>
            
            <Col md={4} className="footer-column">
              <h4 className="footer-heading">JOIN OUR ODYSSEY</h4>
              <p className="footer-text">
                Subscribe to receive notifications about upcoming auctions and exclusive offers.
              </p>
              <div className="footer-newsletter">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="newsletter-input"
                />
                <button className="newsletter-button">
                  SUBSCRIBE
                </button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      
      <div className="footer-bottom">
        <Container>
          <p className="copyright-text">
            © {new Date().getFullYear()} Heracles Auctions. All rights reserved.
          </p>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;