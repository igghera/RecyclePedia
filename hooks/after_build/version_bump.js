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
  // Read file content and store it in a variable
  fs.readFile(configFile, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }

    fileContent = new jsxml.XML(data);

    var versionNode = fileContent.attribute('version'),
      version = versionNode._text,
      versioneCodeNode = fileContent.attribute('versionCode'),
      versionCode = parseInt(versioneCodeNode._text, 10),
      versionArray = version.split('.'),
      minorVersion = versionArray[versionArray.length - 1],
      newVersion = versionCode + 1;

    versionArray[versionArray.length - 1] = parseInt(minorVersion, 10) + 1

    // Update XML values
    versionNode.setValue(versionArray.join('.'));
    versioneCodeNode.setValue(newVersion);

    var newXml = fileContent.toXMLString();

    fs.writeFile(configFile, newXml, function (err) {
      if (err) return console.log(err);
      console.log(version);
    });
  });
} else {
  console.log('AFTER BUILD HOOK CANNOT FIND config.xml FILE');
}

// console.log("\n                                                                                    \n".inverse);