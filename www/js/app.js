// Ionic RecyclePedia App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'RecyclePedia' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'RecyclePedia.controllers' is found in controllers.js
angular.module('recyclepedia', ['ionic', 'recyclepedia.controllers', 'recyclepedia.services'])

.run(function($ionicPlatform, $location) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }

    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      // StatusBar.styleDefault();
    }

    // console.log(window.ionic.Platform);
    // ionic.Platform.fullScreen(false, true);

    // write log to console
    ImgCache.options.debug = true;

    // increase allocated space on Chrome to 50MB, default was 10MB
    // ImgCache.options.chromeQuota = 50*1024*1024;

    ImgCache.init(function(){
      console.log('ImgCache init: success!');

      // from within this function you're now able to call other ImgCache methods
      // or you can wait for the ImgCacheReady event


      if(!angular.isUndefined(window.localStorage['council'])) {
        $location.path('/app/categories');
      }
    }, function(){
        console.log('ImgCache init: error! Check the log for errors');
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

  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })

    .state('app.search', {
      url: "/search",
      views: {
        'menuContent' :{
          templateUrl: "templates/search.html",
          controller: 'SearchCtrl'
        }
      }
    })

    .state('app.categories', {
      url: "/categories",
      views: {
        'menuContent' :{
          templateUrl: "templates/categories.html",
          controller: 'CategoriesCtrl'
        }
      }
    })

    .state('app.category', {
      url: "/category/:categoryName/:categoryId",
      views: {
        'menuContent' :{
          templateUrl: "templates/category.html",
          controller: 'CategoryCtrl'
        }
      }
    })

    .state('app.item', {
      url: "/item/",
      views: {
        'menuContent' :{
          templateUrl: "templates/item.html",
          controller: 'ItemCtrl'
        }
      }
    })

    .state('app.councils', {
      url: "/councils",
      views: {
        'menuContent' :{
          templateUrl: "templates/councils.html",
          controller: 'CouncilsCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/councils');
});

