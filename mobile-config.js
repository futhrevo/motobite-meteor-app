// This section sets up some basic app metadata,
// the entire section is optional.
App.info({
  id: 'com.futrevo.reku.motobite',
  name: 'motobite',
  description: 'Future Evolved',
  author: 'Rakesh Kalyankar',
  email: 'contact@futrevo.com',
  website: 'http://futrevo.com'
});

//https://github.com/dburles/meteor-google-maps/issues/27
App.accessRule('https://*.googleapis.com/*');
App.accessRule('https://*.gstatic.com/*');