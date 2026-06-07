import React, { useState } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';

function LoginPage({ apiBaseUrl, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    try {
      const loginRes = await axios.post(`${apiBaseUrl}/auth/jwt/login`, formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const token = loginRes.data.access_token;

      const userRes = await axios.get(`${apiBaseUrl}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      onLoginSuccess(token, userRes.data);
    } catch (err) {
      setError('Invalid email or password!');
    }
  };

  const handleSignUp = async () => {
    setError('');
    setSuccess('');
    if (!email || !password) {
      setError('Please fill in both fields.');
      return;
    }

    try {
      await axios.post(`${apiBaseUrl}/auth/register`, { email, password });
      setSuccess('Account created! Click Login now.');
    } catch (err) {
      const detail = err.response?.data?.detail || 'Registration failed';
      setError(`Registration failed: ${detail}`);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card style={{ width: '400px' }} className="p-4 shadow">
        <Card.Body>
          <h3 className="text-center mb-4">🚀 Welcome to Simple Social</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Email:</Form.Label>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password:</Form.Label>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Form.Group>

            <Row>
              <Col>
                <Button type="submit" variant="primary" className="w-100">Login</Button>
              </Col>
              <Col>
                <Button type="button" variant="secondary" className="w-100" onClick={handleSignUp}>Sign Up</Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default LoginPage;