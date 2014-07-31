angular.module('recyclepedia').directive('ngCache', function() {
  return {
    restrict: 'A',
    link: function(scope, el, attrs) {
      attrs.$observe('ngSrc', function(src) {
        ImgCache.isCached(src, function(path, success) {
          if (success) {
            ImgCache.useCachedFile(el);
          } else {
            ImgCache.cacheFile(src, function() {
              ImgCache.useCachedFile(el);
            });
          }
        });
      });
    }
  };
})

/**
* Bind to 'resize' event on window object and react adjusting the UI to the new size (e.g. on keyboard show/hide)
*/
.directive('resizable', function($window) {
  return function($scope) {
    // On window resize => resize the app
    $scope.initializeWindowSize = function() {
      $scope.resizeTiles();
    };

    angular.element($window).bind('resize', function() {
        $scope.initializeWindowSize();
        $scope.$apply();
    });

    // Initiate the resize function default values
    $scope.initializeWindowSize();
  };
});