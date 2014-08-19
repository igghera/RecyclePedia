/**
* Controller for Councils view.
* This view shows:
*
* - a list of councils the user can choose from
* - a search field to filter the list of councils
* - a footer with 4 "standard" bins configurations
*/
angular.module('recyclepedia.controllers')
.controller('CouncilsCtrl', function($rootScope, $scope, ApiService, $location, $ionicLoading, $ionicPopover, $timeout, $ionicPopup) {
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

    if(typeof analytics !== "undefined") {
      analytics.trackEvent('Council', 'Selection', council.name);
    }

    $location.path('/app/categories/');
  };
  // When user clicks on a standard configuration, we save in localStorage and proceed to categories view
  $scope.saveStandardConfig = function(index, $event) {
    $event.stopPropagation();
    var standardConfig = $scope.standardConfigs[index];

    console.log('Selecting', standardConfig.name);

    window.localStorage['council'] = angular.toJson(standardConfig);

    // Broadcast event to notify the menu that council has changed
    $rootScope.$broadcast('council-changed', standardConfig.name);

    if(typeof analytics !== "undefined") {
      analytics.trackEvent('Standard configuration', 'Selection', standardConfig.name);
    }

    $location.path('/app/categories/');
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

    console.dir($scope.standardConfigs);
  });

  // Fired when user taps the CANCEL button next to the search field
  $scope.clearSearchField = function() {
    $scope.search.council.name = '';
  };

  $scope.openStep1 = function() {
    $scope.tutorialStep1.show(document.querySelector('.custom-search-icon'));
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

  $scope.welcomePopup;

  $scope.openWelcomePopup = function() {
    $scope.welcomePopup = $ionicPopup.show({
      title: 'Welcome to RecyclePedia!',
      subTitle: 'A quick tour to get you started',
      template: '<p>This app will help you quickly and easily sort over 170 everyday household items. Use this app '
        + 'to search for those items you’re unsure '
        + 'how to dispose of and learn some interesting facts along the way. </p>',
      scope: $scope,
      buttons: [{
        text: '<b>Let\'s go!</b>',
        type: 'button-positive',
        onTap: function(e) {
          return;
        }
      }]
    });

    $scope.welcomePopup.then(function(res) {
     $scope.openStep1();
    });
  };

  // Load tutorial popovers
  $ionicPopover.fromTemplateUrl('tutorial-step-1.html', {
    scope: $scope,
    animation: 'fade-in',
    backdropClickToClose: false,
    popoverPosition: 'bottom'
  }).then(function(popover) {
    $scope.tutorialStep1 = popover;
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

  // Check localstorage for the flag to see whether the user has gone through the tutorial or not
  $scope.startTutorial = function() {
    var showTutorialCouncilView = window.localStorage.showTutorialCouncilView;

    if(angular.isUndefined(showTutorialCouncilView) || showTutorialCouncilView == '' || showTutorialCouncilView == 'true') {
      $scope.openWelcomePopup();
    }
  };

  //Cleanup the modal when we're done with it
  $scope.$on('$destroy', function() {
    $scope.tutorialStep1.remove();
    $scope.tutorialStep2.remove();
    $scope.tutorialStep3.remove();
  });

  // Start tutorial after half a second
  $timeout(function() {
    $scope.startTutorial();
  }, 500);

  if(typeof analytics !== "undefined") {
    analytics.trackView("Councils view");
  }
});