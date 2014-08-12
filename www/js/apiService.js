angular.module('recyclepedia.services', [])
  .factory('ApiService', function($http, $q) {
    var factory = {};
    // var apiUrl = 'http://tramselcycer2013.herokuapp.com';
    var apiUrl = 'http://www.recyclesmart.com.au';

    factory.selectedItem = null;

    factory.getCategories = function() {
      // return $http.get(apiUrl + '/api/2/categories');

      var mockData = {
        data: {
          response: [
            {id: 1, title: 'Automotive'},
            {id: 2, title: 'Batteries'},
            {id: 3, title: 'Chemicals'},
            {id: 4, title: 'Constructions'},
            {id: 5, title: 'Household'},
            {id: 6, title: 'Electronics'},
            {id: 7, title: 'Food'},
            {id: 8, title: 'Garden'},
            {id: 9, title: 'Glass'},
            {id: 10, title: 'Metals'},
            {id: 11, title: 'Paper and Cardboard'},
            {id: 12, title: 'Plastics'}
          ]
        }
      };

      return $q.when(mockData);
    };

    factory.getCouncils = function() {
      var cachedCouncils = angular.fromJson(window.localStorage.councils);

      if(angular.isUndefined(cachedCouncils)) {
        console.log('loading councils from api');

        var promise = $http.get(apiUrl + '/api/2/councils').then(function(response) {
          window.localStorage.councils = angular.toJson(response.data.response);
        });

        return promise;
      } else {
        console.error('Using cached councils');
        return $q.when({
          data: {
            response: cachedCouncils
          }
        });
      }
    };

    factory.getItemsForCategory = function(categoryId) {
      var councilId = angular.fromJson(window.localStorage['council']).id;
      return $http.get(apiUrl + '/api/2/councils/'+ councilId +'/category/'+ categoryId +'/council_category_items');
    };

    factory.search = function(query) {
      // The timeout property of the http request takes a deferred value
      // that will abort the underying AJAX request if / when the deferred
      // value is resolved.
      var deferredAbort = $q.defer();
      var councilId = angular.fromJson(window.localStorage['council']).id;

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

    return factory;
  });
