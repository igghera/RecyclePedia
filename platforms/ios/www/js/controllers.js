angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope) {
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.councils = [
    { title: 'Ashfield Council', id: 1 },
    { title: 'Brisbane City Council', id: 2 },
    { title: 'Lane Cove Council', id: 3 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('SearchCtrl', function($scope) {
  $scope.materials = [
    {name: 'Bamboo' },
    {name: 'Branches' },
    {name: 'Flower Cuttings' },
    {name: 'Leaves' },
    {name: 'Large Stump' },
    {name: 'Weeds' }
  ];
})
