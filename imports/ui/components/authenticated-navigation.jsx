import React from 'react';
import { browserHistory } from 'react-router';
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap';
import { Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';

const handleLogout = () => Meteor.logout(() => browserHistory.push('/login'));
const handleChangePassword = () => browserHistory.push('/change-password');

const userName = () => {
  const user = Meteor.user();
  return user.emails[0].address;
};

export const AuthenticatedNavigation = () => (
  <div>
    <Nav>
      <IndexLinkContainer to="/">
        <NavItem eventKey={ 1 } href="/">Index</NavItem>
      </IndexLinkContainer>
      <LinkContainer to="/profile">
        <NavItem eventKey={ 2 } href="/profile">Profile</NavItem>
      </LinkContainer>
    </Nav>
    <Nav pullRight>
      <NavDropdown eventKey={ 3 } title={ userName() } id="basic-nav-dropdown">
        <MenuItem eventKey={3.1} onClick={handleLogout}>Sign Out</MenuItem>
        <MenuItem eventKey={ 3.2 } onClick={ handleChangePassword }>Password Settings</MenuItem>
      </NavDropdown>
    </Nav>
  </div>
);
