// Ionic RecyclePedia App

angular.module('recyclepedia', [
  'ionic', 
  'recyclepedia.controllers', 
  'recyclepedia.services'
])

 // register the interceptor as a service
.factory('myHttpInterceptor', function($q) {
  return {
   'responseError': function(rejection) {
      // do something on error
      return $q.reject(rejection);
    }
  };
})

.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('myHttpInterceptor');
}])

.run(function($ionicPlatform, $location, $timeout) {
  if(!angular.isUndefined(window.localStorage['council'])) {
    $location.path('/app/categories/');
  }

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default on iOS - com.ionic.keyboard required
    if(window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    // Style status bar in iOS7 - org.apache.cordova.statusbar required
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    if(typeof analytics !== "undefined") {
      analytics.startTrackerWithId("UA-39582079-4");
    }

    // write log to console
    // ImgCache.options.debug = true;
    // increase allocated space on Chrome to 50MB, default was 10MB
    // ImgCache.options.chromeQuota = 50 * 1024 * 1024;

    ImgCache.init(function() {
        // console.log('ImgCache init: success!');
        // from within this function you're now able to call other ImgCache methods
        // or you can wait for the ImgCacheReady event
      }, function(){
          // console.log('ImgCache init: error! Check the log for errors');
      });
  });
})
/*
// Workaround for Windows Phone, from http://www.stephenpauladams.com/articles/angularjs-cordova-windows-phone-quirk/
.config(function( $compileProvider ) {
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|ghttps?|ms-appx|x-wmapp0):/);
  // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
})
*/
.config(function($stateProvider, $urlRouterProvider, $compileProvider) {
  // Workaround for Windows Phone #2 (thanks Microsoft)
  // from http://forum.ionicframework.com/t/image-displaying-issue-with-ng-repeat/3768/9
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(img\/|https?|file|blob|cdvfile):|data:image\//);

  // Manually force keyboard to close. This is because sometimes on iOS keyboard stays open...
  var closeKeyboard = function() {
    if(window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.close();
    }
  };

  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })

    .state('app.categoriesQuery', {
      url: "/categories/:query",
      views: {
        'menuContent' :{
          templateUrl: "templates/categories.html",
          controller: 'CategoriesCtrl',
          reloadOnSearch: false
        }
      },
      onEnter: closeKeyboard
    })

    .state('app.category', {
      url: "/category/:categoryName/:categoryId",
      views: {
        'menuContent' :{
          templateUrl: "templates/category.html",
          controller: 'CategoryCtrl'
        }
      },
      onEnter: closeKeyboard
    })

    .state('app.item', {
      url: "/item/",
      views: {
        'menuContent' :{
          templateUrl: "templates/item.html",
          controller: 'ItemCtrl'
        }
      },
      onEnter: closeKeyboard
    })

    .state('app.councils', {
      url: "/councils",
      views: {
        'menuContent' :{
          templateUrl: "templates/councils.html",
          controller: 'CouncilsCtrl'
        }
      },
      onEnter: closeKeyboard
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/councils');
});
