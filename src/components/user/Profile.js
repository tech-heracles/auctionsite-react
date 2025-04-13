import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import AuctionService from '../../services/auction.service';
import AuthService from '../../services/auth.service';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      fetchBalance();
    }
  }, []);

  const fetchBalance = async () => {
    try {
      const balance = await AuctionService.getUserBalance();
      setBalance(balance);
      setLoading(false);
    } catch (error) {
      setError('Failed to load your balance');
      setLoading(false);
      console.error('Error fetching balance:', error);
    }
  };

  if (loading) {
    return (
      <div className="olympus-loading">
        <div className="loading-column"></div>
        <div className="loading-text">Reading your fate from the stars...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="olympus-error">
        <span className="error-icon">⚡</span>
        <div className="error-text">Zeus's thunder has disrupted our connection</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="olympus-error">
        <span className="error-icon">🏺</span>
        <div className="error-text">Your legend has yet to be written</div>
      </div>
    );
  }

  return (
    <Container className="mt-4">
      <div className="hero-profile-header">
        <div className="meander-line"></div>
        <h2 className="olympus-title">YOUR HERO'S CHRONICLE</h2>
        <div className="meander-line"></div>
      </div>
      
      <div className="hero-profile-container">
        <div className="profile-hero-image">
          <div className="hero-laurel"></div>
          <div className="hero-icon">
            {user.username.charAt(0).toUpperCase()}
          </div>
        </div>
        
        <div className="hero-details-container">
          <div className="hero-details-card">
            <div className="card-header">
              <span className="header-icon">📜</span>
              <h3 className="header-title">HERO'S IDENTITY</h3>
            </div>
            
            <div className="card-body">
              <div className="detail-item">
                <div className="detail-label">Heroic Name:</div>
                <div className="detail-value">{user.username}</div>
              </div>
              
              <div className="detail-item">
                <div className="detail-label">Message Scroll:</div>
                <div className="detail-value email">{user.email}</div>
              </div>
              
              <div className="detail-item treasury">
                <div className="detail-label">Treasury Balance:</div>
                <div className="detail-value balance">
                  {balance !== null ? balance.toFixed(2) : '...'} <span className="drachma">₯</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="hero-stats-card">
            <div className="card-header">
              <span className="header-icon">⚔️</span>
              <h3 className="header-title">LEGENDARY FEATS</h3>
            </div>
            
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon">🛒</div>
                <div className="stat-value">0</div>
                <div className="stat-label">Auctions Created</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon">🏆</div>
                <div className="stat-value">0</div>
                <div className="stat-label">Auctions Won</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon">📊</div>
                <div className="stat-value">0</div>
                <div className="stat-label">Active Bids</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon">⚱️</div>
                <div className="stat-value">0</div>
                <div className="stat-label">Treasures Collected</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Profile;