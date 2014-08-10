#!/usr/bin/env node

/**
* A hook to automatically install a list cordova plugins.
* Plugins are listed below in the `pluginlist` array.
* A forEach loop iterates on the list and runs the `cordova plugin add` command, passing the name of the plugin as a parameter.
*/

// Provides nice colors in the console
var colors = require('colors');
// The folder we are working in
var rootdir = process.argv[2];

// add your plugins to this list--either the identifier, the filesystem location or the URL
var pluginlist = [
  "com.ionic.keyboard",
  "org.apache.cordova.console",
  "org.apache.cordova.device",
  "org.apache.cordova.statusbar",
  "org.apache.cordova.inappbrowser",
  "https://github.com/danwilson/google-analytics-plugin.git"
];

// No need to configure below

var fs = require('fs');
var path = require('path');
var sys = require('sys');
var exec = require('child_process').exec;

function puts(error, stdout, stderr) {
    sys.puts(stdout);
}

console.log(("\n- AFTER-PLATFORM-ADD HOOK - ("+ rootdir +"/install_plugins.js) - Installing plugins for each platform         \n").inverse);

pluginlist.forEach(function(plug) {
  exec("cordova plugin add " + plug, puts);
});

console.log("\n                                                                                                              \n".inverse);
