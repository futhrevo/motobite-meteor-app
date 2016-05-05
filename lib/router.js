/* global TransactColl, Messages, Meteor, Router, createRoom, RouteController, CommColl, ChatController */
/* exported ChatController*/
FlowRouter.notFound = {
    action: function () {
        BlazeLayout.render("app", {main: "notFound"})
    }
};

FlowRouter.route('/', {
    name: 'home',
    action: function () {
        // BlazeLayout.render("about");
        BlazeLayout.render("app", {main: "home"})
    }
});

// Router.configure({
//     layoutTemplate: "app",
//     loadingTemplate: 'loading',
//     // notFoundTemplate: 'notFound',
//     // progressTick : true,
//     // Subscriptions or other things we want to "wait" on.
//     // waitOn: function () {
//     //     if (Meteor.user()) {
//
//     //         let userIds = _.map(Meteor.user().profile.friends, function (f) {
//     //             return f._id;
//     //         });
//
//     //         let subscriptions = _.map(userIds, function(fId) {
//     //             return Meteor.subscribe('recentChats', fId);
//     //         });
//
//     //         subscriptions.push(Meteor.subscribe('friends', userIds));
//     //         subscriptions.push(Meteor.subscribe('theMarkers'));
//     //         subscriptions.push(Meteor.subscribe('theHouses'));
//     //         subscriptions.push(Meteor.subscribe('theDrivers'));
//     //         subscriptions.push(Meteor.subscribe('theDrives'));
//     //         subscriptions.push(Meteor.subscribe('theLogs'));
//     //         subscriptions.push(Meteor.subscribe('theRiderReqs'));
//     //         subscriptions.push(Meteor.subscribe('myOwnGroups'));
//     //         subscriptions.push(Meteor.subscribe('myGroups'));
//     //         return subscriptions;
//     //     }
//     // }
// });
// this.PublicController = RouteController.extend({
//     layoutTemplate: "publicLayout"
// });
//
// this.DashboardController = RouteController.extend({
//     layoutTemplate: 'layout'
//
// });

// this.tabsController = RouteController.extend({
//     layoutTemplate: 'layout',
//     // subscriptions: function(){
//     //     if (Meteor.user()) {
//     //         const me = Meteor.userId();
//     //         let toIds = _.map(TransactColl.find({requestee:me}).fetch(), function (f) {
//     //             return f.requester;
//     //         });
//     //         let fromIds = _.map(TransactColl.find({requester:me}).fetch(), function (f) {
//     //             return f.requestee;
//     //         });
//     //         let userIds = _.union(fromIds,toIds);
//     //         return Meteor.subscribe('acquaintance', userIds);
//     //     }
//
//     // },
//     // action: function () {
//     //     if (this.ready()) {
//     //         this.render();
//     //     } else {
//     //         this.render('loading');
//     //     }
//     // }
// });
// Router.route('index',{
//     path:'/',
//     name: 'home'
//     // controller: 'PublicController',
//     // action: function () {
//     //     if(Meteor.user()){
//     //         this.layout("layout");
//     //         return this.render("home");
//     //     }else{
//     //         this.layout("publicLayout");
//     //         return this.render("publicHome");
//     //     }
//     // }
// });
// Router.route('/inflate/drivers', {
//     name:'inflateDrivers',
//     // controller: 'tabsController'
//     });
//
// Router.route('/inflate/drives', {
//     name:'inflateDrives',
//     // controller: 'tabsController'
//     });
// Router.route('/inflate/requests', {
//     name:'inflateReq',
//     // controller: 'tabsController'
// });
// Router.route('/about', {
//     name: 'about',
//     // controller: 'DashboardController'
//     });
// Router.route('/settings',{
//     name: 'settings',
//     // controller: 'DashboardController'
// });
//
// Router.route('/profile', {
//     name: 'profileTemplate',
//     // controller: 'DashboardController'
// });
// Router.route('/groups', {
//     name: 'groups',
//     // controller: 'DashboardController'
// });
// Router.route('/groups/create', {
//     name: 'createGroup',
//     // controller: 'DashboardController'
// });
// Router.route('/groups/:_id', {
//     name: "groupView",
//     // controller: 'DashboardController',
//
//     // data: function () {
//     //     const _id = this.params._id;
//     //     const me = Meteor.userId();
//     //     let group = CommColl.findOne({ _id: _id });
//     //     let isOwner = false;
//     //     if (group && group.owner === me) {
//     //         isOwner = true;
//     //     }
//     //     return {group: group , isowner:isOwner};
//     // },
//     // subscriptions: function () {
//     //     if (this.data().isowner) {
//     //         if (this.data().group) {
//     //             let members = this.data().group.members;
//     //             let blocked = this.data().group.blocked;
//     //             let pending = this.data().group.pending;
//     //             let userIds = members.concat(blocked, pending);
//     //             this.subscribe('friends', userIds).wait();
//     //         }
//     //     }
//     // }
// });
// Router.route('/changePswd',{
//     name: 'changePswd',
//     // controller: 'DashboardController'
// });
//
// Router.route('/changeAvatar',{
//     name:'changeAvatar',
//     // controller:'DashboardController'
// });
//
// Router.route('/contacts',{
//     name:"myContacts",
//     // controller:'DashboardController'
// });
// Router.route('/help',{
//     name:"help",
//     // controller:'DashboardController'
// });
// Router.route('/houses',{
//     name:"houses",
//     // controller:'DashboardController'
// });
// Router.route('/profile/:_id',{
//     name: 'profileView',
//     // template: 'profileView',
//     // controller: 'DashboardController',
//
//     // data: function() {
//     //     const _id = this.params._id;
//     //     return {user: Meteor.users.findOne({_id: _id})};
//     // },
//
//     // action: function() {
//     //     if (this.data().user) {
//     //         this.render('profileView');
//     //     } else {
//     //         this.redirect('index');
//     //     }
//     // }
// });
//
// Router.route('/recent-chats', {
//     name: 'recentChats',
//     // template: 'recentChats',
//     // controller: 'DashboardController',
//     // data: function(){
//     //     if(Meteor.user()){
//     //         let friends = _.map(Meteor.user().profile.friends, function(f){
//     //             return f._id;
//     //         });
//
//     //         let recentChats = [];
//
//     //         for(let i=0;i < friends.length;i++){
//     //             let room = createRoom(Meteor.userId(),friends[i]);
//     //             let message = Messages.findOne({room:room},{sort:{time:-1}});
//
//     //             if(message){
//     //                 recentChats.push({room:room,message:message});
//     //             }
//     //         }
//
//     //         // newest first
//     //         recentChats = _.sortBy(recentChats,function(chat){
//     //             return -1 * chat.message.time;
//     //         });
//
//     //         return {recentChats:recentChats};
//     //     }
//     // },
//
//     // action:function(){
//     //     this.render('recentChats');
//     // }
// });
//
// Router.route('/chat/:friend/:limit?', {
//     name: 'chat',
//     // controller: 'ChatController',
//     // template: 'chat'
// });
// // ChatController = RouteController.extend({
// //     layoutTemplate: 'layout',
// //     // increment: 15,
// //     // chatLimit: function() {
// //     //     return parseInt(this.params.limit) || this.increment;
// //     // },
// //     // findOptions: function() {
// //     //     return {sort: {time: 1}};
// //     // },
// //     // room: function() {
// //     //     return createRoom(Meteor.userId(), this.params.friend);
// //     // },
// //     // // subscriptions: function() {
// //     // //     this.chatSub = Meteor.subscribe('chat', this.params.friend, this.chatLimit());
// //     // // },
// //     // messages: function() {
// //     //     return Messages.find({room: this.room()}, this.findOptions());
// //     // },
// //     // data: function() {
// //     //     let hasMore = this.messages().count() === this.chatLimit();
// //     //     let olderChats = this.route.path({friend: this.params.friend, limit: this.chatLimit() + this.increment});
// //     //     return {
// //     //         room: this.room(),
// //     //         messages: this.messages(),
// //     //         ready: this.chatSub.ready(),
// //     //         olderChats: hasMore ? olderChats : null
// //     //     };
// //     // }
// // });
// Router.route('/signIn',{
//     name: 'userAccountsIonic',
//     // controller: 'PublicController',
//     //    action: function () {
//     //     if (Meteor.user()) {
//     //         this.redirect('index');
//     //     } else {
//     //         this.render();
//     //     }
//     // }
// });
//
// Router.route('/verifyEmail/:cat?/:index?', {
//     name: 'verifyEmail',
//     // controller: 'DashboardController',
//     // template: 'verifyEmail',
//     // data: function () {
//     //     const cat = this.params.cat;
//     //     const index = parseInt(this.params.index);
//     //     if (typeof (cat) === 'string' && typeof (index) === 'number' && Meteor.user()) {
//     //         let proj ;
//     //         if (cat === "works") {
//     //             if (Meteor.user().works.emails.length > index) {
//     //                 proj = Meteor.user().works.emails[index].verified;
//     //             }
//     //         } else if (cat === "emails") {
//     //             if (Meteor.user().emails.length > index) {
//     //                 proj = Meteor.user().emails[index].verified;
//     //             }
//     //         } else {
//     //             return { cat: false };
//     //         }
//     //         if (proj === false) {
//     //             return { cat: cat, index: index };
//     //         } else {
//     //             return { cat: false };
//     //         }
//     //     } else {
//     //         console.log("not printed");
//     //         return { cat: false };
//     //     }
//     // },
//     // action: function () {
//     //     if (this.data().cat) {
//     //         this.render('verifyEmail');
//     //     } else {
//     //         this.redirect('profileTemplate');
//     //     }
//     // }
// });
//
// Router.route('/verifyMobile/:index?', {
//     name: 'verifyMobile',
//     // controller: 'DashboardController',
//     // template: 'verifyMobile',
//     // data: function () {
//     //     const index = parseInt(this.params.index);
//     //     if (typeof (index) === 'number' && Meteor.user()) {
//     //         let proj;
//     //         if (Meteor.user().mobile.length > index) {
//     //             proj = Meteor.user().mobile[index].verified;
//     //         }
//     //         if (proj === false) {
//     //             return { index: index };
//     //         } else {
//     //             return { index: null };
//     //         }
//     //     } else {
//     //         return { index: null };
//     //     }
//     // },
//     //  action: function () {
//     //     if (typeof(this.data().index) === 'number'){
//     //         this.render('verifyMobile');
//     //     } else {
//     //         this.redirect('profileTemplate');
//     //     }
//     // }
// });
// // if (Meteor.isClient) {
// //     Router.plugin('ensureSignedIn', {
// //         except: ['userAccountsIonic', 'index']
// //     });
// // }

/* 
FlowRouter.notFound = {
    action: function () {
        BlazeLayout.render("app", {main: "notFound"})
    }
};

FlowRouter.route('/', {
    name: 'home',
    action: function () {
        BlazeLayout.render("app", {main: "home"})
    }
});

FlowRouter.route('/inflate/drivers', {
    name: 'inflateDrivers',
    action: function () {
        BlazeLayout.render("app", {main: "inflateDrivers"})
    }
});

FlowRouter.route('/inflate/drives', {
    name: 'inflateDrives',
    action: function () {
        BlazeLayout.render("app", {main: "inflateDrives"})
    }
});

FlowRouter.route('/inflate/requests', {
    name: 'inflateReq',
    action: function () {
        BlazeLayout.render("app", {main: "inflateReq"})
    }
});

FlowRouter.route('/about', {
    name: 'about',
    action: function () {
        BlazeLayout.render("app", {main: "about"})
    }
});

FlowRouter.route('/settings', {
    name: 'settings',
    action: function () {
        BlazeLayout.render("app", {main: "settings"})
    }
});

FlowRouter.route('/profile', {
    name: 'profileTemplate',
    action: function () {
        BlazeLayout.render("app", {main: "profileTemplate"})
    }
});

FlowRouter.route('/groups', {
    name: 'groups',
    action: function () {
        BlazeLayout.render("app", {main: "groups"})
    }
});

FlowRouter.route('/groups/create', {
    name: 'createGroup',
    action: function () {
        BlazeLayout.render("app", {main: "createGroup"})
    }
});

FlowRouter.route('/groups/:_id', {
    name: 'groupView',
    action: function () {
        BlazeLayout.render("app", {main: "groupView"})
    }
});

FlowRouter.route('/changePswd', {
    name: 'changePswd',
    action: function () {
        BlazeLayout.render("app", {main: "changePswd"})
    }
});

FlowRouter.route('/changeAvatar', {
    name: 'changeAvatar',
    action: function () {
        BlazeLayout.render("app", {main: "changeAvatar"})
    }
});

FlowRouter.route('/contacts', {
    name: 'contacts',
    action: function () {
        BlazeLayout.render("app", {main: "contacts"})
    }
});

FlowRouter.route('/help', {
    name: 'help',
    action: function () {
        BlazeLayout.render("app", {main: "help"})
    }
});

FlowRouter.route('/houses', {
    name: 'houses',
    action: function () {
        BlazeLayout.render("app", {main: "houses"})
    }
});

FlowRouter.route('/profile/:_id', {
    name: 'profileView',
    action: function () {
        BlazeLayout.render("app", {main: "profileView"})
    }
});

FlowRouter.route('/recent-chats', {
    name: 'recentChats',
    action: function () {
        BlazeLayout.render("app", {main: "recentChats"})
    }
});

FlowRouter.route('/chat/:friend/:limit?', {
    name: 'chat',
    action: function () {
        BlazeLayout.render("app", {main: "chat"})
    }
});

FlowRouter.route('/signIn', {
    name: 'userAccountsIonic',
    action: function () {
        BlazeLayout.render("app", {main: "userAccountsIonic"})
    }
});

FlowRouter.route('/verifyEmail/:cat?/:index?', {
    name: 'verifyEmail',
    action: function () {
        BlazeLayout.render("app", {main: "verifyEmail"})
    }
});

FlowRouter.route('/verifyMobile/:index?', {
    name: 'verifyMobile',
    action: function () {
        BlazeLayout.render("app", {main: "verifyMobile"})
    }
});
 */