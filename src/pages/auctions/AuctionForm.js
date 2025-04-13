import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AuctionService from '../../services/auction.service';
import { AuctionData } from '../../models/AuctionData';
import './AuctionForm.css';

const AuctionForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [auctionData, setAuctionData] = useState(new AuctionData());
  const [validationErrors, setValidationErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAuctionData(auctionData.update(name, value));
    
    if (!touched[name]) {
      setTouched({ ...touched, [name]: true });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });

    const newErrors = auctionData.validate();
    setValidationErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = auctionData.validate();
    setValidationErrors(newErrors);
    
    const allTouched = {};
    ['title', 'description', 'startingBid', 'endDate', 'imageUrl'].forEach(field => {
      allTouched[field] = true;
    });
    setTouched(allTouched);
  
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const apiData = auctionData.toApiFormat();
      await AuctionService.createAuction(apiData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data || 'The gods have rejected your offering');
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="mt-4 olympus-form-container">
      <div className="olympus-form-header">
        <div className="meander-line"></div>
        <h2 className="olympus-title">OFFER YOUR TREASURE TO THE AGORA</h2>
        <div className="meander-line"></div>
      </div>
      
      {error && (
        <Alert variant="danger" className="olympus-error-alert">
          <span className="error-icon">⚡</span>
          <span className="error-message">{error}</span>
        </Alert>
      )}
      
      <div className="olympus-scroll">
        <div className="scroll-top"></div>
        <div className="scroll-content">
          <Form onSubmit={handleSubmit} className="olympus-form">
            <Form.Group className="mb-4 olympus-form-group">
              <Form.Label className="olympus-label">
                <span className="label-icon">📜</span>
                <span>Treasure Name</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={auctionData.title}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.title && !!validationErrors.title}
                className="olympus-input"
                placeholder="Name your legendary item"
              />
              <Form.Control.Feedback type="invalid" className="olympus-feedback">
                {validationErrors.title}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4 olympus-form-group">
              <Form.Label className="olympus-label">
                <span className="label-icon">🏺</span>
                <span>Tale of the Treasure</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="description"
                value={auctionData.description}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.description && !!validationErrors.description}
                className="olympus-textarea"
                placeholder="Describe your treasure in a way that would impress even Zeus himself..."
              />
              <Form.Control.Feedback type="invalid" className="olympus-feedback">
                {validationErrors.description}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4 olympus-form-group">
              <Form.Label className="olympus-label">
                <span className="label-icon">💰</span>
                <span>Initial Offering ($)</span>
              </Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="startingBid"
                value={auctionData.startingBid}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.startingBid && !!validationErrors.startingBid}
                className="olympus-input"
                placeholder="Set a starting value worthy of your treasure"
              />
              <Form.Control.Feedback type="invalid" className="olympus-feedback">
                {validationErrors.startingBid}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4 olympus-form-group">
              <Form.Label className="olympus-label">
                <span className="label-icon">⏳</span>
                <span>Auction Concludes</span>
              </Form.Label>
              <Form.Control
                type="datetime-local"
                name="endDate"
                value={auctionData.endDate}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.endDate && !!validationErrors.endDate}
                min={new Date().toISOString().slice(0, 16)}
                className="olympus-input"
              />
              <Form.Control.Feedback type="invalid" className="olympus-feedback">
                {validationErrors.endDate}
              </Form.Control.Feedback>
            </Form.Group>

            {/* <Form.Group className="mb-4 olympus-form-group">
              <Form.Label className="olympus-label">
                <span className="label-icon">🖼️</span>
                <span>Vision of the Treasure (optional)</span>
              </Form.Label>
              <Form.Control
                type="url"
                name="imageUrl"
                value={auctionData.imageUrl}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.imageUrl && !!validationErrors.imageUrl}
                className="olympus-input"
                placeholder="Provide a URL to show mortals the glory of your offering"
              />
              <Form.Control.Feedback type="invalid" className="olympus-feedback">
                {validationErrors.imageUrl}
              </Form.Control.Feedback>
            </Form.Group> */}

            <div className="olympus-submit-container">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="olympus-submit-button"
              >
                {isSubmitting ? 'The Oracle Speaks...' : 'PRESENT TO THE AGORA'}
              </Button>
            </div>
          </Form>
        </div>
        <div className="scroll-bottom"></div>
      </div>
    </Container>
  );
};

export default AuctionForm;