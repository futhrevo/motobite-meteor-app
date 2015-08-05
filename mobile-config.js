// This section sets up some basic app metadata,
// the entire section is optional.
App.info({
  id: 'com.futrevo.reku.motobite',
  name: 'Motobite',
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

App.icons({
    'iphone_2x': 'resources/icons/appicon-60@2x.png', //120x120
    'iphone_3x': 'resources/icons/appicon-60@3x.png', //180x180
    'ipad': 'resources/icons/appicon-76.png', //76x76
    'ipad_2x': 'resources/icons/appicon-76@2x.png', //152x152
    'android_ldpi': 'resources/icons/drawable-ldpi/appicon.png', //36x36
    'android_mdpi': 'resources/icons/drawable-mdpi/appicon.png', //48x48
    'android_hdpi': 'resources/icons/drawable-hdpi/appicon.png', //72x72
    'android_xhdpi': 'resources/icons/drawable-xhdpi/appicon.png', //96x96
});