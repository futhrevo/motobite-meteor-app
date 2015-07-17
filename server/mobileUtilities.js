/**
 * Created by rakeshkalyankar on 16/07/15.
 */

Meteor.methods({
    sendNotification: function(title, text, query, payload) {
        check(title, String);
        check(text, String);
        check(query, Object);
        check(payload, Object);

        var notifications = true;

        if (query.userId) {
            notifications = Meteor.users.findOne({_id: query.userId}, {fields: {profile: 1}}).profile.notifications;
        }

        if (notifications) {
            Push.debug = true;
            Push.send({
                from: 'Motobite',
                title: title,
                text: text,
                query: query,
                payload: payload
            });
        }
    }
});