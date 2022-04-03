import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Navbar } from 'react-bootstrap';
import { Link } from 'react-router';

import { PublicNavigation } from './public-navigation';
import { AuthenticatedNavigation } from './authenticated-navigation';

class AppNavigation extends Component {
  renderNavigation(hasUser) {
    return hasUser ? <AuthenticatedNavigation /> : <PublicNavigation />;
  }
  render() {
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">MotoBite</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          {this.renderNavigation(this.props.hasUser)}
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

AppNavigation.PropTypes = {
  hasUser: PropTypes.object,
};

export default createContainer(() => ({
  hasUser: Meteor.user(),
}), AppNavigation);
