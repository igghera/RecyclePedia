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
