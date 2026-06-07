import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Button } from 'react-bootstrap';
import LoginPage from './components/LoginPage';
import FeedPage from './components/FeedPage';
import UploadPage from './components/UploadPage';

const API_BASE_URL = "http://localhost:8000";

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [currentPage, setCurrentPage] = useState('Feed');

  const getHeaders = () => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleLoginSuccess = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  if (!user) {
    return <LoginPage apiBaseUrl={API_BASE_URL} onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Container fluid>
      <Row>
        <Col md={3} lg={2} className="bg-light min-vh-100 p-3 border-end">
          <h4 className="mb-3">👋 Hi {user.email}!</h4>
          <Button variant="outline-danger" size="sm" className="w-100 mb-4" onClick={handleLogout}>
            Logout
          </Button>
          <hr />
          <Nav variant="pills" className="flex-column" activeKey={currentPage} onSelect={(k) => setCurrentPage(k)}>
            <Nav.Item>
              <Nav.Link eventKey="Feed">🏠 Feed</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="Upload">📸 Upload</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>

        <Col md={9} lg={10} className="p-4">
          {currentPage === 'Feed' ? (
            <FeedPage apiBaseUrl={API_BASE_URL} getHeaders={getHeaders} />
          ) : (
            <UploadPage apiBaseUrl={API_BASE_URL} getHeaders={getHeaders} onUploadSuccess={() => setCurrentPage('Feed')} />
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default App;