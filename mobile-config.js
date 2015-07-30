// This section sets up some basic app metadata,
// the entire section is optional.
App.info({
  id: 'com.futrevo.reku.motobite',
  name: 'motobite',
  description: 'Future Evolved',
  author: 'Rakesh Kalyankar',
  email: 'admin@motobite.com',
  website: 'http://motobite.com'
});

//https://github.com/dburles/meteor-google-maps/issues/27
App.accessRule('http://192.168.2.6:3000/*');
App.accessRule('https://*.googleapis.com/*');
App.accessRule('https://*.gstatic.com/*');
App.accessRule('https://*.google.com/*');

App.setPreference("StatusBarBackgroundColor", "#00796B");

