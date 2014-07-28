angular.module('recyclepedia.controllers')
.controller('CouncilsCtrl', function($rootScope, $scope, ApiService, $location, $ionicLoading) {
  // Our 4 standard configurations (quite hard-coded)
  $scope.standardConfigs = [];
  // Display loading indicator
  $ionicLoading.show({
    template: 'Loading...'
  });
  // Model for search input
  $scope.search = {
    council: {
      name: ''
    }
  };
  // List of active councils that will be filled up by API request
  $scope.councils = [];
  // When user clicks on a council in the list, we save in localStorage and proceed to categories view
  $scope.saveCouncil = function(council) {
    window.localStorage['council'] = angular.toJson(council);

    // Broadcast event to notify the menu that council has changed
    $rootScope.$broadcast('council-changed', council.name);
    $location.path('/app/categories');
  };
  // When user clicks on a standard configuration, we save in localStorage and proceed to categories view
  $scope.saveStandardConfig = function(index, $event) {
    $event.stopPropagation();
    var standardConfig = $scope.standardConfigs[index];
    window.localStorage['council'] = angular.toJson(standardConfig);
    console.log(standardConfig);

    // Broadcast event to notify the menu that council has changed
    $rootScope.$broadcast('council-changed', standardConfig.name);
    $location.path('/app/categories');
  };

  /**
  * Load list of councils list from API
  */
  ApiService.getCouncils().then(function (response) {
    angular.forEach(response.data.response, function(council) {
      // If council is actually a configuration we hide if from list and put it in the footer

      if(council.name.indexOf('+') < 0) {
        council.logoUrl = 'http://recyclesmart.com.au' + council.logo.logo.url;
        $scope.councils.push(council);
      } else {
        $scope.standardConfigs.push(council);
      }

      $ionicLoading.hide();
    });
  });

  $scope.clearSearchField = function() {
    $scope.search.council.name = '';
  };
})