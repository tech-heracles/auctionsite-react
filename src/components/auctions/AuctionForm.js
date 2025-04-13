import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AuctionService from '../../services/auction.service';
import './AuctionForm.css';

const AuctionForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required('The treasure must have a name')
      .min(5, 'Title must be at least 5 characters')
      .max(100, 'Title must not exceed 100 characters'),
    description: Yup.string()
      .required('You must describe your treasure to the mortals')
      .max(1000, 'Description must not exceed 1000 characters'),
    startingBid: Yup.number()
      .required('Set your initial offering price')
      .positive('Offerings must be positive'),
    endDate: Yup.date()
      .required('When shall this auction conclude?')
      .min(new Date(), 'The end date must lie in the future'),
    imageUrl: Yup.string().url('Provide a valid scroll of imagery').nullable()
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await AuctionService.createAuction(values);
      navigate('/');
    } catch (err) {
      setError(err.response?.data || 'The gods have rejected your offering');
      setSubmitting(false);
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
          <Formik
            initialValues={{
              title: '',
              description: '',
              startingBid: '',
              endDate: '',
              imageUrl: ''
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting
            }) => (
              <Form onSubmit={handleSubmit} className="olympus-form">
                <Form.Group className="mb-4 olympus-form-group">
                  <Form.Label className="olympus-label">
                    <span className="label-icon">📜</span>
                    <span>Treasure Name</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.title && !!errors.title}
                    className="olympus-input"
                    placeholder="Name your legendary item"
                  />
                  <Form.Control.Feedback type="invalid" className="olympus-feedback">
                    {errors.title}
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
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.description && !!errors.description}
                    className="olympus-textarea"
                    placeholder="Describe your treasure in a way that would impress even Zeus himself..."
                  />
                  <Form.Control.Feedback type="invalid" className="olympus-feedback">
                    {errors.description}
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
                    value={values.startingBid}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.startingBid && !!errors.startingBid}
                    className="olympus-input"
                    placeholder="Set a starting value worthy of your treasure"
                  />
                  <Form.Control.Feedback type="invalid" className="olympus-feedback">
                    {errors.startingBid}
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
                    value={values.endDate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.endDate && !!errors.endDate}
                    min={new Date().toISOString().slice(0, 16)}
                    className="olympus-input"
                  />
                  <Form.Control.Feedback type="invalid" className="olympus-feedback">
                    {errors.endDate}
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
                    value={values.imageUrl}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.imageUrl && !!errors.imageUrl}
                    className="olympus-input"
                    placeholder="Provide a URL to show mortals the glory of your offering"
                  />
                  <Form.Control.Feedback type="invalid" className="olympus-feedback">
                    {errors.imageUrl}
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
            )}
          </Formik>
        </div>
        <div className="scroll-bottom"></div>
      </div>
    </Container>
  );
};

export default AuctionForm;