//configure user accounts
Accounts.config({
    //New users with an email address will receive an address verification email
    sendVerificationEmail:true,
    restrictCreationByEmailDomain: function(email){
        var domain = email.slice(email.lastIndexOf("@")+1); // or regex
        var allowed = ["gmail.com","tpolo.com"];
        return _.contains(allowed, domain);
    },
    loginExpirationInDays:120

});

// Support to add blank profile images
Accounts.onCreateUser(function(options, user) {

  // We still want the default hook's 'profile' behavior.
  if (options.profile)
    user["works"] = {};
    user["roles"] = [];
    user["works"]["emails"] = [{address : options.profile.workEmail,verified:false}];
    delete options.profile.workEmail;
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
    var disallowed = ["root","admin","god","xxx","fuck","sex","slut","bitch"];
    var name = user.profile.name.toLowerCase();
    return !(_.contains(name,disallowed));
});

// Called whenever a login is attempted (either successful or unsuccessful)
Accounts.validateLoginAttempt(function(attempt) {

    if(attempt.type == 'password'){
        var userEmail = attempt.methodArguments[0].user['email'].toLowerCase();
        // check the reason for failure
        if(attempt.allowed == false){
            throw new Meteor.Error(403,"Check your email and password");
            //throw new Meteor.Error(403,"Can not find user " + userEmail);
            return false;
        }
        // check if user is banned
        if(attempt.user.roles){
            if(attempt.user.roles.indexOf('banned') >= 0){
                throw new Meteor.Error(403, "Login suspended, Please contact adminstrator");
                return false;
            }
        }


    }
    return true;
});

