import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AuthService from '../../services/auth.service';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required('A hero requires a name')
      .min(3, 'Your heroic name must be at least 3 characters')
      .max(20, 'Your heroic name must not exceed 20 characters'),
    email: Yup.string()
      .required('The gods require your email')
      .email('The message scroll address is invalid'),
    password: Yup.string()
      .required('A password is required to protect your treasures')
      .min(8, 'Your sacred password must be at least 8 characters'),
    confirmPassword: Yup.string()
      .required('Confirm your sacred oath')
      .oneOf([Yup.ref('password')], 'Your oaths do not match')
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await AuthService.register({
        username: values.username,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword
      });
      
      await AuthService.login({
        username: values.username,
        password: values.password
      });

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
              
              <Formik
                initialValues={{ 
                  username: '', 
                  email: '', 
                  password: '', 
                  confirmPassword: '' 
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
                        value={values.email}
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
                        value={values.password}
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
                        value={values.confirmPassword}
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
                        disabled={isSubmitting}
                        className="olympus-submit-button"
                      >
                        {isSubmitting ? 'THE FATES DECIDE...' : 'ASCEND TO OLYMPUS'}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
              
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