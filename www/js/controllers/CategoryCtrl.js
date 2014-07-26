angular.module('recyclepedia.controllers')
.controller('CategoryCtrl', function($scope, $location, $stateParams, ApiService) {
  $scope.categoryName = $stateParams.categoryName;
  $scope.categoryId = $stateParams.categoryId;
  // Model for search input
  $scope.search = {
    item: {
      name: ''
    }
  };

  $scope.items = [];

  ApiService.getItemsForCategory($scope.categoryId).then(function (response) {
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