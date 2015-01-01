Template.signIn.events({
    "click #signinSubmit": function(e) {
        var $form, email, pass;
        $form = $('#signinForm');
            email = $form.find("#signinEmail").val();
            pass = $form.find("#signinPassword").val();
            return Meteor.loginWithPassword(email, pass, function(error) {
                if (error) {
                    return alert(error.reason);
                } else {
                    return Router.go('/');
                }
            });
    }
});
