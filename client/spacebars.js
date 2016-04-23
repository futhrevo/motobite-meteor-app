/* global moment*/
/* exported moment*/
/**
 * Created by rakeshkalyankar on 16/07/15.
 */

Template.registerHelper('formatTime', function(timestamp) {
    return moment(timestamp).format('HH:mm DD/MM/YYYY');
});

Template.registerHelper('getTime', function(timestamp) {
    return moment(timestamp).format('HH:mm');
});

Template.registerHelper('getDate', function(timestamp) {
    return moment(timestamp).format('DD/MM/YYYY');
});

Template.registerHelper('isCordova', function(){
    return Meteor.isCordova;
});

Template.registerHelper('checked', function(value){
        return value === true ? 'checked' : '';
});

Template.registerHelper('instance', function () {
    return Template.instance();
});