import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AuctionService from '../../services/auction.service';
import moment from 'moment';
import './AuctionList.css';

const AuctionList = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const data = await AuctionService.getActiveAuctions();
      setAuctions(data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load auctions');
      setLoading(false);
      console.error('Error fetching auctions:', error);
    }
  };

  const formatTimeRemaining = (timeRemaining) => {
    const duration = moment.duration(timeRemaining);
    if (duration.asDays() >= 1) {
      return `${Math.floor(duration.asDays())} days, ${duration.hours()} hours`;
    } else if (duration.asHours() >= 1) {
      return `${duration.hours()} hours, ${duration.minutes()} minutes`;
    } else {
      return `${duration.minutes()} minutes, ${duration.seconds()} seconds`;
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

  if (auctions.length === 0) {
    return (
      <Container className="mt-4 olympus-container">
        <div className="treasury-header">
          <div className="meander-line"></div>
          <h2 className="olympus-title">THE OLYMPIAN TREASURY</h2>
          <div className="meander-line"></div>
        </div>
        <div className="empty-treasury">
          <div className="empty-icon">🏺</div>
          <div className="empty-text">The Treasury of Olympus awaits new offerings</div>
          <div className="empty-subtext">The gods are preparing their treasures. Return soon, mortal.</div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4 olympus-container">
      <div className="treasury-header">
        <div className="meander-line"></div>
        <h2 className="olympus-title">THE OLYMPIAN TREASURY</h2>
        <div className="meander-line"></div>
      </div>
      <Row className="mt-4">
        {auctions.map((auction) => (
          <Col key={auction.id} md={4} className="mb-4">
            <div className="auction-card">
              <div className="auction-icon">
                {getItemIcon(auction.title)}
              </div>
              <Link to={`/auctions/${auction.id}`} className="auction-header" style={{ textDecoration: 'none' }}>
                  <h3 className="auction-title">{auction.title}</h3>
              </Link>
              <div className="auction-content">
                <div className="auction-detail">
                  <span className="detail-label">Current Offering:</span>
                  <span className="detail-value">{auction.currentBid.toFixed(2)} $</span>
                </div>
                <div className="auction-detail">
                  <span className="detail-label">Merchant:</span>
                  <span className="detail-value">{auction.sellerUsername}</span>
                </div>
                <div className="auction-detail">
                  <span className="detail-label">Fated to End:</span>
                  <span className="detail-value time-remaining">{formatTimeRemaining(auction.timeRemaining)}</span>
                </div>
                <Link to={`/auctions/${auction.id}`} className="olympus-button">
                  <span className="button-text">View Treasure</span>
                </Link>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AuctionList;