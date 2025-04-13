import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';
import AuctionService from '../../services/auction.service';
import './MyBids.css';

const MyBids = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyBids();
  }, []);

  const fetchMyBids = async () => {
    try {
      setLoading(true);
      const data = await AuctionService.getMyBids();
      setAuctions(data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load your bids');
      setLoading(false);
      console.error('Error fetching my bids:', error);
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
        <div className="loading-text">The Oracle is reading your destiny...</div>
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
      <div className="my-offerings-header">
        <div className="meander-line"></div>
        <h2 className="olympus-title">YOUR HEROIC QUESTS</h2>
        <div className="meander-line"></div>
      </div>
      
      {auctions.length === 0 ? (
        <div className="empty-quests">
          <div className="empty-icon">⚱️</div>
          <div className="empty-text">You have made no offerings to the gods</div>
          <div className="empty-subtext">
            Your journey has not yet begun. Seek treasures in the Agora.
            <Link to="/" className="browse-link">Browse the Olympian Treasury!</Link>
          </div>
        </div>
      ) : (
        <div className="parchment-container">
          <div className="parchment-header">
            <div className="parchment-column icon">
              <span className="column-title">Icon</span>
            </div>
            <div className="parchment-column treasure">
              <span className="column-title">Treasure</span>
            </div>
            <div className="parchment-column price">
              <span className="column-title">Your<br/>Offering</span>
            </div>
            <div className="parchment-column price">
              <span className="column-title">Highest<br/>Offering</span>
            </div>
            <div className="parchment-column status">
              <span className="column-title">Status</span>
            </div>
            <div className="parchment-column date">
              <span className="column-title">Fated End</span>
            </div>
            <div className="parchment-column result">
              <span className="column-title">Your Fate</span>
            </div>
          </div>
          
          <div className="parchment-body">
            {auctions.map(auction => {
              const myBids = auction.bids.filter(
                bid => bid.bidderUsername === JSON.parse(localStorage.getItem('user')).username
              );
              const myHighestBid = myBids.length > 0 
                ? Math.max(...myBids.map(bid => bid.amount)) 
                : 0;
              
              const isWinning = auction.highestBidderUsername === JSON.parse(localStorage.getItem('user')).username;
              
              return (
                <div 
                  key={auction.id} 
                  className={`parchment-row ${!auction.status ? 'ended' : 'active'}`}
                  onClick={() => handleRowClick(auction.id)}
                >
                  <div className="parchment-column icon">
                    <span className="item-icon">{getItemIcon(auction.title)}</span>
                  </div>
                  <div className="parchment-column treasure">
                    <span className="item-title">{auction.title}</span>
                  </div>
                  <div className="parchment-column price">
                    <span className="item-price">{myHighestBid.toFixed(2)} <span className="drachma">₯</span></span>
                  </div>
                  <div className="parchment-column price">
                    <span className="item-price current">{auction.currentHighestBid.toFixed(2)} <span className="drachma">₯</span></span>
                  </div>
                  <div className="parchment-column status">
                    <span className={`item-status ${!auction.status ? 'ended' : 'active'}`}>
                      {auction.status ? 'Concluded' : 'Active Quest'}
                    </span>
                  </div>
                  <div className="parchment-column date">
                    <span className="item-date">{moment(auction.endDate).format('MMM D, YYYY h:mm A')}</span>
                  </div>
                  <div className="parchment-column result">
                    <span className={`item-result ${auction.status ? (isWinning ? 'won' : 'lost') : (isWinning ? 'winning' : 'outbid')}`}>
                      {!auction.status ? (
                        isWinning ? 'Victory!' : 'Defeated'
                      ) : (
                        isWinning ? 'Leading' : 'Challenged'
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      <div className="browse-auctions-container">
        <Link to="/" className="olympus-browse-button">
          <span className="button-icon">🔍</span>
          <span className="button-text">SEEK MORE TREASURES</span>
        </Link>
      </div>
    </Container>
  );
};

export default MyBids;