// Support to add blank profile images
Accounts.onCreateUser(function(options, user) {

  // We still want the default hook's 'profile' behavior.
  if (options.profile)
    user.profile = options.profile;
    console.log("placeholder for controlling accounts");
  return user;
});
