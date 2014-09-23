/**
* Controller for Category view.
*/
angular.module('recyclepedia.controllers')
.controller('CategoryCtrl', function($scope, $location, $stateParams, ApiService, $ionicLoading, $timeout) {
  $scope.categoryName = $stateParams.categoryName;
  $scope.categoryId = $stateParams.categoryId;
  // Model for search input
  $scope.search = {
    item: {
      name: ''
    }
  };

  $scope.items = [];

  var showLoadingView = true;

  $timeout(function(){
    if(showLoadingView === true) {
      // Display loading indicator
      $ionicLoading.show({
        template: 'Loading...'
      });
    }
  }, 300);

  ApiService.getItemsForCategory($scope.categoryId).then(function (response) {
    // Don't show loading view after this
    showLoadingView = false;
    // If loading view is visible, hide it
    $ionicLoading.hide();
    var items = response.data.response;

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
  });

  $scope.goToItemDetail = function(item) {
    ApiService.selectedItem = item;

    if(typeof analytics !== "undefined") {
      analytics.trackEvent('Item', 'click', item.item.name);
    }

    $location.path('app/item/');
  };

  $scope.clearSearchField = function() {
    $scope.search.item.name = '';
  };

  if(typeof analytics !== "undefined") {
    analytics.trackView("Category view");
  }
})