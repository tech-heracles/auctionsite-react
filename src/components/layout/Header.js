import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import AuctionService from '../../services/auction.service';
import './Header.css'; // We'll create this CSS file for our Greek styling

const Header = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [balance, setBalance] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // Add this to track location changes

  // This useEffect will run on component mount and when location changes
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      fetchBalance();
    }
  }, [location]); // Add location as a dependency to refresh when navigation occurs

  const fetchBalance = async () => {
    try {
      const balance = await AuctionService.getUserBalance();
      setBalance(balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
    navigate('/login');
  };

  return (
    <div className="header-wrapper">
      {/* Greek meander pattern as top border */}
      <div className="greek-meander-top"></div>
      
      <Navbar expand="lg" className="greek-navbar">
        <Container>
          {/* Logo with Greek styling */}
          <Navbar.Brand as={Link} to="/" className="greek-brand">
            <span className="greek-logo-icon">⚡</span> {/* Zeus's lightning bolt */}
            HERACLES AUCTIONS
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="greek-toggler" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto greek-nav">
              <Nav.Link as={Link} to="/" className="greek-nav-link">AGORA</Nav.Link> {/* Greek marketplace */}
              {currentUser && (
                <>
                  <Nav.Link as={Link} to="/auctions/create" className="greek-nav-link">FORGE AUCTION</Nav.Link>
                  <Nav.Link as={Link} to="/my-auctions" className="greek-nav-link">MY TREASURES</Nav.Link>
                  <Nav.Link as={Link} to="/my-bids" className="greek-nav-link">MY OFFERINGS</Nav.Link>
                </>
              )}
            </Nav>
            
            <Nav className="greek-nav-right">
              {currentUser ? (
                <>
                  <Navbar.Text className="me-3 greek-balance">
                    <span className="balance-icon">🏺</span> {/* Greek amphora for currency */}
                    <span className="balance-text">${balance !== null ? balance.toFixed(2) : '...'}</span>
                  </Navbar.Text>
                  <Navbar.Text className="me-3 greek-user">
                    <span className="user-prefix">HERO:</span> 
                       <Button 
                           as={Link} 
                             to="/profile" 
                              variant="link" 
                             className="greek-username-link p-0"
                          >
                        {currentUser.username}
                        </Button>
                  </Navbar.Text>
                  <Button variant="outline-light" onClick={logOut} className="greek-logout-btn">DEPART</Button>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login" className="greek-nav-link greek-auth-link">ENTER</Nav.Link>
                  <Nav.Link as={Link} to="/register" className="greek-nav-link greek-auth-link">JOIN THE PANTHEON</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
      {/* Greek meander pattern as bottom border */}
      <div className="greek-meander-bottom"></div>
    </div>
  );
};

export default Header;