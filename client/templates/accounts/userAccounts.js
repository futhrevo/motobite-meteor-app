/* global AccountsTemplates */
Template.userAccountsIonic.onCreated(function () {
  if (Meteor.user()) {
    Router.go('index');
  }
});
Template.userAccountsIonic.events({
  'click [data-action=logout]': function () {
    AccountsTemplates.logout();
  }
});
