import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import AuctionService from '../../services/auction.service';
import { AuctionListFilters } from '../../models/AuctionListFilters';
import AuthService from '../../services/auth.service';
import AddFundsButton from './AddFundsButton';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [auctionsCreated, setAuctionsCreated] = useState(0);
  const [auctionsWon, setAuctionsWon] = useState(0);
  const [activeBids, setActiveBids] = useState(0);
  const [treasuresCollected, setTreasuresCollected] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState(new AuctionListFilters());

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      const [myAuctions, allAuctions, balanceData, myBids] = await Promise.all([
        AuctionService.getMyAuctions(),
        AuctionService.getActiveAuctions(filters),
        AuctionService.getUserBalance(),
        AuctionService.getMyBids()
      ]);
      
      setBalance(balanceData);
      
      setAuctionsCreated(myAuctions.length || 0);
      
      const wonAuctions = myBids.filter(bid => 
        bid.highestBidderUsername == (JSON.parse(localStorage.getItem("user")).username) && !bid.status
      ).length || 0;
      setAuctionsWon(wonAuctions);

      const currentActiveBids = myBids.filter(bid => 
        bid.status
      ).length || 0;
      setActiveBids(currentActiveBids);
      
      setTreasuresCollected(wonAuctions);
      
      setLoading(false);
    } catch (error) {
      setError('Failed to load your heroic data');
      setLoading(false);
      console.error('Error fetching user data:', error);
    }
  };

  const handleBalanceUpdated = (newBalance) => {
    setBalance(newBalance);
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
                  {balance.toFixed(2)} <span className="drachma">₯</span>
                </div>
              </div>
              
              {/* Add Funds Button */}
              <div className="detail-item">
                <AddFundsButton onBalanceUpdated={handleBalanceUpdated} />
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
                <div className="stat-value">{auctionsCreated}</div>
                <div className="stat-label">Auctions Created</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon">🏆</div>
                <div className="stat-value">{auctionsWon}</div>
                <div className="stat-label">Auctions Won</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon">📊</div>
                <div className="stat-value">{activeBids}</div>
                <div className="stat-label">Active Bids</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon">⚱️</div>
                <div className="stat-value">{treasuresCollected}</div>
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