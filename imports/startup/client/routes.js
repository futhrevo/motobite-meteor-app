import { Meteor } from 'meteor/meteor';
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { STATES } from 'meteor/std:accounts-ui';

import App from '../../ui/layouts/app';
import { Index } from '../../ui/pages/index';
import { NotFound } from '../../ui/pages/not-found';
import Profile from '../../ui/pages/profile';
import NewLogin from './accountsUiConfig';

const requireAuth = (nextState, replace) => {
  if (!Meteor.loggingIn() && !Meteor.userId()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname },
    });
  }
};

Meteor.startup(() => {
  render((
    <Router history={ browserHistory }>
      <Route path="/" component={ App }>
        <IndexRoute name="index" component={ Index } onEnter={ requireAuth } />
         <Route name="profile" path="/profile" component={ Profile } onEnter={ requireAuth } />
        <Route name="login" path="/login" component={ () => <NewLogin /> } />
        <Route name="change-password" path="/change-password"
          component={() => <NewLogin formState={STATES.PASSWORD_CHANGE} />} onEnter={requireAuth} />
        <Route name="reset-password" path="/reset-password/:token" component={ () => <NewLogin formState={STATES.PASSWORD_RESET} /> } />
        <Route name="signup" path="/signup" component={() => <NewLogin formState={STATES.SIGN_UP} />} />
        <Route path="*" component={ NotFound } />
      </Route>
    </Router>
  ), document.getElementById('react-root'),
  );
});
