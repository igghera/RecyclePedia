angular.module('recyclepedia.controllers')
.controller('ItemCtrl', function($scope, ApiService, $timeout, $ionicPopup, $ionicPopover) {
  // Save selected item in scope
  $scope.item = ApiService.selectedItem;

  // Whether to show or not item desc, comments and "fun facts"
  $scope.showDescription = $scope.item.item.description.trim() != 'NO_DESCRIPTION';
  $scope.showComments = $scope.item.comments.trim() != '';
  $scope.showFacts = $scope.item.item.facts.trim() != '';

  $scope.disposeInstructions = $scope.item.correct_bin.colour === 'no_bin' ?
  'Not disposable in a bin' :
  'Dispose in '+ $scope.item.correct_bin.colour +' bin';

  if($scope.item.item.avatar.avatar.medium.url !== null) {
    $scope.item.avatarUrl = 'http://www.recyclesmart.com.au' + $scope.item.item.avatar.avatar.big.url;
    // ImgCache.cacheFile($scope.item.avatarUrl);
  }

  if(typeof analytics !== "undefined") {
    analytics.trackView("Item view");
  }
})
