angular.module('recyclepedia.services', []).factory('CategoryService', function($http, $q) {
  var factory = {};

  factory.getList = function() {
    return $http.get('http://tramselcycer2013.herokuapp.com/api/2/categories');

    //var mockData = {"response":[{"id":1,"title":"Plastics","image":{"image":{"url":"/uploads/category/image/1/Screen_Shot_2014-06-10_at_6.28.25_pm.png"}}},{"id":2,"title":"Glass","image":{"image":{"url":"/uploads/category/image/2/Screen_Shot_2014-06-10_at_6.28.25_pm.png"}}},{"id":3,"title":"Metals","image":{"image":{"url":"/uploads/category/image/3/Screen_Shot_2014-06-10_at_6.28.25_pm.png"}}},{"id":4,"title":"Paper and cardboard","image":{"image":{"url":"/uploads/category/image/4/Screen_Shot_2014-06-10_at_6.28.25_pm.png"}}},{"id":5,"title":"Organics","image":{"image":{"url":"/uploads/category/image/5/Screen_Shot_2014-06-10_at_6.28.25_pm.png"}}},{"id":6,"title":"Polystyrene","image":{"image":{"url":"/uploads/category/image/6/Screen_Shot_2014-06-10_at_6.28.25_pm.png"}}},{"id":7,"title":"Common composite waste","image":{"image":{"url":"/uploads/category/image/7/Screen_Shot_2014-06-10_at_6.28.25_pm.png"}}},{"id":8,"title":"Other waste","image":{"image":{"url":"/uploads/category/image/8/Screen_Shot_2014-06-10_at_6.28.25_pm.png"}}},{"id":9,"title":"Food","image":{"image":{"url":"/uploads/category/image/9/Screen_Shot_2014-06-10_at_6.28.25_pm.png"}}},{"id":10,"title":"Garden","image":{"image":{"url":"/uploads/category/image/10/Screen_Shot_2014-06-10_at_6.28.25_pm.png"}}}],"count":10};
    // return $q.when(mockData);
  };

  return factory;
});
