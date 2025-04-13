import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import AuctionService from '../../services/auction.service';
import './AddFundsButton.css';

const AddFundsButton = ({ onBalanceUpdated }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedGod, setSelectedGod] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const gods = [
    { 
      name: 'Heracles', 
      amount: 2000.00, 
      icon: '🦁', 
      description: 'The mighty hero will bless you with great wealth!',
      resultMessage: 'Heracles has granted you strength and prosperity!'
    },
    { 
      name: 'Hera', 
      amount: 1.00, 
      icon: '👑', 
      description: 'The queen of gods may be fickle with her gifts...',
      resultMessage: 'Hera is displeased with your offering! No coins for you.'
    },
    { 
      name: 'Apollo', 
      amount: 500.00, 
      icon: '🏹', 
      description: 'The god of light offers moderate fortune.',
      resultMessage: 'Apollo shines his light on your treasury!'
    },
    { 
      name: 'Hades', 
      amount: 1000.00, 
      icon: '💀', 
      description: 'The lord of the underworld rewards the brave!',
      resultMessage: 'Hades has deemed you worthy of riches from below!'
    }
  ];

  const handleOpenModal = () => {
    setShowModal(true);
    setSelectedGod(null);
    setError('');
    setSuccessMessage('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleGodSelection = (god) => {
    setSelectedGod(god);
  };

  const handlePray = async () => {
    if (!selectedGod) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const newBalance = await AuctionService.updateBalance(selectedGod.amount);
      
      setSuccessMessage(selectedGod.resultMessage);
      
      if (onBalanceUpdated) {
        onBalanceUpdated(newBalance);
      }

      setTimeout(() => {
        setSelectedGod(null);
        setSuccessMessage('');
        setShowModal(false);
      }, 2000);
      
    } catch (error) {
      setError('The gods are not responding to your prayer right now.');
      console.error('Error updating balance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button 
        className="olympus-button add-funds-btn" 
        onClick={handleOpenModal}
      >
        <span className="btn-icon">⚱️</span>
        <span className="btn-text">Pray for Funds</span>
      </Button>

      <Modal 
        show={showModal} 
        onHide={handleCloseModal}
        centered
        className="olympus-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="modal-title">
            <div className="meander-line small"></div>
            <h3>OFFER A PRAYER</h3>
            <div className="meander-line small"></div>
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <p className="prayer-instructions">
            Choose a deity to pray to for financial blessing. Each god offers different favors.
          </p>
          
          <div className="gods-container">
            {gods.map((god) => (
              <div 
                key={god.name}
                className={`god-option ${selectedGod?.name === god.name ? 'selected' : ''}`}
                onClick={() => handleGodSelection(god)}
              >
                <div className="god-icon">{god.icon}</div>
                <div className="god-name">{god.name}</div>
                <div className="god-offering">{god.amount} ₯</div>
                <div className="god-description">{god.description}</div>
              </div>
            ))}
          </div>
          
          {error && (
            <div className="prayer-error">
              <span className="error-icon">⚡</span>
              {error}
            </div>
          )}
          
          {successMessage && (
            <div className="prayer-success">
              <span className="success-icon">✨</span>
              {successMessage}
            </div>
          )}
        </Modal.Body>
        
        <Modal.Footer>
          <Button 
            variant="secondary" 
            className="olympus-button secondary" 
            onClick={handleCloseModal}
          >
            Decline
          </Button>
          
          <Button 
            className="olympus-button primary" 
            onClick={handlePray}
            disabled={!selectedGod || isLoading}
          >
            {isLoading ? 'Praying...' : 'Offer Prayer'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddFundsButton;