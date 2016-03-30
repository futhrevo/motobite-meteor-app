/* global check */
/**
 * Created by rakeshkalyankar on 13/07/15.
 */

Meteor.methods({
    setDisplayName: function(displayName) {
        check(displayName, String);
        check(this.userId, String);
        displayName = displayName.substring(0, 40);

        Meteor.users.update(this.userId, {$set: {'profile.name': displayName, 'profile.updatedAt': new Date()}});
    },

    setStatus: function(status) {
        check(status, String);
        check(this.userId, String);
        status = status.substring(0, 80);

        Meteor.users.update(this.userId, {$set: {'profile.status': status, 'profile.updatedAt': new Date()}});
    },

    
    setNotification: function(value) {
        check(value, Boolean);
        Meteor.users.update(this.userId, {$set: {'profile.notifications': value, 'profile.updatedAt': new Date()}});
    },

    //search users by email
    searchUser: function(searchId) {
        check(searchId, String);
        searchId = searchId.toLowerCase();
        return Meteor.users.findOne({"registered_emails.address": searchId}, {fields: {profile: 1} });
    },
    
    //add email field to profile
    addEmail: function(cat, index, email){
        check(this.userId, String);
		check(cat, String);
		check(email, String);
        check(index, Number);
        if (cat === "emails") {
            Meteor.users.update(this.userId, {$push: {
                emails:{
                    address:email, verified:false
                    }
                }
            });
        }else if (cat === "works") {
            Meteor.users.update(this.userId, {$pull: {"works.emails":{address:null}}});
            Meteor.users.update(this.userId, {$push: {
                "works.emails":{
                    address:email, verified:false
                    }
                }
            });
        }else{
            throw new Meteor.Error("error", "Server Error, Try again!");
        }     
    },
	
    //add number to profile
    addNumber:function(number){
        check(this.userId, String);
        check(number, String);
        if(number.length === 10){
            Meteor.users.update(this.userId, {$pull: {mobile: {number:null}}});
            Meteor.users.update(this.userId, {$push: {
                mobile: {
                    number: number, verified: false
                }
            }});
        }       
    },
    
    // delete an email from profile
    deleteEmail: function(cat, index, email){
        check(this.userId, String);
		check(cat, String);
		check(email, String);
        check(index, Number);
        
    }
});