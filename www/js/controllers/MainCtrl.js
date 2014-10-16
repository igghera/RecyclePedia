angular.module('recyclepedia.controllers', [])

// Wrapper/menu

.controller('AppCtrl', function($rootScope, $scope, $location) {
  var selectedCouncil = angular.fromJson(window.localStorage['council']);

  $rootScope.selectedCouncil = angular.isUndefined(selectedCouncil) ? '' : selectedCouncil.name;

  // Listen for event: council-changed
  $scope.$on('council-changed', function(event, newCouncil) {
    $rootScope.selectedCouncil = newCouncil;
  });

  $scope.gotoCouncils = function() {
    $location.path('app/councils/');
  };

  $scope.gotoCategories = function() {
    if($rootScope.selectedCouncil !== '') {
      $location.path('app/categories/');
    } else {
      alert('Please select a council to start');
    }
  };
})
