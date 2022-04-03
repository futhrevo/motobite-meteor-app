import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Image, Row, ListGroup, ListGroupItem } from 'react-bootstrap';

class Profile extends Component {

  render() {
    console.log(this.props.user);
    const userDoc = this.props.user;
    if (!userDoc) { return (<span>Loading...</span>); }
    return (
    <div>
        <Row className={'profileRow'}>
          <Image src={userDoc.profile.avatarUrl} className={'profilepic'} circle/>
        </Row>
        <ListGroup>
          <ListGroupItem header="Status">{userDoc.profile.status}</ListGroupItem>
          <ListGroupItem header="Email">{userDoc.emails[0].address}</ListGroupItem>
          <ListGroupItem header="Mobile" >{userDoc.mobile[0].number}</ListGroupItem>
        </ListGroup>
    </div>
    );
  }
}

Profile.propTypes = {
  user: PropTypes.object,
};

export default createContainer(() => ({
  user: Meteor.user(),
}), Profile);
