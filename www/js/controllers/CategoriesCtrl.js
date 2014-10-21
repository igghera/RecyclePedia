angular.module('recyclepedia.controllers')
.controller('CategoriesCtrl', function($scope, ApiService, $location, $rootScope, $ionicPopup, $timeout,
$ionicPopover, $stateParams) {

  $scope.categories = [];
  $scope.items = [];

  $scope.search = {
    item: {
      name: ''
    }
  };

  $scope.noSearchResult = function() {
    return $scope.items.length === 0 && $scope.isLoading === false;
  };

  $scope.shouldShowCategories = function() {
    return $scope.search.item.name === '';
  };

  $scope.resizeTiles = function() {
    if(angular.isUndefined($rootScope.tilesHeight)) {
      var viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      $rootScope.tilesHeight = (viewportHeight - 103) / 4  + 'px';
    }

    $scope.tilesHeight = $rootScope.tilesHeight;
  };

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
    $timeout(function() {
      $location.path('app/item/');
    }, 300);

    // Save this item in history
    // var history = angular.fromJson(window.localStorage['history']) || [];
    // window.localStorage['history'] = history.push(item);
    // TODO: implement QUEUE
  };

  $scope.clearSearchField = function() {
    $scope.search.item.name = '';
  };

  var to;

  $scope.searchByString = function() {
    $scope.abortRequest();

    if($scope.search.item.name === '') {
      $scope.isLoading = false;
      return;
    }

    $scope.isLoading = true;

    var searchString = $scope.search.item.name.toLowerCase();

    (searchRequest = ApiService.search(searchString)).then(function(newItems) {
      $scope.isLoading = false;

      // Save the returned list
      var items = newItems.data.response;
      // Parse the list of categories for each item and make it a nice comma-separated-values list
      angular.forEach(items, function(item) {
        var categoryList = '';

        for(var i = 0, len = item.item.categories.length; i < len; i++) {
          var categoryName = item.item.categories[i].title;
          categoryList += categoryName;

          if(i < len - 1) {
            categoryList += ', ';
          }
        }

        item.categoryList = categoryList;
      });

      $scope.items = items;

      // Throttle event logging by 2 seconds to avoid logging stuff like "p" then "pi" then "piz" then "pizz" then "pizza"...
      $timeout.cancel(to);

      to = $timeout(function() {
        if(typeof analytics !== "undefined") {
          analytics.trackEvent('Search', 'Query', searchString);
        }
      }, 2000);
    });
  };

  $scope.gotoItemsList = function(index) {
    /**
    * document.activeElement returns the item on the page that has focus.
    * Here we check if the activeElement is the search field in the view, to avoid this unwanted behaviour:
    * On a device, whenever you focus on an inut field, the keyboard comes up and covers half the screen.
    * A user knows that if he taps the screen, outside of the keyboard, keyboard will hide.
    * But in our app, tapping outside of the keyboard you hit a category tile, therefore you will be taken to the category screen.
    * To avoid this, when user taps a category, we check if he did it to actually go to the category view or to just remove focus to the
    * search field and hide the keyboard.
    */

    var category = $scope.categories[index];

    if(!angular.element(document.activeElement).hasClass('js-searchField')) {
      if(typeof analytics !== "undefined") {
        analytics.trackEvent('Category', 'click', category.title);
      }

      $location.path('app/category/' + category.title + '/' + category.id);
    }
  };

  // Load categories

  ApiService.getCategories().then(function (response) {
    angular.forEach(response.data.response, function(c) {
      c.img = 'img/category-icons/130/'+ c.title.toLowerCase().split(' ').join('-') +'.png';
      $scope.categories.push(c);
    });
  }).catch(function(e) {
    // Advise the user that his connection is bad
    alert('Your internet connectivity is poor, please try again later');
  });

  // First popup that explains how categories (tiles) work
  $scope.categoriesPopup;

  $scope.openCategoriesPopup = function() {
    $scope.categoriesPopup = $ionicPopup.show({
      title: 'Categories view',
      template: '<p>Search for items by material. Select one of the following categories to find out which bin your item belongs to. </p>',
      scope: $scope,
      buttons: [{
        text: 'Next',
        type: 'button-positive',
        onTap: function(e) {
          return;
        }
      }]
    });

    $scope.categoriesPopup.then(function(res) {
     $scope.openStep1();
    });
  };

  // Load tutorial popover
  $ionicPopover.fromTemplateUrl('tutorial-categories-step-1.html', {
    scope: $scope,
    animation: 'fade-in',
    backdropClickToClose: false,
    popoverPosition: 'bottom'
  }).then(function(popover) {
    $scope.tutorialStep1 = popover;
  });

  $scope.openStep1 = function() {
    $scope.tutorialStep1.show(document.querySelector('.custom-search-icon'));
  };

  $scope.closeStep1 = function() {
    $scope.tutorialStep1.hide();
    window.localStorage.showTutorialCategoriesView = false;
  };

  $scope.startTutorial = function() {
    var showTutorialCategoriesView = window.localStorage.showTutorialCategoriesView;

    if(angular.isUndefined(showTutorialCategoriesView) || showTutorialCategoriesView == '' || showTutorialCategoriesView == 'true') {
      $scope.openCategoriesPopup();
    }
  };

  // Start tutorial after half a second
  $timeout(function() {
    $scope.startTutorial();
  }, 500);

  if(typeof analytics !== "undefined") {
    analytics.trackView("Categories view");
  }
})