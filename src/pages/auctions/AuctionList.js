import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AuctionService from '../../services/auction.service';
import { AuctionListFilters } from '../../models/AuctionListFilters';
import moment from 'moment';
import './AuctionList.css';

const AuctionList = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState(new AuctionListFilters());
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const data = await AuctionService.getActiveAuctions(filters);
      setAuctions(data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load auctions');
      setLoading(false);
      console.error('Error fetching auctions:', error);
    }
  };

  const handleSearchChange = (e) => {
    setFilters(filters.update('searchTerm', e.target.value));
  };

  const handleMinPriceChange = (e) => {
    setFilters(filters.update('minPrice', parseInt(e.target.value) || 0));
  };

  const handleMaxPriceChange = (e) => {
    setFilters(filters.update('maxPrice', parseInt(e.target.value) || 0));
  };

  const applyFilters = () => {
    setIsFiltering(filters.hasActiveFilters());
    fetchAuctions();
  };

  const resetFilters = () => {
    setFilters(new AuctionListFilters().reset());
    setIsFiltering(false);
    fetchAuctions();
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

  return (
    <Container className="mt-4 olympus-container">
      <div className="treasury-header">
        <div className="meander-line"></div>
        <h2 className="olympus-title">THE OLYMPIAN TREASURY</h2>
        <div className="meander-line"></div>
      </div>
      
      {/* Filter Section */}
      <div className="filter-section mt-4 mb-4">
        <Row className="align-items-end">
          <Col md={4}>
            <Form.Group>
              <Form.Label className="olympus-label">Search Treasures</Form.Label>
              <InputGroup>
                <InputGroup.Text className="olympus-input-icon">🔍</InputGroup.Text>
                <Form.Control
                  className="olympus-input"
                  placeholder="Enter keywords..."
                  value={filters.searchTerm}
                  onChange={handleSearchChange}
                />
              </InputGroup>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label className="olympus-label">Minimum Price</Form.Label>
              <InputGroup>
                <InputGroup.Text className="olympus-input-icon">💰</InputGroup.Text>
                <Form.Control
                  className="olympus-input"
                  type="number"
                  min="0"
                  placeholder="Min price..."
                  value={filters.minPrice || ''}
                  onChange={handleMinPriceChange}
                />
              </InputGroup>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label className="olympus-label">Maximum Price</Form.Label>
              <InputGroup>
                <InputGroup.Text className="olympus-input-icon">💰</InputGroup.Text>
                <Form.Control
                  className="olympus-input"
                  type="number"
                  min="0"
                  placeholder="Max price..."
                  value={filters.maxPrice || ''}
                  onChange={handleMaxPriceChange}
                />
              </InputGroup>
            </Form.Group>
          </Col>
          <Col md={2} className="d-flex">
            <Button className="olympus-filter-button me-2" onClick={applyFilters}>
              Filter
            </Button>
            {filters.hasActiveFilters() && (
              <Button className="olympus-reset-button" onClick={resetFilters}>
                Reset
              </Button>
            )}
          </Col>
        </Row>
      </div>

      {auctions.length === 0 ? (
        <div className="empty-treasury">
          <div className="empty-icon">🏺</div>
          <div className="empty-text">
            {isFiltering 
              ? "No treasures match your quest" 
              : "The Treasury of Olympus awaits new offerings"}
          </div>
          <div className="empty-subtext">
            {isFiltering 
              ? "Try adjusting your filters to discover more divine artifacts." 
              : "The gods are preparing their treasures. Return soon, mortal."}
          </div>
          {isFiltering && (
            <Button className="olympus-reset-button mt-3" onClick={resetFilters}>
              View All Treasures
            </Button>
          )}
        </div>
      ) : (
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
      )}
    </Container>
  );
};

export default AuctionList;