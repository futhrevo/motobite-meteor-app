import React, { Component, PropTypes } from 'react';
import { Grid } from 'react-bootstrap';
import AppNavigation from '../components/app-navigation';

class App extends Component {

  render() {
    return (
      <div>
        <AppNavigation />
        <Grid>
           {this.props.children}
        </Grid>
       </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.element.isRequired,
};

export default App;
