// Ionic RecyclePedia App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'RecyclePedia' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'RecyclePedia.controllers' is found in controllers.js
angular.module('recyclepedia', ['ionic', 'recyclepedia.controllers', 'recyclepedia.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
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
      url: "/item/:materialName",
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

