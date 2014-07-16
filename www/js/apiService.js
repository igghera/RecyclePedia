angular.module('recyclepedia.services', [])
  .factory('ApiService', function($http, $q) {
    var factory = {};

    factory.selectedItem = null;

    factory.getCategories = function() {
      // return $http.get('http://tramselcycer2013.herokuapp.com/api/2/categories');

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
      return $http.get('http://tramselcycer2013.herokuapp.com/api/2/councils');
    };

    factory.getItemsForCategory = function(categoryId) {
      var councilId = angular.fromJson(window.localStorage['council']).id;
      return $http.get('http://tramselcycer2013.herokuapp.com/api/2/councils/'+ councilId +'/category/'+ categoryId +'/council_category_items');
    };

    factory.search = function(query) {
      // The timeout property of the http request takes a deferred value
      // that will abort the underying AJAX request if / when the deferred
      // value is resolved.
      var deferredAbort = $q.defer();
      var councilId = angular.fromJson(window.localStorage['council']).id;

      var request = $http({
          method: "get",
          url: 'http://tramselcycer2013.herokuapp.com/api/2/councils/'+ councilId +'/council_items/search?q=' + query,
          timeout: deferredAbort.promise
      });

      var promise = request.then(function(response) {
          console.log('Success baby');
          return(response);
        }, function(response) {
          return($q.reject( "Something went wrong"));
        }
      );

      promise.abort = function() {
        deferredAbort.resolve();
      };

      promise.finally(function() {
        console.info( "Cleaning up object references." );
        promise.abort = angular.noop;
        deferredAbort = request = promise = null;
      });

      return(promise);
    };

    return factory;
  });
