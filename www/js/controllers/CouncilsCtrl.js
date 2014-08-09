/**
* Controller for Councils view.
* This view shows:
*
* - a list of councils the user can choose from
* - a search field to filter the list of councils
* - a footer with 4 "standard" bins configurations
*/
angular.module('recyclepedia.controllers')
.controller('CouncilsCtrl', function($rootScope, $scope, ApiService, $location, $ionicLoading, $ionicPopover, $timeout) {
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

    // Broadcast event to notify the menu that council has changed
    $rootScope.$broadcast('council-changed', standardConfig.name);
    $location.path('/app/categories');
  };
  /**
  * Load list of councils from API
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
      // Hide loading view
      $ionicLoading.hide();
    });
  });
  // Fired when user taps the CANCEL button next to the search field
  $scope.clearSearchField = function() {
    $scope.search.council.name = '';
  };

  $scope.openStep1 = function() {
    $timeout(function() {
      $scope.tutorialStep1.show(document.querySelector('.custom-search-icon'));
    }, 500);
  };

  $scope.closeStep1 = function() {
    $scope.tutorialStep1.hide();
    $scope.openStep2();
  };

  $scope.openStep2 = function() {
    $scope.tutorialStep2.show(document.querySelector('.standard-configs'));
  };

  $scope.closeStep2 = function() {
    $scope.tutorialStep2.hide();
    $scope.openStep3();
  };

  $scope.openStep3 = function() {
    $scope.tutorialStep3.show(document.querySelector('.ion-navicon'));
  };

  $scope.closeStep3 = function() {
    $scope.tutorialStep3.hide();
    window.localStorage.showTutorialCouncilView = false;
  };

  // Load tutorial popovers
  $ionicPopover.fromTemplateUrl('tutorial-step-1.html', {
    scope: $scope,
    animation: 'fade-in',
    backdropClickToClose: false,
    popoverPosition: 'bottom'
  }).then(function(popover) {
    $scope.tutorialStep1 = popover;
    $scope.startTutorial();
  });

  $ionicPopover.fromTemplateUrl('tutorial-step-2.html', {
    scope: $scope,
    animation: 'fade-in',
    backdropClickToClose: false,
    popoverPosition: 'top'
  }).then(function(popover) {
    $scope.tutorialStep2 = popover;
  });

  $ionicPopover.fromTemplateUrl('tutorial-step-3.html', {
    scope: $scope,
    animation: 'fade-in',
    backdropClickToClose: false,
    popoverPosition: 'bottom'
  }).then(function(popover) {
    $scope.tutorialStep3 = popover;
  });

  $scope.startTutorial = function() {
    var showTutorialCouncilView = angular.fromJson(window.localStorage.showTutorialCouncilView);

    if(angular.isUndefined(showTutorialCouncilView) || showTutorialCouncilView === true) {
      $scope.openStep1();
    }
  };

  //Cleanup the modal when we're done with it
  $scope.$on('$destroy', function() {
    $scope.tutorialStep1.remove();
    $scope.tutorialStep2.remove();
    $scope.tutorialStep3.remove();
  });
});