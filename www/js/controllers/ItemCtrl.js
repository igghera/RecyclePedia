angular.module('recyclepedia.controllers')
.controller('ItemCtrl', function($scope, ApiService) {
  $scope.item = ApiService.selectedItem;

  $scope.showDescription = $scope.item.item.description.trim() != 'NO_DESCRIPTION';

  $scope.disposeInstructions = $scope.item.correct_bin.colour === 'no_bin' ?
  'Not disposable in a bin' :
  'Dispose in '+ $scope.item.correct_bin.colour +' bin';

  if($scope.item.item.avatar.avatar.medium.url !== null) {
    $scope.item.avatarUrl = 'http://www.recyclesmart.com.au' + $scope.item.item.avatar.avatar.medium.url;
    // ImgCache.cacheFile($scope.item.avatarUrl);
  }
})
