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
})

.directive('compile', ['$compile', function ($compile) {
  return function(scope, element, attrs) {
    scope.$watch(
      function(scope) {
        return scope.$eval(attrs.compile);
      },
      function(value) {
        element.html(value);
        $compile(element.contents())(scope);
      }
   )};
}])

// Override anchor tags (links) to open them in an external browser instead of the wrapper one
.directive('a', function () {
  return {
    restrict: 'E',
    link: function (scope, element, attrs) {
      if ( !attrs.href ){
        return;
      }
      var externalRe = new RegExp("^(http|https)://");
      var url = attrs.href;

      if(externalRe.test(url)) {
        element.on('click',function(e) {
          // Prevent regular links behaviour (that is, opening in wrapper browser)
          e.preventDefault();
          // And open them in native browser instead
          window.open(encodeURI(url), '_system');
        });
      }
    }
  };
});
