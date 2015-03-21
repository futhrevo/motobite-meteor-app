Template.profileTemplate.rendered = function(){
    // IonSideMenu.snapper.close();
};


Template.profileTemplate.helpers({
    profEmail : function(){
      //TODO add interface to add profile pic property to each user
        if(Meteor.user() === null)
            return null;
        else if(Meteor.user().profile.pic)
            return Meteor.user().profile.pic;
        else
            return "scgPic.svg";

    },
    fullname: function(){
        if(Meteor.user() === null)
            return null;
        else
            return Meteor.user().profile.fullname;
    },
    userEmail : function(){
        if(Meteor.user() === null)
            return null;
        else
            return Meteor.user().emails[0].address;
    },
    dispName:function(){
        if(Meteor.user() === null)
            return null;
        else if(Meteor.user().profile.name)
            return Meteor.user().profile.name;
        else
            return null;
    },
    mobile:function(){
        if(Meteor.user() === null)
            return null;
        else
            return Meteor.user().profile.mobile;
    }
});
