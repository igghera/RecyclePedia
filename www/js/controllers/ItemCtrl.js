angular.module('recyclepedia.controllers')
.controller('ItemCtrl', function($scope, ApiService, $timeout, $ionicPopup, $ionicPopover) {
  // Save selected item in scope
  $scope.item = ApiService.selectedItem;

  // Renames from "red bin" to "general waste bin" etc...
  var renameBins = function(originalBinName) {
    switch(originalBinName) {
      case('red'):
        return 'General waste';
      break;
      case('blue'):
        return 'Paper and cardboard recycling';
      break;
      case('yellow'):
        return 'Yellow recycling';
      break;
      case('green'):
        return 'Green waste';
      break;
    }
  }

  // Whether to show or not item desc, comments and "fun facts"
  $scope.showDescription = $scope.item.item.description.trim() != 'NO_DESCRIPTION';
  $scope.showComments = $scope.item.comments.trim() != '';
  $scope.showFacts = $scope.item.item.facts.trim() != '';

  $scope.disposeInstructions = $scope.item.correct_bin.colour === 'no_bin' ?
  'Not disposable in a bin' :
  'Dispose in '+ renameBins($scope.item.correct_bin.colour) +' bin';

  if($scope.item.item.avatar.avatar.medium.url !== null) {
    $scope.item.avatarUrl = 'http://www.recyclesmart.com.au' + $scope.item.item.avatar.avatar.big.url;
    // ImgCache.cacheFile($scope.item.avatarUrl);
  }

  if(typeof analytics !== "undefined") {
    analytics.trackView("Item view");
  }
})
