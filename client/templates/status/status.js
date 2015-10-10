var retryTime = new ReactiveVar(0);
var retryHandle = null;

var clearRetryInterval = function () {
  clearInterval(retryHandle);

  retryHandle = null;
}

var trackStatus = function () {
  if (Meteor.status().status === 'waiting')
    retryHandle = retryHandle || setInterval(function () {
      var timeDiff = Meteor.status().retryTime - (new Date).getTime();
      var _retryTime = timeDiff > 0 && Math.round(timeDiff / 1000) || 0;

      retryTime.set(_retryTime);
    }, 500)
  else
    clearRetryInterval();
}


Template.status.onDestroyed(clearRetryInterval);

Template.status.onCreated(function () {
  this.autorun(trackStatus);
});

Template.status.helpers({
  connected: function () {
    return Meteor.status().connected
  },

  message: function () {
    return getStatusString('meteor_status', Meteor.status().status);
  },

  extraMessage: function () {
    if (Meteor.status().status === 'waiting')
      return getStatusString('meteor_status_reconnect_in', retryTime.get());
  },

  showReconnect: function () {
    return _.contains(['waiting', 'offline'], Meteor.status().status)
  },

  reconnectLabel: function () {
    return getStatusString('meteor_status_try_now', Meteor.status().status);
  }

});

Template.status.events({
  'click a.alert-link': function (e) {
    e.preventDefault();
    Meteor.reconnect();
  }
});

function getStatusString(str, value) {
   if (str == "meteor_status") {
      if (value == "connected") return "Connected";
      if (value == "connecting") return "Connecting...";
      if (value == "failed") return "The server connection failed";
      if (value == "waiting") return "Waiting for server connection,";
      if (value == "offline") return "Offline mode.";
  }
  if (str == "meteor_status_reconnect_in") {
     if (value < 2) return "trying again in one second...";
     return "trying again in " + value + " seconds...";
  } 
  if( str == 'meteor_status_try_now'){
    if (value == "waiting") return "Try now";
    if (value == "offline") return "Connect again";
  }
}