angular.module('recyclepedia.controllers')
.controller('ItemCtrl', function($scope, ApiService, $timeout, $ionicPopup, $ionicPopover) {
  // Save selected item in scope
  $scope.item = ApiService.selectedItem;

  $scope.showDescription = $scope.item.item.description.trim() != 'NO_DESCRIPTION';

  $scope.disposeInstructions = $scope.item.correct_bin.colour === 'no_bin' ?
  'Not disposable in a bin' :
  'Dispose in '+ $scope.item.correct_bin.colour +' bin';

  if($scope.item.item.avatar.avatar.medium.url !== null) {
    $scope.item.avatarUrl = 'http://www.recyclesmart.com.au' + $scope.item.item.avatar.avatar.big.url;
    // ImgCache.cacheFile($scope.item.avatarUrl);
  }

  $scope.startTutorial = function() {
    var showTutorialItemView = window.localStorage.showTutorialItemView;

    if(angular.isUndefined(showTutorialItemView) || showTutorialItemView == '' || showTutorialItemView == 'true') {
      $scope.openItemPopup();
    }
  };

  // First popup that explains how categories (tiles) work
  $scope.itemPopup;

  $scope.openItemPopup = function() {
    $scope.itemPopup = $ionicPopup.show({
      title: 'Item detail view',
      // subTitle: 'A quick tour to get you started',
      template: '<p>Here you can find information on where to dispose of this item and some tips & tricks</p>',
      scope: $scope,
      buttons: [{
        text: 'Next',
        type: 'button-positive',
        onTap: function(e) {
          return;
        }
      }]
    });

    $scope.itemPopup.then(function(res) {
     $scope.openStep1();
    });
  };

  // Load tutorial popover
  $ionicPopover.fromTemplateUrl('tutorial-item-step-1.html', {
    scope: $scope,
    animation: 'fade-in',
    backdropClickToClose: false,
    popoverPosition: 'bottom'
  }).then(function(popover) {
    $scope.tutorialStep1 = popover;
  });

  $ionicPopover.fromTemplateUrl('tutorial-item-step-2.html', {
    scope: $scope,
    animation: 'fade-in',
    backdropClickToClose: false,
    popoverPosition: 'top'
  }).then(function(popover) {
    $scope.tutorialStep2 = popover;
  });

  $ionicPopover.fromTemplateUrl('tutorial-item-step-3.html', {
    scope: $scope,
    animation: 'fade-in',
    backdropClickToClose: false,
    popoverPosition: 'top'
  }).then(function(popover) {
    $scope.tutorialStep3 = popover;
  });

  $scope.openStep1 = function() {
    $scope.tutorialStep1.show(document.querySelector('.correct-bin-card'));
  };

  $scope.closeStep1 = function() {
    $scope.tutorialStep1.hide();
    $scope.openStep2();
  };

  $scope.openStep2 = function() {
    if($scope.item.item.description.trim() != 'NO_DESCRIPTION') {
      $scope.tutorialStep2.show(document.querySelector('.item-description'));
    } else {
      $scope.openStep3();
    }
  };

  $scope.closeStep2 = function() {
    $scope.tutorialStep2.hide();
    $scope.openStep3();
  };

  $scope.openStep3 = function() {
    if($scope.item.comments) {
      $scope.tutorialStep3.show(document.querySelector('.item-comments'));
    } else {
      $scope.finishTutorial();
    }
  };

  $scope.closeStep3 = function() {
    $scope.tutorialStep3.hide();
    $scope.finishTutorial();
  };

  $scope.finishTutorial = function() {
    window.localStorage.showTutorialItemView = false;
  };

  // Start tutorial after half a second
  $timeout(function() {
    $scope.startTutorial();
  }, 500);

  if(typeof analytics !== "undefined") {
    analytics.trackView("Item view");
  }
})
