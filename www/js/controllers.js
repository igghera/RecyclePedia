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
  $scope.items = [];
  $scope.search = {
    item: {
      name: ''
    }
  };

  var viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  var headerHeight = 44;
  $scope.tilesHeight = (viewportHeight - 88) / 4  + 'px';

  // Whether or not we are requesting data to the backend
  $scope.isLoading = false;

  /**
  * Hold the handle on the current request for data. Since we want to be able to abort the request, mid-stream,
  * we need to hold onto the request which will have the .abort() method on it.
  */
  var searchRequest = null;

  // I abort the current request (if its running).
  $scope.abortRequest = function() {
    return searchRequest && searchRequest.abort();
  };

  $scope.goToItemDetail = function(item) {
    ApiService.selectedItem = item;
    $location.path('app/item/' + item.item.name);

    // Save this item in history
    var history = angular.fromJson(window.localStorage['history']) || [];
    window.localStorage['history'] = history.push(item);
    // TODO: implement QUEUE
  };

  // end temporary

  $scope.clearSearchField = function() {
    $scope.search.item.name = '';
  };

  $scope.searchByString = function() {
    $scope.abortRequest();

    if($scope.search.item.name === '') {
      return;
    }

    $scope.isLoading = true;

    (searchRequest = ApiService.search($scope.search.item.name)).then(function(newItems) {
      $scope.isLoading = false;
      $scope.items = newItems.data.response;
    });
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
    */
    if(!angular.element(document.activeElement).hasClass('js-searchField')) {
      $location.path('app/category/' + category.title + '/' + category.id);
    }
  };

  ApiService.getCategories().then(function (response) {
    var i = 0;

    angular.forEach(response.data.response, function(c) {
      c.img = 'img/category-icons/'+ c.title.toLowerCase().split(' ').join('-') +'.png';
      $scope.categories.push(c);
      i++;
    });
  });
})

// Item detail

.controller('ItemCtrl', function($scope, $stateParams, ApiService) {
  $scope.item = ApiService.selectedItem;
  if($scope.item.item.avatar.avatar.url !== null) {
    $scope.item.avatarUrl = 'http://tramselcycer2013.herokuapp.com' + $scope.item.item.avatar.avatar.url;
    ImgCache.cacheFile('http://my-cdn.com/users/2/profile.jpg');
  }
})
