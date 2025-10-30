import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Navbar as BSNavbar,
  NavbarBrand,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from 'reactstrap';
import { FiSun, FiMoon, FiUser, FiLogOut, FiHome } from 'react-icons/fi';
import { toggleTheme } from '../../redux/slices/themeSlice';
import { logout } from '../../redux/slices/authSlice';
import { removeToken } from '../../utils/auth';
import './Navbar.css';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);

  const handleLogout = () => {
    removeToken();
    dispatch(logout());
    navigate('/login');
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <BSNavbar color="light" light expand="md" className="navbar-custom px-4">
      <NavbarBrand href="/dashboard" className="fw-bold">
        <FiHome className="me-2" />
        AI Document Extractor
      </NavbarBrand>
      
      <Nav className="ms-auto" navbar>
        <NavItem className="me-3">
          <Button
            color="link"
            onClick={handleThemeToggle}
            className="theme-toggle-btn"
            title={mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {mode === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
          </Button>
        </NavItem>
        
        <NavItem>
          <UncontrolledDropdown>
            <DropdownToggle nav caret className="user-dropdown">
              <FiUser className="me-2" />
              {user?.name || 'User'}
            </DropdownToggle>
            <DropdownMenu end>
              <DropdownItem header>{user?.email}</DropdownItem>
              <DropdownItem divider />
              <DropdownItem onClick={handleLogout}>
                <FiLogOut className="me-2" />
                Logout
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </NavItem>
      </Nav>
    </BSNavbar>
  );
};

export default Navbar;
