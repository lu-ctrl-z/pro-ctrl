(function() {
  "use strict";
  angular.module("app.tabs", ["ngSanitize"]).controller("tabsCtrl", ["$scope", "$sce", function($scope, $sce) {
      $scope.tabs = [];
      $scope.container = 'MainContainer';
      $scope.s2html = function(string) {
          return $sce.trustAsHtml(string);
      }
      $scope.init = function() {
          $scope.tabs = []; // deleted all tabs
          $('#' + $scope.container).find('> .window').each(function(i, el) {
              var tab = {
                  id: $(el).attr('id') || i,
                  name:  $(el).find('> .panel-heading strong').length > 0 ? 
                            $(el).find('> .panel-heading strong').html() : "Không có tiêu đề",
                  isActive: !$(el).hasClass('isMinify'),
              };
              tab.name += "<span class='iTabs-clean'></span>";
              $scope.tabs.push(tab);
          })
      }.call(this);
  }]),
  function() {
        "use strict";
        angular.module("app", ["app.tabs"]).config([function() {
            
        }])
  }.call(this)
}).call(this);