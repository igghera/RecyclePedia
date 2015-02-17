angular.module('recyclepedia').directive('ngCache', function() {
  return {
    restrict: 'A',
    link: function(scope, el, attrs) {
      attrs.$observe('ngSrc', function(src) {
        ImgCache.isCached(src, function(path, success) {
          if (success) {
            // console.error('### USING CACHED FILE!!!!!');
            ImgCache.useCachedFile(el);
          } else {
            ImgCache.cacheFile(src, function() {
              // console.log('### Caching file');
              ImgCache.useCachedFile(el);
            });
          }
        });
      });
    }
  };
})

/**
* Bind to 'resize' event on window object and react adjusting the UI to the new
* size (e.g. on keyboard show/hide)
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

// Override anchor tags (links) to open them in an external browser instead of
// the wrapper one
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
          // Prevent regular links behaviour (opening in wrapper browser)
          e.preventDefault();
          // And open them in native browser instead
          window.open(encodeURI(url), '_system');
        });
      }
    }
  };
})
// Used in item view to center the big image. We use this instead of a CSS 
// background image (with background-position used to center) because we have
// to cache the image and imgCache needs
.directive('verticalCenter', function() {
  return {
    restrict: 'A',
    link: function(scope, element) {
      // When image is loaded we calculate real dimentions
      element.bind('load' , function(e) {
        var marginTop =  - element[0].offsetHeight / 2;
        // And we move it up by half its height to center it (combined with CSS
        // top property set to 50%)
        element[0].style.marginTop = marginTop + 'px';
      });
    }
  };
});
