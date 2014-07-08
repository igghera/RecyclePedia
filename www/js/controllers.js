angular.module('recyclepedia.controllers', [])

// Wrapper/menu

.controller('AppCtrl', function($scope) {})

// Councils

.controller('CouncilsCtrl', function($scope, ApiService, $location) {
  $scope.councils = [];

  $scope.saveCouncil = function(council) {
    window.localStorage['council'] = angular.toJson(council);
    $location.path('/app/categories');
  };

  ApiService.getCouncils().then(function (response) {
    angular.forEach(response.data.response, function(council) {
      council.logoUrl = 'http://tramselcycer2013.herokuapp.com' + council.logo.logo.url;
      $scope.councils.push(council);
    });
  });
})

// Materials

.controller('CategoryCtrl', function($scope, $location, $stateParams, ApiService) {
  $scope.categoryName = $stateParams.categoryName;
  $scope.categoryId = $stateParams.categoryId;

  $scope.items = [];

  ApiService.getItemsForCategory($scope.categoryId).then(function (response) {
    $scope.items = response.data.response;
  });

  $scope.goToItemDetail = function(item) {
    ApiService.selectedItem = item;
    $location.path('app/item/' + item.item.name);
  };
})

// Categories

.controller('CategoriesCtrl', function($scope, ApiService, $location) {
  $scope.categories = [];

  $scope.gotoItemsList = function(category) {
    $location.path('app/category/' + category.title + '/' + category.id);
  };

  ApiService.getCategories().then(function (response) {
    angular.forEach(response.data.response, function(c) {
      c.color = randomColor();
      $scope.categories.push(c);
    });
  });

  var randomColor = function() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  };
})

// Item detail

.controller('ItemCtrl', function($scope, $stateParams, ApiService) {
  $scope.item = ApiService.selectedItem;
  $scope.item.avatarUrl = 'http://tramselcycer2013.herokuapp.com' + $scope.item.item.avatar.avatar.url;
})
