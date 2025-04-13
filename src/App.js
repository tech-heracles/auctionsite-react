// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import PageBackground from './components/layout/PageBackground';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Auction Components
import AuctionList from './components/auctions/AuctionList';
import AuctionDetails from './components/auctions/AuctionDetails';
import AuctionForm from './components/auctions/AuctionForm';
import MyAuctions from './components/auctions/MyAuctions';
import MyBids from './components/auctions/MyBids';

// User Components
import Profile from './components/user/Profile';

// Services
import AuthService from './services/auth.service';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = AuthService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <PageBackground>
      <Header />
      <main className="flex-grow-1">
        <Routes>
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <AuctionList />
              </ProtectedRoute>
            } 
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/auctions/:id" 
            element={
              <ProtectedRoute>
                <AuctionDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/auctions/create" 
            element={
              <ProtectedRoute>
                <AuctionForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-auctions" 
            element={
              <ProtectedRoute>
                <MyAuctions />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-bids" 
            element={
              <ProtectedRoute>
                <MyBids />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      <Footer />
      </PageBackground>
    </Router>
  );
}

export default App;