angular.module('recyclepedia.services')
.factory('HopscotchService', function() {

  // Tour for the categories page
  var categoriesTour = function() {
    return {
      id: 'tour-categories',
      onEnd: function() {
        window.localStorage.showTutorialCategoriesView = false;
      },
      steps: [{
        title: 'Quick search',
        content: 'To quickly find an item, simply <b>start typing the item name here and choose among suggestions</b>.',
        target: '.search-icon-wrapper',
        placement: 'bottom'
      }]
    };
  };

  // Tour for the councils page
  var councilsTour = function() {
    return {
      id: 'tour-councils',
      onEnd: function() {
        window.localStorage.showTutorialCouncilView = false;
      },
      steps: [{
        title: 'Council search',
        content: 'Type in your Council or select from the list of Councils.',
        target: '.search-icon-wrapper',
        placement: 'right'
      }, {
        title: 'Bin configurations',
        content: 'If you can&apos;t find your Council in the list then simply select which of the following bin configurations apply to you.',
        target: '.standard-configs',
        placement: 'top',
        xOffset: 'center',
        arrowOffset: 'center'
      }, {
        title: 'Navigation menu',
        content: 'Tap this button to activate the navigation menu and select "Change Council" to return to this page at anytime.',
        target: '.ion-navicon',
        placement: 'left'
      }]
    };
  };

  return {
    getTourCouncils: councilsTour,
    getTourCategories: categoriesTour
  };
});