angular.module('recyclepedia.controllers', [])

.controller('AppCtrl', function($scope) {
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.councils = [
    { title: 'Ashfield Council', id: 1 },
    { title: 'Brisbane City Council', id: 2 },
    { title: 'Lane Cove Council', id: 3 }
  ];
})

.controller('SearchCtrl', function($scope, $location) {
  $scope.materials = [
    {name: 'Bamboo' },
    {name: 'Branches' },
    {name: 'Flower Cuttings' },
    {name: 'Leaves' },
    {name: 'Large Stump' },
    {name: 'Weeds' },
    {name: 'Bamboo' }
  ];

  $scope.goTo = function(materialName) {
    $location.path('app/material/' + materialName);
  };
})

.controller('CategoriesCtrl', function($scope, CategoryService) {
  $scope.categories = [];

  CategoryService.getList().then(function (response) {
    debugger;
    angular.forEach(response.data.response, function(c) {
      c.color = randomColor();
      $scope.categories.push(c);
    });
  });

  var randomColor = function() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  };
})

.controller('MaterialCtrl', function($scope, $stateParams) {
  $scope.material = {
    name: $stateParams.materialName
  };

  $scope.categories = [
    { name: 'Garden', id: 1 },
    { name: 'Tullo', id: 2 },
    { name: 'Sai', id: 3 }
  ];
})
