/**
* Controller for Councils view.
* This view shows:
*
* - a list of councils the user can choose from
* - a search field to filter the list of councils
* - a footer with 4 "standard" bins configurations
*/
angular.module('recyclepedia.controllers')
.controller('CouncilsCtrl', function(
  $rootScope,
  $scope,
  ApiService,
  HopscotchService,
  $location,
  $ionicLoading,
  $timeout,
  $ionicPopup,
  $ionicScrollDelegate,
  $filter) {
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

  window.addEventListener('native.keyboardshow', keyboardShowHandler);
  window.addEventListener('native.keyboardhide', keyboardHideHandler);

  $scope.searchByString = function() {
    $ionicScrollDelegate.scrollBy(0, 0, false);
  };

  // Show or hide standard configs?
  $scope.shouldShowConfigs = true;

  $scope.focusOnSearch = function() {
    $scope.shouldShowConfigs = false;
    $ionicScrollDelegate.scrollBy(0, 0);
  };

  function keyboardHideHandler(e){
    $timeout(function() {
      $scope.shouldShowConfigs = true;
    }, 300);
  }

  function keyboardShowHandler(e){
    $timeout(function() {
      $scope.shouldShowConfigs = false;
    }, 0);

  }

  $scope.blurOnSearch = function() {
    $timeout(function() {
      $scope.shouldShowConfigs = true;
    }, 300);
    $ionicScrollDelegate.scrollBy(0, 0, true);
  };

  var orderBy = $filter('orderBy');

  $scope.order = function(predicate, reverse) {
    $scope.councils = orderBy($scope.councils, predicate, reverse);
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

    $scope.gotoCategoryView();
  };
  // When user clicks on a standard configuration, we save in localStorage and proceed to categories view
  $scope.saveStandardConfig = function(index, $event) {
    $event.stopPropagation();
    var standardConfig = $scope.standardConfigs[index];

    window.localStorage['council'] = angular.toJson(standardConfig);

    // Broadcast event to notify the menu that council has changed
    $rootScope.$broadcast('council-changed', standardConfig.name);

    if(typeof analytics !== "undefined") {
      analytics.trackEvent('Standard configuration', 'Selection', standardConfig.name);
    }

    $scope.gotoCategoryView();
  };

  $scope.gotoCategoryView = function() {
    $timeout(function() {
      $location.path('/app/categories/');
    }, 300);
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
    });

    $scope.order('name', false);

    // Start tutorial
    $timeout(function() {
      $scope.startTutorial();
    }, 100);
  }).catch(function(e) {
    // Advise the user that his connection is bad
    alert('Your internet connectivity is poor, please try again later ');
  }).finally(function() {
    // Hide loading view
    $ionicLoading.hide();
  });

  // Fired when user taps the CANCEL button next to the search field
  $scope.clearSearchField = function() {
    $scope.search.council.name = '';
  };

  $scope.openStep1 = function() {
    var tourCouncils = HopscotchService.getTourCouncils();
    hopscotch.startTour(tourCouncils);
  };

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
        type: 'button-positive'
      }]
    })
    .then(function(res) {
      $scope.openStep1();
    });
  };

  // Check localstorage for the flag to see whether the user has gone through the tutorial or not
  $scope.startTutorial = function() {
    var showTutorialCouncilView = window.localStorage.showTutorialCouncilView;

    if(angular.isUndefined(showTutorialCouncilView) || showTutorialCouncilView == '' || showTutorialCouncilView == 'true') {
      $scope.openWelcomePopup();
    }
  };

  if(typeof analytics !== "undefined") {
    analytics.trackView("Councils view");
  }
});