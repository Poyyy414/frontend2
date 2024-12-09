
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import img from './assets/tiktok.png'; // Import the image correctly
import { FaSearch } from 'react-icons/fa'; // Import the search icon
import './Dashboard.css';
import { Body } from './Body'; // Import the Body component

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  /* Verify if User In-Session in LocalStorage */
  useEffect(() => {
    const fetchDecodedUserID = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('token'));
        if (!token) {
          throw new Error('No token found');
        }

        const decodedToken = jwtDecode(token.data);
        setUser(decodedToken);
      } catch (error) {
        console.error('Session error or invalid token:', error);
        navigate('/login');
      }
    };

    fetchDecodedUserID();
  }, [navigate]);

  /* Performs Logout Method */
  const handleLogout = async () => {
    try {
      localStorage.removeItem('token'); // Clear token from localStorage
      setUser(null); // Clear user state
      navigate('/login'); // Redirect to login
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      <Navbar bg="light" data-bs-theme="light">
        <Container className="d-flex justify-content-between align-items-center">
          {/* Logo and Title Section */}
          <Navbar.Brand href="#home" className="d-flex align-items-center">
            <img src={img} alt="Tiktok Logo" className="navbar-logo" />
            <span className="navbar-text ms-2">TOKTOK</span>
          </Navbar.Brand>

          {/* Search Bar with Logo inside */}
          <div className="d-flex mx-auto" style={{ flex: 1, justifyContent: 'center' }}>
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Search..."
                aria-label="Search"
              />
              <button type="button" className="search-btn">
                <FaSearch />
              </button>
            </div>
          </div>

          {/* Right-aligned Navbar Items */}
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <NavDropdown
                title={user ? `${user.username}` : 'More'}
                id="basic-nav-dropdown"
                align="end"
              >
                <NavDropdown.Item href="#">Profile</NavDropdown.Item>
                <NavDropdown.Item href="#">Settings</NavDropdown.Item>
                <NavDropdown.Item href="#" onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Body Component */}
      <Body />
    </>
  );
}

export default Dashboard;
