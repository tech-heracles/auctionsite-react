import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';
import AuctionService from '../../services/auction.service';
import './MyAuctions.css';

const MyAuctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyAuctions();
  }, []);

  const fetchMyAuctions = async () => {
    try {
      setLoading(true);
      const data = await AuctionService.getMyAuctions();
      setAuctions(data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load your auctions');
      setLoading(false);
      console.error('Error fetching my auctions:', error);
    }
  };
  
  const getItemIcon = (title) => {
    const title_lower = title.toLowerCase();
    if (title_lower.includes('sword') || title_lower.includes('blade') || title_lower.includes('weapon')) {
      return '⚔️';
    } else if (title_lower.includes('shield') || title_lower.includes('armor') || title_lower.includes('helmet')) {
      return '🛡️';
    } else if (title_lower.includes('potion') || title_lower.includes('elixir') || title_lower.includes('wine')) {
      return '🏺';
    } else if (title_lower.includes('scroll') || title_lower.includes('book') || title_lower.includes('map')) {
      return '📜';
    } else if (title_lower.includes('gem') || title_lower.includes('jewel') || title_lower.includes('gold')) {
      return '💎';
    } else if (title_lower.includes('staff') || title_lower.includes('wand') || title_lower.includes('magic')) {
      return '🔮';
    } else {
      return '🏛️';
    }
  };

  const handleRowClick = (auctionId) => {
    navigate(`/auctions/${auctionId}`);
  };

  if (loading) {
    return (
      <div className="olympus-loading">
        <div className="loading-column"></div>
        <div className="loading-text">Consulting the Oracle of Delphi...</div>
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

  return (
    <Container className="mt-4">
      <div className="my-treasures-header">
        <div className="meander-line"></div>
        <h2 className="olympus-title">YOUR DIVINE OFFERINGS</h2>
        <div className="meander-line"></div>
      </div>
      
      {auctions.length === 0 ? (
        <div className="empty-treasury">
          <div className="empty-icon">🏺</div>
          <div className="empty-text">Your treasury awaits its first treasure</div>
          <div className="empty-subtext">
            You have not yet offered any items to the Agora.
            <Link to="/auctions/create" className="create-link">Present a treasure now!</Link>
          </div>
        </div>
      ) : (
        <div className="scrolls-container">
          <div className="scroll-header">
            <div className="scroll-column icon">
              <span className="column-title">Icon</span>
            </div>
            <div className="scroll-column title">
              <span className="column-title">Treasure</span>
            </div>
            <div className="scroll-column price">
              <span className="column-title">Initial<br/>Offering</span>
            </div>
            <div className="scroll-column price">
              <span className="column-title">Current<br/>Offering</span>
            </div>
            <div className="scroll-column date">
              <span className="column-title">Fated End</span>
            </div>
            <div className="scroll-column status">
              <span className="column-title">Status</span>
            </div>
            <div className="scroll-column bidder">
              <span className="column-title">Highest Bidder</span>
            </div>
          </div>
          
          <div className="scrolls-body">
            {auctions.map(auction => (
              <div 
                key={auction.id} 
                className={`scroll-row ${!auction.status ? 'ended' : 'active'}`}
                onClick={() => handleRowClick(auction.id)}
              >
                <div className="scroll-column icon">
                  <span className="item-icon">{getItemIcon(auction.title)}</span>
                </div>
                <div className="scroll-column title">
                  <span className="item-title">{auction.title}</span>
                </div>
                <div className="scroll-column price">
                  <span className="item-price">{auction.startingPrice.toFixed(2)} <span className="drachma">₯</span></span>
                </div>
                <div className="scroll-column price">
                  <span className="item-price current">{auction.currentHighestBid.toFixed(2)} <span className="drachma">₯</span></span>
                </div>
                <div className="scroll-column date">
                  <span className="item-date">{moment(auction.endDate).format('MMM D, YYYY h:mm A')}</span>
                </div>
                <div className="scroll-column status">
                  <span className={`item-status ${!auction.status ? 'ended' : 'active'}`}>
                    {!auction.status ? 'Concluded' : 'Active Quest'}
                  </span>
                </div>
                <div className="scroll-column bidder">
                  <span className="item-bidder">{auction.highestBidderUsername || 'No Heroes Yet'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="create-auction-container">
        <Link to="/auctions/create" className="olympus-create-button">
          <span className="button-icon">+</span>
          <span className="button-text">OFFER NEW TREASURE</span>
        </Link>
      </div>
    </Container>
  );
};

export default MyAuctions;