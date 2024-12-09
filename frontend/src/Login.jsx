import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from './assets/tiktok.png'; // Ensure this path is correct
import './login.css';
import img from './assets/background.jpg';

import 'bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { API_ENDPOINT } from './Api.jsx';

function LoginSignup() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [error, setError] = useState('');

  // Verify if user is in session
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('token'));
        if (!token) throw new Error('No token found');

        const response = await axios.get(`${API_ENDPOINT}/auth/verify`, {
          headers: { Authorization: `Bearer ${token.data}` },
        });

        if (response.data.success) {
          setUser(response.data.user);
          navigate('/dashboard');
        } else {
          throw new Error('Invalid token');
        }
      } catch (error) {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('All fields are required.');
      return;
    }

    try {
      const response = await axios.post(`${API_ENDPOINT}/auth/login`, {
        username,
        password,
      });

      localStorage.setItem('token', JSON.stringify(response.data));
      setError('');
      navigate('/dashboard');
    } catch (error) {
      setError('Invalid username or password');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!fullname || !username || !password) {
      setError('All fields are required.');
      return;
    }

    try {
      const response = await axios.post(`${API_ENDPOINT}/auth/register`, {
        fullname,
        username,
        password,
      });

      localStorage.setItem('token', JSON.stringify(response.data));
      setError('');
      navigate('/dashboard');
    } catch (error) {
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <>
      {/* Navbar */}
      <Navbar className="custom-navbar py-3">
        <Container>
          <Navbar.Brand href="#home" className="text-white fw-bold">
            <img src={logo} alt="Tiktok Logo" className="navbar-logo" />
            TOKTOK
          </Navbar.Brand>
        </Container>
      </Navbar>

      {/* Background Image */}
      <div>
        <img className="background-image" src={img} alt="Background" />
      </div>

      {/* Login/Signup Form */}
      <Container className="mt-5">
        <Row className="justify-content-md-center">
          <Col md={4}>
            <div className="login_signup_form">
              <h2 className="login-title">
                {isSignup ? 'Signup to Toktok' : 'Login to Toktok'}
              </h2>
              <div className="card mt-3">
                <div className="card-body login-card-body">
                  {isSignup ? (
                    <Form onSubmit={handleSignup}>
                      <Form.Group controlId="formFullname">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Full Name"
                          value={fullname}
                          onChange={(e) => setFullname(e.target.value)}
                          required
                        />
                      </Form.Group>

                      <Form.Group controlId="formUsername" className="mt-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                        />
                      </Form.Group>

                      <Form.Group controlId="formPassword" className="mt-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Enter Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </Form.Group>

                      <Button variant="success" type="submit" className="btn btn-block mt-3">
                        Signup
                      </Button>
                    </Form>
                  ) : (
                    <Form onSubmit={handleLogin}>
                      <Form.Group controlId="formUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                        />
                      </Form.Group>

                      <Form.Group controlId="formPassword" className="mt-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Enter Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </Form.Group>

                      <Button variant="success" type="submit" className="btn btn-block mt-3">
                        Login
                      </Button>
                    </Form>
                  )}

                  {error && <p className="text-danger mt-3">{error}</p>}

                  <div className="mt-3 text-center">
                    <Button variant="link" onClick={() => setIsSignup(!isSignup)}>
                      {isSignup ? 'Already have an account? Login' : 'New to Tiktok? Signup'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Footer */}
      <footer className="footer text-center mt-5">
        <p>© 2024 Tiktok. All rights reserved.</p>
      </footer>
    </>
  );
}

export default LoginSignup;
