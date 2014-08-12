#!/usr/bin/env node

/**
* This hook copies various resource files from our version control system directories into the appropriate platform specific location
* configure all the files to copy.  Key of object is the source file, value is the destination location.
* It's fine to put all platforms' icons and splash screen files here, even if we don't build for all platforms on each developer's box.
*/

var fs = require('fs');
var path = require('path');
// Provides nice colors in the console
var colors = require('colors');
// The folder we are working in
var rootdir = process.argv[2];

// List of assets to copy: {source: destination}
var filestocopy = [
  // Android - icons
  {"config/android/drawable/icon.png": "platforms/android/res/drawable/icon.png"},
  {"config/android/drawable-hdpi/icon.png": "platforms/android/res/drawable-hdpi/icon.png"},
  {"config/android/drawable-ldpi/icon.png": "platforms/android/res/drawable-ldpi/icon.png"},
  {"config/android/drawable-mdpi/icon.png": "platforms/android/res/drawable-mdpi/icon.png"},
  {"config/android/drawable-xhdpi/icon.png": "platforms/android/res/drawable-xhdpi/icon.png"},

  // Android - splashscreens
  {"config/android/drawable/splash.png": "platforms/android/res/drawable/splash.png"},
  {"config/android/drawable-hdpi/splash.png": "platforms/android/res/drawable-hdpi/splash.png"},
  {"config/android/drawable-ldpi/splash.png": "platforms/android/res/drawable-ldpi/splash.png"},
  {"config/android/drawable-mdpi/splash.png": "platforms/android/res/drawable-mdpi/splash.png"},
  {"config/android/drawable-xhdpi/splash.png": "platforms/android/res/drawable-xhdpi/splash.png"},

  // iOS - icons
  {"config/icons/ios/Icon-72.png": "platforms/ios/RecyclePedia/Resources/icons/icon-72.png"},
  {"config/icons/ios/Icon.png": "platforms/ios/RecyclePedia/Resources/icons/icon.png"},
  {"config/icons/ios/Icon@2x.png": "platforms/ios/RecyclePedia/Resources/icons/icon@2x.png"},
  {"config/icons/ios/Icon-72@2x.png": "platforms/ios/RecyclePedia/Resources/icons/icon-72@2x.png"},

  // iOS - splashscreens
  {"config/launch screens/ios/Default@2x~iphone.png": "platforms/ios/RecyclePedia/Resources/splash/Default@2x~iphone.png"},
  {"config/launch screens/ios/Default-568h@2x~iphone.png": "platforms/ios/RecyclePedia/Resources/splash/Default-568h@2x~iphone.png"},
  {"config/launch screens/ios/Default~iphone.png": "platforms/ios/RecyclePedia/Resources/splash/Default~iphone.png"},
  {"config/launch screens/ios/Default-Portrait~ipad.png": "platforms/ios/RecyclePedia/Resources/splash/Default-Portrait~ipad.png"},
  {"config/launch screens/ios/Default-Portrait@2x~ipad.png": "platforms/ios/RecyclePedia/Resources/splash/Default-Portrait@2x~ipad.png"},

  {"config/launch screens/ios/Default-Landscape~ipad.png": "platforms/ios/RecyclePedia/Resources/splash/Default-Landscape~ipad.png"},
  {"config/launch screens/ios/Default-Landscape@2x~ipad.png": "platforms/ios/RecyclePedia/Resources/splash/Default-Landscape@2x~ipad.png"},


  // not working
  {"config/launch screens/ios/Default-1024h@2x~ipad.png": "platforms/ios/RecyclePedia/Resources/splash/Default-1024h@2x~ipad.png"},

  // iOS7 - icons
  {"config/icons/ios7/Icon.png": "platforms/ios/RecyclePedia/Resources/icons/icon.png"},
  {"config/icons/ios7/Icon@2x.png": "platforms/ios/RecyclePedia/Resources/icons/icon@2x.png"},
  {"config/icons/ios7/Icon-60@2x.png": "platforms/ios/RecyclePedia/Resources/icons/icon-60@2x.png"},
  {"config/icons/ios7/Icon-72.png": "platforms/ios/RecyclePedia/Resources/icons/icon-72.png"},
  {"config/icons/ios7/Icon-72@2x.png": "platforms/ios/RecyclePedia/Resources/icons/icon-72@2x.png"},
  {"config/icons/ios7/Icon-76.png": "platforms/ios/RecyclePedia/Resources/icons/icon-76.png"},
  {"config/icons/ios7/Icon-76@2x.png": "platforms/ios/RecyclePedia/Resources/icons/icon-76@2x.png"},
  {"config/icons/ios7/Icon-Small.png": "platforms/ios/RecyclePedia/Resources/icons/icon-Small.png"},
  {"config/icons/ios7/Icon-Small@2x.png": "platforms/ios/RecyclePedia/Resources/icons/icon-Small@2x.png"},
  {"config/icons/ios7/Icon-40.png": "platforms/ios/RecyclePedia/Resources/icons/icon-40.png"},
  {"config/icons/ios7/Icon-40@2x.png": "platforms/ios/RecyclePedia/Resources/icons/icon-40@2x.png"},
  {"config/icons/ios7/Icon-50.png": "platforms/ios/RecyclePedia/Resources/icons/icon-50.png"},
  {"config/icons/ios7/Icon-50@2x.png": "platforms/ios/RecyclePedia/Resources/icons/icon-50@2x.png"}
];

console.log("\n- AFTER-PREPARE HOOK >>> Copying icons and splash screens for each platform                                       \n".inverse);

filestocopy.forEach(function(obj) {
  Object.keys(obj).forEach(function(key) {
    var val = obj[key];
    var srcfile = path.join(rootdir, key);
    var destfile = path.join(rootdir, val);
    var destdir = path.dirname(destfile);

    console.log((">>> Copying "+ srcfile +" to "+ destfile).green);

    if (fs.existsSync(srcfile) && fs.existsSync(destdir)) {
      fs.createReadStream(srcfile).pipe(fs.createWriteStream(destfile));
    }
  });
});

console.log("\n                                                                                                                  \n".inverse);
