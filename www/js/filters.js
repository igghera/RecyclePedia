/**
* Allows to divide an array into 'rows' so we can display its items
* into a grid
* We use it for categories tiles in the categories page
*/
angular.module('recyclepedia.controllers')
.filter('partition', function() {
  var cache = {};
  var filter = function(arr, size) {
    if (!arr) { return; }
    var newArr = [];

    for (var i = 0; i < arr.length; i += size) {
      newArr.push(arr.slice(i, i + size));
    }

    var arrString = JSON.stringify(arr);
    var fromCache = cache[arrString+size];

    if (JSON.stringify(fromCache) === JSON.stringify(newArr)) {
      return fromCache;
    }

    cache[arrString + size] = newArr;
    return newArr;
  };
  return filter;
})

.filter('capitalize', function() {
  return function(stringToFormat) {
    var firstLetter = stringToFormat.substring(0, 1);
    var restofString = stringToFormat.substring(1);

    return firstLetter.toUpperCase() + restofString.toLowerCase();
  };
});