angular.module('recyclepedia.controllers', [])

// Wrapper/menu

.controller('AppCtrl', function($scope) {
  var selectedCouncil = angular.fromJson(window.localStorage['council']);

  $scope.selectedCouncil = angular.isUndefined(selectedCouncil) ? '' : selectedCouncil.name;
  // Listen for event: council-changed
  $scope.$on('council-changed', function(event, newCouncil) {
    $scope.selectedCouncil = newCouncil;
  });
})

// Councils

.controller('CouncilsCtrl', function($rootScope, $scope, ApiService, $location, $ionicLoading) {
  $ionicLoading.show({
    template: 'Loading...'
  });

  $scope.councils = [];

  $scope.saveCouncil = function(council) {
    window.localStorage['council'] = angular.toJson(council);

    // Broadcast event to notify the menu that council has changed
    $rootScope.$broadcast('council-changed', council.name);
    $location.path('/app/categories');
  };

  ApiService.getCouncils().then(function (response) {
    angular.forEach(response.data.response, function(council) {
      council.logoUrl = 'http://tramselcycer2013.herokuapp.com' + council.logo.logo.url;
      $scope.councils.push(council);
      $ionicLoading.hide();
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
  $scope.search = {
    item: {
      name: ''
    }
  };

  // temporary

  $scope.items = [];

  ApiService.getItemsForCategory(1).then(function (response) {
    $scope.items = response.data.response;
  });

  $scope.goToItemDetail = function(item) {
    ApiService.selectedItem = item;
    $location.path('app/item/' + item.item.name);
  };

  // end temporary

  $scope.clearSearchField = function() {
    $scope.search.item.name = '';
  };

  $scope.gotoItemsList = function(category) {
    /**
    * document.activeElement returns the item on the page that has focus.
    * Here we check if the activeElement is the search field in the view, to avoid this unwanted behaviour:
    * On a device, whenever you focus on an inut field, the keyboard comes up and covers half the screen.
    * A user knows that if he taps the screen, outside of the keyboard, keyboard will hide.
    * But in our app, tapping outside of the keyboard you hit a category tile, therefore you will be taken to the category screen.
    * To avoid this, when user taps a category, we check if he did it to actually go to the category view or to just remove focus to the
    * search field and hide the keyboard.
    *
    * TODO: Test on device
    */
    if(!angular.element(document.activeElement).hasClass('js-searchField')) {
      $location.path('app/category/' + category.title + '/' + category.id);
    }
  };

  var bgColors = [
    '#dc5629',
    '#e17a25',
    '#f0b31d',
    '#f9e607',
    '#87ba3b',
    '#14a88b',
    '#278fc6',
    '#0071bc',
    '#6d4e88',
    '#9a437e',
    '#cc427d',
    '#fd625e',
    '#dc5629',
    '#e17a25',
    '#f0b31d'
  ];

  ApiService.getCategories().then(function (response) {
    var i = 0;

    angular.forEach(response.data.response, function(c) {
      c.color = bgColors[i];
      $scope.categories.push(c);
      i++;
    });
  });
})

// Item detail

.controller('ItemCtrl', function($scope, $stateParams, ApiService) {
  $scope.item = ApiService.selectedItem;
  $scope.item.avatarUrl = 'http://tramselcycer2013.herokuapp.com' + $scope.item.item.avatar.avatar.url;
})
