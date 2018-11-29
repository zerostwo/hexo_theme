(function() {
  var app = angular.module('WikipediaViewer', ['ngSanitize']);
  app.controller('searchController', function($scope, $http) {
    $scope.submited = false;
    $scope.previewResults = [];
    $scope.searchResults = [];
    $scope.logoClick = function() {
      if ($scope.submited) {
        $scope.submited = false;
        $scope.previewResults = [];
        $scope.searchResults = [];
        $('.search-box').animate({
          marginLeft: '-200px',
          top: '20%',
          left: '50%',
          width: '400px'

        }, 500);
        $('.logo').animate({
          fontSize: '45px',
        }, 500);
      } else {
        $scope.submit();
      }
    };
    $scope.submit = function() {
      if ($scope.query.length < 2)
        return;
      $scope.previewResults = [];
      $('.search-box').animate({
        marginLeft: '0px',
        top: '10px',
        left: '10px',
        width: '95%'

      }, 500);
      $('.logo').animate({
        fontSize: '25px',
      }, 500);
      $http
        .jsonp('//en.wikipedia.org/w/api.php?callback=JSON_CALLBACK&rawcontinue&format=json&action=query&list=search&srlimit=50&srsearch=' + $scope.query)
        .success(function(data) {
          $scope.previewResults = [];
          $scope.submited = true;
          $scope.searchResults = data.query.search;

        });
    };
    $scope.change = function() {
      if ($scope.query.length > 2) {
        $http.jsonp('//en.wikipedia.org/w/api.php?callback=JSON_CALLBACK&action=opensearch&format=json&limit=8&suggest&search=' + $scope.query)
          .success(function(data) {
            $scope.previewResults = data;
          });
      } else {
        $scope.previewResults = [];
      }
    };
  });
})();
$(document).ready(function() {
  $("input").focus();
});