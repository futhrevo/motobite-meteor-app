/* global TransactColl */
/* global Messages */
/* global Meteor */
/* global Router */
/* global ChatController */
/* global createRoom */
/* global RouteController */
Router.configure({
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
    progressTick : true,
    // Subscriptions or other things we want to "wait" on.
    waitOn: function () {
        if (Meteor.user()) {

            var userIds = _.map(Meteor.user().profile.friends, function (f) {
                return f._id;
            });

            var subscriptions = _.map(userIds, function(fId) {
                return Meteor.subscribe('recentChats', fId);
            });

            subscriptions.push(Meteor.subscribe('friends', userIds));
            subscriptions.push(Meteor.subscribe('theMarkers'));
            subscriptions.push(Meteor.subscribe('theHouses'));
            subscriptions.push(Meteor.subscribe('theDrivers'));
            subscriptions.push(Meteor.subscribe('theDrives'));
            subscriptions.push(Meteor.subscribe('theLogs'));
            subscriptions.push(Meteor.subscribe('theRiderReqs'));
            subscriptions.push(Meteor.subscribe('myOwnGroups'));
            return subscriptions;
        }
    }
});
this.PublicController = RouteController.extend({
    layoutTemplate: "publicLayout",
});

this.DashboardController = RouteController.extend({
    layoutTemplate: 'layout',

});

this.tabsController = RouteController.extend({
    layoutTemplate: 'layout',
    subscriptions: function(){
        if (Meteor.user()) {
            var me = Meteor.userId();
            var toIds = _.map(TransactColl.find({requestee:me}).fetch(), function (f) {
                return f.requester;
            });
            var fromIds = _.map(TransactColl.find({requester:me}).fetch(), function (f) {
                return f.requestee;
            });
            var userIds = _.union(fromIds,toIds);
            return Meteor.subscribe('acquaintance', userIds);
        }

    },
    action: function () {
        if (this.ready()) {
            this.render();
        } else {
            this.render('loading');
        }
    }
});
Router.route('index',{
    path:'/',
    controller: 'PublicController',
    action: function () {
        if(Meteor.user()){
            this.layout("layout");
            return this.render("home");
        }else{
            this.layout("publicLayout");
            return this.render("publicHome");
        }
    }
});
Router.route('/inflate/drivers', {
    name:'inflateDrivers',
    controller: 'tabsController'
    });

Router.route('/inflate/drives', {
    name:'inflateDrives',
    controller: 'tabsController'
    });
Router.route('/inflate/requests', {
    name:'inflateReq',
    controller: 'tabsController'
});
Router.route('/about', {
    name: 'about',
    controller: 'DashboardController',
    });

Router.route('/profile', {
    name: 'profileTemplate',
    controller: 'DashboardController',
});
Router.route('/groups', {
    name: 'groups',
    controller: 'DashboardController',
});
Router.route('/groups/create', {
    name: 'createGroup',
    controller: 'DashboardController',
});
Router.route('/groups/:_id', {
    name: "groupView",
    template: "groupView",
    controller: 'DashboardController',
    
    data: function () {
        var _id = this.params._id;
        return {group: CommColl.findOne({ _id: _id }) };
    },
    subscriptions: function () {
        if (this.data().group) {
            var members = this.data().group.members;
            var blocked = this.data().group.blocked;
            var pending = this.data().group.pending;
            var userIds = members.concat(blocked, pending);
            this.subscribe('friends', userIds).wait();
        }
    }
});
Router.route('/changePswd',{
    name: 'changePswd',
    controller: 'DashboardController',
});

Router.route('/changeAvatar',{
    name:'changeAvatar',
    controller:'DashboardController'
});

Router.route('/contacts',{
    name:"myContacts",
    controller:'DashboardController'
});
Router.route('/help',{
    name:"help",
    controller:'DashboardController'
});
Router.route('/houses',{
    name:"houses",
    controller:'DashboardController'
});
Router.route('/profile/:_id',{
    name: 'profileView',
    template: 'profileView',
    controller: 'DashboardController',

    data: function() {
        var _id = this.params._id;
        return {user: Meteor.users.findOne({_id: _id})};
    },

    action: function() {
        if (this.data().user) {
            this.render('profileView');
        } else {
            this.redirect('index');
        }
    }
});

Router.route('/recent-chats', {
    name: 'recentChats',
    template: 'recentChats',
    controller: 'DashboardController',
    data: function(){
        if(Meteor.user()){
            var friends = _.map(Meteor.user().profile.friends, function(f){
                return f._id;
            });

            var recentChats = [];

            for(var i=0;i < friends.length;i++){
                var room = createRoom(Meteor.userId(),friends[i]);
                var message = Messages.findOne({room:room},{sort:{time:-1}});

                if(message){
                    recentChats.push({room:room,message:message});
                }
            }

            // newest first
            recentChats = _.sortBy(recentChats,function(chat){
                return -1 * chat.message.time;
            });

            return {recentChats:recentChats};
        }
    },

    action:function(){
        this.render('recentChats');
    }
});

Router.route('/chat/:friend/:limit?', {
    name: 'chat',
    controller: 'ChatController',
    template: 'chat'
});
ChatController = RouteController.extend({
    layoutTemplate: 'layout',
    increment: 15,
    chatLimit: function() {
        return parseInt(this.params.limit) || this.increment;
    },
    findOptions: function() {
        return {sort: {time: 1}};
    },
    room: function() {
        return createRoom(Meteor.userId(), this.params.friend);
    },
    subscriptions: function() {
        this.chatSub = Meteor.subscribe('chat', this.params.friend, this.chatLimit());
    },
    messages: function() {
        return Messages.find({room: this.room()}, this.findOptions());
    },
    data: function() {
        var hasMore = this.messages().count() === this.chatLimit();
        var olderChats = this.route.path({friend: this.params.friend, limit: this.chatLimit() + this.increment});
        return {
            room: this.room(),
            messages: this.messages(),
            ready: this.chatSub.ready(),
            olderChats: hasMore ? olderChats : null
        };
    }
});
Router.route('/signIn',{
    name: 'userAccountsIonic',
    controller: 'PublicController',
       action: function () {
        if (Meteor.user()) {
            this.redirect('index');
        } else {
            this.render();
        }
    }
});

Router.route('/verifyEmail/:cat?/:index?', {
    name: 'verifyEmail',
    controller: 'DashboardController',
    template: 'verifyEmail',
    data: function () {
        var cat = this.params.cat;
        var index = parseInt(this.params.index);
        if (typeof (cat) === 'string' && typeof (index) === 'number' && Meteor.user()) {
            var proj ;
            if (cat === "works") {
                if (Meteor.user().works.emails.length > index) {
                    proj = Meteor.user().works.emails[index].verified;
                }
            } else if (cat === "emails") {
                if (Meteor.user().emails.length > index) {
                    proj = Meteor.user().emails[index].verified;
                }
            } else {
                return { cat: false };
            }
            if (proj === false) {
                return { cat: cat, index: index };
            } else {
                return { cat: false };
            }
        } else {
            console.log("not printed");
            return { cat: false };
        }
    },
    action: function () {
        if (this.data().cat) {
            this.render('verifyEmail');
        } else {
            this.redirect('profileTemplate');
        }
    }
});

Router.route('/verifyMobile/:index?', {
    name: 'verifyMobile',
    controller: 'DashboardController',
    template: 'verifyMobile',
    data: function () { 
        var index = parseInt(this.params.index);
        if (typeof (index) === 'number' && Meteor.user()) { 
            var proj;
            if (Meteor.user().mobile.length > index) { 
                proj = Meteor.user().mobile[index].verified;
            }
            if (proj === false) {
                return { index: index };
            } else {
                return { index: null };
            }
        } else {
            return { index: null };
        }
    },
     action: function () {
        if (typeof(this.data().index) === 'number'){
            this.render('verifyMobile');
        } else {
            this.redirect('profileTemplate');
        }
    }
});
if (Meteor.isClient) {
    Router.plugin('ensureSignedIn', {
        except: ['userAccountsIonic', 'index']
    });
}