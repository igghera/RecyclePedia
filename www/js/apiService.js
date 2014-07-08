angular.module('recyclepedia.services', [])
  .factory('ApiService', function($http, $q) {
    var factory = {};

    factory.selectedItem = null;

    factory.getCategories = function() {
      return $http.get('http://tramselcycer2013.herokuapp.com/api/2/categories');
    };

    factory.getCouncils = function() {
      return $http.get('http://tramselcycer2013.herokuapp.com/api/2/councils');
    };

    factory.getItemsForCategory = function(categoryId) {
      var councilId = angular.fromJson(window.localStorage['council']).id;
      return $http.get('http://tramselcycer2013.herokuapp.com/api/2/councils/'+ councilId +'/category/'+ categoryId +'/council_category_items');
    };

    return factory;
  });
