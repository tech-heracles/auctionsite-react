import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AuthService from '../../services/auth.service';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (location.state && location.state.message) {
      setMessage(location.state.message);
    }

    if (AuthService.isAuthenticated()) {
      navigate('/');
    }
  }, [navigate, location]);

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Your heroic name is required'),
    password: Yup.string().required('Your sacred password is required')
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      setMessage('');
      await AuthService.login(values);
      navigate('/');
    } catch (err) {
      let errorMessage = 'The gates of Olympus remain closed. Check your credentials.';
      
      if (err.response) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data && typeof err.response.data === 'object') {
          const errorValues = Object.values(err.response.data);
          if (errorValues.length > 0) {
            if (Array.isArray(errorValues[0])) {
              errorMessage = errorValues[0].join(', ');
            } else {
              errorMessage = JSON.stringify(errorValues[0]);
            }
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
          <div className="olympus-login-card">
            <div className="login-header">
              <div className="column-left"></div>
              <h3 className="login-title">ENTER THE AGORA</h3>
              <div className="column-right"></div>
            </div>
            
            <div className="login-body">
              <div className="meander-line"></div>
              
              {error && (
                <div className="olympus-alert error">
                  <span className="alert-icon">⚡</span>
                  <span className="alert-text">{error}</span>
                </div>
              )}
              
              {message && (
                <div className="olympus-alert success">
                  <span className="alert-icon">🏆</span>
                  <span className="alert-text">{message}</span>
                </div>
              )}
              
              <Formik
                initialValues={{ username: '', password: '' }}
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
                    <Form.Group className="mb-3">
                      <Form.Label className="olympus-label">
                        <span className="label-icon">👤</span>
                        <span>Heroic Name</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="username"
                        value={values.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.username && !!errors.username}
                        className="olympus-input"
                        placeholder="Enter your champion name"
                      />
                      <Form.Control.Feedback type="invalid" className="olympus-feedback">
                        {errors.username}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="olympus-label">
                        <span className="label-icon">🔒</span>
                        <span>Secret Password</span>
                      </Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.password && !!errors.password}
                        className="olympus-input"
                        placeholder="Speak your sacred words"
                      />
                      <Form.Control.Feedback type="invalid" className="olympus-feedback">
                        {errors.password}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <div className="olympus-submit-container">
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="olympus-submit-button"
                      >
                        {isSubmitting ? 'THE ORACLE SPEAKS...' : 'ENTER THE AGORA'}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
              
              <div className="olympus-register">
                <p>
                  Not yet a hero? <Link to="/register" className="register-link">Join the Pantheon</Link>
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

export default Login;