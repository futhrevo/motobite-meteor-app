/* global Accounts */
//configure user accounts
Accounts.config({
    //New users with an email address will receive an address verification email
    sendVerificationEmail:true,
    restrictCreationByEmailDomain: function(email){
        const domain = email.slice(email.lastIndexOf("@")+1); // or regex
        const allowed = ["gmail.com","motobite.com"];
        return _.contains(allowed, domain);
    },
    loginExpirationInDays:120

});
Accounts.emailTemplates.siteName = "MotoBite";
Accounts.emailTemplates.from = "MotoBite Accounts <accounts@motobite.com>";
Accounts.emailTemplates.enrollAccount.subject = function (user) {
    return "Welcome to MotoBite App, " + user.profile.name;
};
Accounts.emailTemplates.enrollAccount.text = function (user, url) {
   return "You have been selected to participate in building a better future!"
     + " To activate your account, simply click the link below:\n\n"
     + url;
};
Accounts.emailTemplates.verifyEmail.subject = function() {
  return 'Welcome to MotoBite App';
};
// Support to add blank profile images
Accounts.onCreateUser(function(options, user) {
   console.log(user);
  // We still want the default hook's 'profile' behavior.
  if (options.profile)
    user["works"] = {};
    user["roles"] = ["banned", "demo"];
    user["works"]["emails"] = [{ address: options.profile.workEmail, verified: false }];
    user["mobile"] = [{number:options.profile.mobile, verified: false}];
    delete options.profile.workEmail;
    delete options.profile.mobile;
    options.profile.status = 'I care for planet!';
    options.profile.updatedAt = new Date();
    options.profile.avatarUrl = '/no_avatar.png';
    options.profile.notifications = true;
    options.profile.language = 'en';
    options.profile.friends = [];
    options.profile.city = null;
    options.profile.country = null;
    options.profile.points = 0;
    if(user.services.google){
        options.profile.avatarUrl = user.services.google.picture;
        options.profile.gender = user.services.google.gender;
        options.profile.fullname = user.services.google.name;
    }
    if (user.services.facebook) {
        options.profile.gender = user.services.facebook.gender;
    }
    user.profile = options.profile;
    console.log("placeholder for controlling accounts");
  return user;
});

// Validate username, sending a specific error message on failure.
Accounts.validateNewUser(function (user) {
    if (user.profile.name && user.profile.name.length >= 3)
        return true;
    throw new Meteor.Error(403, "Username must have at least 3 characters");
});
// Validate username, without a specific error message.
//TODO: Mechanism for users to report offensive usernames
Accounts.validateNewUser(function (user) {
    const disallowed = ["root","admin","xxx","fuck","sex","slut","bitch"];
    const name = user.profile.name.toLowerCase();
    return !(_.contains(name,disallowed));
});

// Called whenever a login is attempted (either successful or unsuccessful)
Accounts.validateLoginAttempt(function (attempt) {

    if (attempt.type === 'password') {
        if (attempt.allowed === true) {
            // check if user is banned
            if (attempt.user.roles) {
                if (attempt.user.roles.indexOf('banned') >= 0) {
                    // throw new Meteor.Error(403, "Login suspended, Please contact adminstrator");
                    // return false;
                }
            }
        }
    }
    return true;
});

