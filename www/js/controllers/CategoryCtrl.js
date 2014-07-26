angular.module('recyclepedia.controllers')
.controller('CategoryCtrl', function($scope, $location, $stateParams, ApiService, $ionicLoading) {
  $scope.categoryName = $stateParams.categoryName;
  $scope.categoryId = $stateParams.categoryId;
  // Model for search input
  $scope.search = {
    item: {
      name: ''
    }
  };

  // Display loading indicator
  $ionicLoading.show({
    template: 'Loading...'
  });

  $scope.items = [];

  ApiService.getItemsForCategory($scope.categoryId).then(function (response) {
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
    $location.path('app/item/');
  };

  $scope.clearSearchField = function() {
    $scope.search.item.name = '';
  };
})