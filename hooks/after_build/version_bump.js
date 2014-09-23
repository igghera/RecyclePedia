#!/usr/bin/env node

/**
* This hook increments the the version number in our config.xml each time we build the project.
*/

// XML library for JS
var jsxml = require("node-jsxml");
var fs = require('fs');
var path = require('path');
// Some nice colors in the console
var colors = require('colors');
// The pointer to the config file
var configFile = path.join(process.cwd(), 'config.xml');
var fileContent;

// console.log("\n- AFTER_BUILD HOOK >>> Bumping version number                                       \n".inverse);

if (fs.existsSync(configFile)) {
  // console.log('OK config file exists');
  // Read file content and store it in a variable
  fs.readFile(configFile, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }

    fileContent = new jsxml.XML(data);

    var version = fileContent.attribute('version')._text;
    var versionCode = fileContent.attribute('versionCode')._text;

    console.log(version);
    // console.log(versionCode);

    //attr.setValue("newValue");
  });
} else {
  console.log('AFTER BUILD HOOK CANNOT FIND config.xml FILE');
}

// console.log("\n                                                                                    \n".inverse);