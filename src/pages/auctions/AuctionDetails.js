import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import AuctionService from '../../services/auction.service';
import AuthService from '../../services/auth.service';
import { BidData } from '../../models/BidData';
import './AuctionDetails.css';

const AuctionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bidData, setBidData] = useState(new BidData());
  const [bidError, setBidError] = useState('');
  const [bidSuccess, setBidSuccess] = useState('');
  const [balance, setBalance] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState('');
  
  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    fetchAuction();
    fetchBalance();
  }, [id]);

  useEffect(() => {
    if (auction && auction.status) {
      const timer = setInterval(() => {
        const endDate = moment(auction.endDate);
        const now = moment();
        if (now >= endDate) {
          setTimeRemaining('The Fates have closed this auction');
          clearInterval(timer);
        } else {
          const duration = moment.duration(endDate.diff(now));
          setTimeRemaining(
            `${Math.floor(duration.asDays())}d ${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`
          );
        }
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [auction]);

  const fetchAuction = async () => {
    try {
      setLoading(true);
      const data = await AuctionService.getAuctionById(id);
      setAuction(data);
      
      setBidData(BidData.createDefault(data.id, data.currentHighestBid));
      
      setLoading(false);
    } catch (error) {
      setError('Failed to load auction details');
      setLoading(false);
      console.error('Error fetching auction:', error);
    }
  };

  const fetchBalance = async () => {
    try {
      const balance = await AuctionService.getUserBalance();
      setBalance(balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const handleBidChange = (e) => {
    setBidData(bidData.update('amount', e.target.value));
    setBidError('');
    setBidSuccess('');
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    setBidError('');
    setBidSuccess('');
    
    const validationErrors = bidData.validate(auction.currentHighestBid, balance);
    
    if (Object.keys(validationErrors).length > 0) {
      setBidError(validationErrors.amount || 'Invalid bid');
      return;
    }
    
    try {
      const apiData = bidData.toApiFormat();
      await AuctionService.placeBid(apiData);
      
      setBidSuccess(`The gods smile upon your offering of ${parseFloat(bidData.amount).toFixed(2)} $!`);
      fetchAuction();
      fetchBalance();
    } catch (error) {
      if (error.response && error.response.data) {
        setBidError(error.response.data);
      } else {
        setBidError('The Fates reject your offering. Try again, mortal.');
      }
      console.error('Error placing bid:', error);
    }
  };

  const getItemIcon = (title) => {
    const title_lower = title ? title.toLowerCase() : '';
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

  if (loading) {
    return (
      <div className="olympus-loading">
        <div className="loading-column"></div>
        <div className="loading-text">The Oracle is consulting the Fates...</div>
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

  if (!auction) {
    return (
      <div className="olympus-error">
        <span className="error-icon">🏺</span>
        <div className="error-text">This treasure has vanished into the mists of time</div>
      </div>
    );
  }

  const canBid = auction.status && currentUser.id !== auction.sellerId;

  return (
    <Container className="mt-4">
      <div className="treasure-detail-header">
        <div className="meander-line"></div>
        <h2 className="olympus-title">DIVINE TREASURE</h2>
        <div className="meander-line"></div>
      </div>
      
      <Row className="mt-4">
        <Col lg={8}>
          <div className="treasure-main-card">
            <div className="treasure-header">
              <div className="treasure-icon">{getItemIcon(auction.title)}</div>
              <h3 className="treasure-title">{auction.title}</h3>
            </div>
            
            <div className="treasure-body">
              <div className="treasure-description">{auction.description}</div>
              
              <div className="treasure-details-section">
                <h4 className="details-title">
                  <span className="details-icon">📜</span>
                  <span>Treasure Details</span>
                </h4>
                <div className="details-grid">
                  <div className="detail-item">
                    <div className="detail-label">Initial Offering:</div>
                    <div className="detail-value">{auction.startingPrice.toFixed(2)} $</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Current Offering:</div>
                    <div className="detail-value highlight">{auction.currentHighestBid.toFixed(2)} $</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Highest Bidder:</div>
                    <div className="detail-value">{auction.highestBidderUsername || 'No Hero Yet'}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Merchant:</div>
                    <div className="detail-value">{auction.sellerUsername}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Auction Began:</div>
                    <div className="detail-value">{moment(auction.startDate).format('MMMM D, YYYY h:mm A')}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Fated to End:</div>
                    <div className="detail-value">{moment(auction.endDate).format('MMMM D, YYYY h:mm A')}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Status:</div>
                    <div className={`detail-value status ${!auction.status ? 'ended' : 'active'}`}>
                      {!auction.status ? 'Auction Concluded' : 'Active Quest'}
                    </div>
                  </div>
                  {auction.status && (
                    <div className="detail-item time-remaining">
                      <div className="detail-label">Time Remaining:</div>
                      <div className="detail-value countdown">{timeRemaining}</div>
                    </div>
                  )}
                </div>
              </div>

              {canBid && (
                <div className="bid-section">
                  <h4 className="bid-title">
                    <span className="bid-icon">⚱️</span>
                    <span>Present Your Offering</span>
                  </h4>
                  
                  {bidError && (
                    <div className="olympus-alert error">
                      <span className="alert-icon">⚡</span>
                      <span className="alert-text">{bidError}</span>
                    </div>
                  )}
                  
                  {bidSuccess && (
                    <div className="olympus-alert success">
                      <span className="alert-icon">🏆</span>
                      <span className="alert-text">{bidSuccess}</span>
                    </div>
                  )}
                  
                  <Form onSubmit={handleBidSubmit} className="olympus-bid-form">
                    <div className="bid-form-content">
                      <Form.Group className="mb-3">
                        <Form.Label className="bid-form-label">Your Offering ($)</Form.Label>
                        <Form.Control
                          type="number"
                          step="0.01"
                          min={auction.currentHighestBid + 0.01}
                          value={bidData.amount}
                          onChange={handleBidChange}
                          required
                          className="bid-input"
                        />
                        <Form.Text className="treasury-balance">
                          Your Treasury: <span className="balance-amount">{balance.toFixed(2)} $</span>
                        </Form.Text>
                      </Form.Group>
                      <Button type="submit" className="olympus-bid-button">
                        PRESENT OFFERING
                      </Button>
                    </div>
                  </Form>
                </div>
              )}
            </div>
          </div>
        </Col>
        
        <Col lg={4}>
          <div className="bid-history-card">
            <div className="bid-history-header">
              <h4 className="bid-history-title">
                <span className="history-icon">📊</span>
                Chronicles of Offerings
              </h4>
            </div>
            <div className="bid-history-body">
              {auction.bids && auction.bids.length > 0 ? (
                <div className="bid-list">
                  {auction.bids.map((bid) => (
                    <div key={bid.id} className="bid-item">
                      <div className="bid-amount">{bid.amount.toFixed(2)} $</div>
                      <div className="bid-info">
                        <span className="bidder-name">by {bid.bidderUsername}</span>
                        <span className="bid-time">{moment(bid.placedAt).format('MMM D, YYYY h:mm A')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-bids">
                  <div className="empty-icon">🏺</div>
                  <div className="empty-text">No offerings have been made</div>
                  <div className="empty-subtext">Be the first to present an offering</div>
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AuctionDetails;