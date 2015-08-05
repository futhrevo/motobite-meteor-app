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
//TODO change this all access to particular ip address
//App.accessRule('http://192.168.2.12:3000/*');
App.accessRule('*');
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

App.launchScreens({
    'iphone_2x': 'resources/launch_screens/ios@2x~iphone_640x960.png', //640x960
    'iphone5': 'resources/launch_screens/ios-568h@2x~iphone_640x1136.png', //640x1136
    'iphone6': 'resources/launch_screens/ios-750@2x~iphone6-portrait_750x1334.png', //750x1334
    'iphone6p_portrait': 'resources/launch_screens/ios-1242@3x~iphone6s-portrait_1242x2208.png', //1242x2208
    'iphone6p_landscape': 'resources/launch_screens/ios-1242@3x~iphone6s-landscape_2208x1242.png', //2208x1242
    'ipad_portrait': 'resources/launch_screens/ios-Portrait~ipad_768x1024.png', //768x1024
    'ipad_portrait_2x': 'resources/launch_screens/ios-Portrait@2x~ipad_1536x2048.png', //1536x2048
    'ipad_landscape': 'resources/launch_screens/ios-Landscape~ipad_1024x768.png', //1024x768
    'ipad_landscape_2x': 'resources/launch_screens/ios-Landscape@2x~ipad_2048x1536.png', //2048x1536
    'android_ldpi_portrait': 'resources/launch_screens/android-drawable-ldpi-screen.png', //200x320
    'android_ldpi_landscape': 'resources/launch_screens/android-drawable-land-ldpi-screen.png', //320x200
    'android_mdpi_portrait': 'resources/launch_screens/android-drawable-mdpi-screen.png', //320x480
    'android_mdpi_landscape': 'resources/launch_screens/android-drawable-land-mdpi-screen.png', //480x320
    'android_hdpi_portrait': 'resources/launch_screens/android-drawable-hdpi-screen.png', //480x800
    'android_hdpi_landscape': 'resources/launch_screens/android-drawable-land-hdpi-screen.png', //800x480
    'android_xhdpi_portrait': 'resources/launch_screens/android-drawable-xhdpi-screen.png', //720x1280
    'android_xhdpi_landscape':	'resources/launch_screens/android-drawable-land-xhdpi-screen.png', //1280x720
});