import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import { UserData } from '../../models/UserData';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(new UserData());
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(userData.update(name, value));
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    const tempUserData = userData.update(name, value);
    const validationErrors = tempUserData.validate();
    setErrors(prev => ({
      ...prev,
      [name]: validationErrors[name] || null
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const allTouched = {
      username: true,
      email: true,
      password: true,
      confirmPassword: true
    };
    setTouched(allTouched);
    
    const validationErrors = userData.validate();
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      const apiData = userData.toApiFormat();
      await AuthService.register(apiData);
      
      const loginData = userData.toLoginData();
      await AuthService.login(loginData);

      navigate('/');
    } catch (err) {
      let errorMessage = 'The Fates reject your registration. Please try again.';
      
      if (err.response) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data && typeof err.response.data === 'object') {
          const errors = [];
          for (const key in err.response.data) {
            if (Array.isArray(err.response.data[key])) {
              errors.push(...err.response.data[key]);
            } else {
              errors.push(err.response.data[key]);
            }
          }
          if (errors.length > 0) {
            errorMessage = errors.join(', ');
          }
        }
      }
      
      setError(errorMessage);
      setSubmitting(false);
    }
  };

  return (
    <Container className="mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="olympus-register-card">
            <div className="register-header">
              <div className="column-left"></div>
              <h3 className="register-title">JOIN THE PANTHEON</h3>
              <div className="column-right"></div>
            </div>
            
            <div className="register-body">
              <div className="meander-line"></div>
              
              {error && (
                <div className="olympus-alert error">
                  <span className="alert-icon">⚡</span>
                  <span className="alert-text">{error}</span>
                </div>
              )}
              
              <Form onSubmit={handleSubmit} className="olympus-form">
                <Form.Group className="mb-3">
                  <Form.Label className="olympus-label">
                    <span className="label-icon">👤</span>
                    <span>Heroic Name</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={userData.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.username && !!errors.username}
                    className="olympus-input"
                    placeholder="What shall we call you, hero?"
                  />
                  <Form.Control.Feedback type="invalid" className="olympus-feedback">
                    {errors.username}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="olympus-label">
                    <span className="label-icon">📜</span>
                    <span>Message Scroll (Email)</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.email && !!errors.email}
                    className="olympus-input"
                    placeholder="Where shall Hermes deliver your messages?"
                  />
                  <Form.Control.Feedback type="invalid" className="olympus-feedback">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="olympus-label">
                    <span className="label-icon">🔒</span>
                    <span>Sacred Password</span>
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={userData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.password && !!errors.password}
                    className="olympus-input"
                    placeholder="Create a secret known only to you"
                  />
                  <Form.Control.Feedback type="invalid" className="olympus-feedback">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="olympus-label">
                    <span className="label-icon">🔒</span>
                    <span>Confirm Sacred Oath</span>
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={userData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.confirmPassword && !!errors.confirmPassword}
                    className="olympus-input"
                    placeholder="Repeat your sacred words"
                  />
                  <Form.Control.Feedback type="invalid" className="olympus-feedback">
                    {errors.confirmPassword}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="olympus-submit-container">
                  <Button 
                    type="submit" 
                    disabled={submitting}
                    className="olympus-submit-button"
                  >
                    {submitting ? 'THE FATES DECIDE...' : 'ASCEND TO OLYMPUS'}
                  </Button>
                </div>
              </Form>
              
              <div className="olympus-login">
                <p>
                  Already a demigod? <Link to="/login" className="login-link">Enter the Agora</Link>
                </p>
              </div>
              
              <div className="meander-line bottom-line"></div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Register;