/* global AccountsTemplates */
Template.userAccountsIonic.events({
  'click [data-action=logout]': function () {
    AccountsTemplates.logout();
  }
});
