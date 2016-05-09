/* global Accounts */
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { HTTP } from 'meteor/http';
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
        options.profile.avatarUrl = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large";
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
    const disallowed = ["root","admin"];
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

Accounts.registerLoginHandler('facebook', function(params) {
    const data = params.facebook;
    console.log("FB account handler");

    // If this isn't facebook login then we don't care about it. No need to proceed.
    if (!data) {
      return undefined;
    }

    // The fields we care about (same as Meteor's)
    const whitelisted = ['id', 'email', 'name', 'first_name',
     'last_name', 'link', 'gender', 'locale', 'age_range'];

    // Get our user's identifying information. This also checks if the accessToken
    // is valid. If not it will error out.
    const identity = getIdentity(data.accessToken, whitelisted);

    // Build our actual data object.
    const serviceData = {
      accessToken: data.accessToken,
      expiresAt: (+new Date) + (1000 * data.expirationTime)
    };
    const fields = Object.assign({}, serviceData, identity);

    // Search for an existing user with that facebook id
    let existingUser;
    if(identity && identity.email && identity.email != null){
        existingUser = Meteor.users.findOne({'registered_emails.address': identity.email});
    }else{
        existingUser = Meteor.users.findOne({ 'services.facebook.id': identity.id });
    }

    let userId;
if (existingUser) {
  userId = existingUser._id;
  console.log(userId);


  // Update our data to be in line with the latest from Facebook
  const prefixedData = {};
  _.each(fields, (val, key) => {
    prefixedData[`services.facebook.${key}`] = val;
  });

  Meteor.users.update({ _id: userId }, {
    $set: prefixedData,
    $addToSet: { emails: { address: identity.email, verified: true } }
  });

} else {
  // Create our user
  console.log("new user");

  userId = Meteor.users.insert({
    services: {
      facebook: fields
    },
    profile: { name: identity.name,
        gender: identity.gender,
        status: 'FB to MB',
        updatedAt:new Date(),
        notifications: true,
        language: identity.locale,
        friends: [],
        city: null,
        country: null,
        points: 0,
        avatarUrl: "http://graph.facebook.com/" + identity.id + "/picture/?type=large"
        },
    emails: [{
      address: identity.email,
      verified: true
    }]
  });
}

return { userId: userId };

});


// Gets the identity of our user and by extension checks if
// our access token is valid.
const getIdentity = (accessToken, fields) => {
    try {
        console.log(accessToken);
    return HTTP.get("https://graph.facebook.com/v2.4/me", {
      params: {
        access_token: accessToken,
        fields: fields
      }
    }).data;
  } catch (err) {
    throw _.extend(new Error("Failed to fetch identity from Facebook. " + err.message),
                   {response: err.response});
  }
}
