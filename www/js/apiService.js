/**
* A service to interact with the API layer.
* This factory exposes some methods to seamlessly interact with our backend, and implements some logic for caching data.
* Cache is saved in localStorage, and cache expiry is set to 7 days at the moment (see var cacheLimit) and each time we
* need to request some data we first check the following conditions:
*
* - Do we have this data in cache?
* - If yes, is this data older than the cache expiry limit (7 days)?
*
* In case it's older than 7 days, we load a fresh copy from the API, otherwise we use the cached version
*
* Public methods:
*
* - getCategories: retrieve a list of categories from the categories API
* - getCouncils: retrieve a list of councils from the councils API
* - getItemsForCategory: retrieve a list of items that belong to a particular category
* - search: query the database for a certain string and retrieve a list of items that match the search criteria
*/
angular.module('recyclepedia.services', [])
  .factory('ApiService', function($http, $q) {
    var factory = {};
    // var apiUrl = 'http://tramselcycer2013.herokuapp.com';
    var apiUrl = 'http://www.recyclesmart.com.au';
    // The amount of time we want to cache our data for. Expressed in milliseconds
    var cacheLimit = 1000 * 60 * 60 * 24 * 7; // 1 week: 1 second * 60 = 1 minute * 60 = 1 hour * 24 = 1 day * 7 = 1 week
    // Here we store the currently selected item so that it's available to several controllers
    factory.selectedItem = null;

    // Get categories. See getItemsForCategory for more comments
    factory.getCategories = function() {
      var cachedCategories = angular.fromJson(window.localStorage.categories);
      var lastLoadedCategories = parseInt(window.localStorage.lastLoadedCategories, 10);

      // If there's no category in cache, or cache is older than 7 days, we reload categories list from API
      if(angular.isUndefined(cachedCategories) || isCacheExpired(lastLoadedCategories)) {
        return $http.get(apiUrl + '/api/2/categories').then(function(response) {
          window.localStorage.categories = angular.toJson(response.data.response);
          window.localStorage.lastLoadedCategories = new Date().getTime();
          return response;
        });
      } else {
        // Otherwise we use cached copy of categories list
        return $q.when({
          data: {
            response: cachedCategories
          }
        });
      }
    };

    factory.getCouncils = function() {
      var cachedCouncils = angular.fromJson(window.localStorage.councils);
      var lastLoadedCouncils = parseInt(window.localStorage.lastLoadedCouncils, 10);

      // If there's no council in cache, or cache is older than 7 days, we reload councils list from API
      if(angular.isUndefined(cachedCouncils) || isCacheExpired(lastLoadedCouncils)) {
        return $http.get(apiUrl + '/api/2/councils').then(function(response) {
          window.localStorage.councils = angular.toJson(response.data.response);
          window.localStorage.lastLoadedCouncils = new Date().getTime();
          return response;
        });
      } else {
        // Otherwise we use cached copy of councils list
        return $q.when({
          data: {
            response: cachedCouncils
          }
        });
      }
    };
    /**
    * Get list of items for a certain category
    * @param {Number} categoryID the id of the category we want items for
    */
    factory.getItemsForCategory = function(categoryId) {
      // Retrieve the ID of selected council from local storage
      var councilId = angular.fromJson(window.localStorage.council).id;
      // Define a combination of councilId + categoryId to define the variable where we are going to store our items
      var storageName = councilId + '/' + categoryId;
      // Load the content from localStorage, if any
      var cachedItems = angular.fromJson(window.localStorage[storageName]);
      // If there's data in cache, or cache is older than 7 days, we reload items list from API
      if(angular.isUndefined(cachedItems) || isCacheExpired(cachedItems.lastLoaded)) {
        // Return the promise object so that controllers can attach hanlder functions to it
        return $http.get(apiUrl + '/api/2/councils/'+ councilId +'/category/'+ categoryId +'/council_category_items')
        // And handle caching logic here in the service, which is better than handling it in a controller
        .then(function(response) {
          // Cache an object containing both `data` and `lastLoaded`, in JSON format
          window.localStorage[storageName] = angular.toJson({
            data: response.data.response,
            lastLoaded: new Date().getTime()
          });
          return response;
        });
      } else {
        // Otherwise we use cached copy of items list for this category and council
        return $q.when({
          data: {
            response: cachedItems.data
          }
        });
      }
    };

    factory.search = function(query) {
      // The timeout property of the http request takes a deferred value
      // that will abort the underying AJAX request if / when the deferred
      // value is resolved.
      var deferredAbort = $q.defer();
      var councilId = angular.fromJson(window.localStorage.council).id;

      var request = $http({
          method: "get",
          url: apiUrl + '/api/2/councils/'+ councilId +'/council_items/search?q=' + query,
          timeout: deferredAbort.promise
      });

      var promise = request.then(function(response) {
          return(response);
        }, function(response) {
          return($q.reject( "Something went wrong"));
        }
      );

      promise.abort = function() {
        deferredAbort.resolve();
      };

      promise.finally(function() {
        promise.abort = angular.noop;
        deferredAbort = request = promise = null;
      });

      return(promise);
    };
    /**
    * Returns true if the date received as a parameter is older than the cache limit (currently 1 week) from now
    * @param {timestamp} date The date we have cached some data and we want to check whether it's expired or not
    * @returns true if `date` is older than 7 days from now
    */
    function isCacheExpired(date) {
      return new Date().getTime() - date > cacheLimit;
    }

    return factory;
  });
