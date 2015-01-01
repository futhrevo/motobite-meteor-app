Template.signUp.events({
  "click #signupSubmit": function(e) {
    var $form, email, pass;
    $form = $('#signupForm');
    email = $form.find("#signupEmail").val();
    pass = $form.find("#signupPassword").val();
    return Accounts.createUser({
      email: email,
      password: pass
    }, function(error) {
      if (error) {
        return alert(error.reason);;
      } else {
        return Router.go("/");
      }
    });
  }
});
