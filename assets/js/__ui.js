(function() {
  "use strict";
  angular.module("app.tabs", ["ngSanitize"]).controller("tabsCtrl", ["$scope", "$sce", function($scope, $sce) {
      $scope.tabs = [];
      $scope.container = 'MainContainer';
      $scope.addElement = function(tab) {
          return tab.name + "<span class='iTabs-clean'></span>";
      }
      $scope.init = function() {
          $scope.tabs = []; // deleted all tabs
          $('#' + $scope.container).find('> .window').each(function(i, el) {
              if($(el).find('> .panel-heading').length > 0) {
                  var index = $(el).attr('id') || i;
                  $(el).find('> .panel-heading .window-toolbar .Minus').attr('onclick', 'minifyW(' + index + ')');
                  $(el).find('> .panel-heading .window-toolbar .Remove').attr('onclick', 'closeW(' + index + ')');
              }
              var tab = {
                  id: $(el).attr('id') || i,
                  target: el,
                  name:  $(el).find('> .panel-heading').length > 0 ? 
                            $(el).find('> .panel-heading').html() : "Không có tiêu đề",
                  isActive: !$(el).hasClass('isMinify'),
              };
              $scope.tabs.push(tab);
          })
      }.call(this);
      $scope.setActive = function(tab) {
          for(var i in $scope.tabs) {
              $scope.tabs[i].isActive = false;
              $($scope.tabs[i].target).addClass('isMinify');
          }
          tab.isActive = true;
          $(tab.target).removeClass('isMinify');
      }
      $scope.setMinus = function(index) {
          for(var i in $scope.tabs) {
              if(index == $scope.tabs[i].id) {
                  $scope.tabs[i].isActive = false;
                  $($scope.tabs[i].target).addClass('isMinify');
                  $scope.$apply();
                  break;
              }
          }
      }
      $scope.setClose = function(index) {
          for(var i in $scope.tabs) {
              if(index == $scope.tabs[i].id) {
                  $($scope.tabs[i].target).remove();
                  $scope.tabs.splice(i, 1);
                  if($scope.tabs[i] != undefined) {
                      $scope.tabs[i].isActive = true;
                      $($scope.tabs[i].target).removeClass('isMinify');
                  } else if ( $scope.tabs[i - 1] != undefined) {
                      $scope.tabs[i-1].isActive = true;
                      $($scope.tabs[i-1].target).removeClass('isMinify');
                  }
                  $scope.$apply();
                  break;
              }
          }
      }
      if($scope.tabs.length > 0)
          $scope.setActive($scope.tabs[0]);
  }]),
  function() {
        "use strict";
        angular.module("app", ["app.tabs"]).config([function() {
            
        }]).filter('NE', ['$sce', function($sce){
            return function(text) {
                return $sce.trustAsHtml(text);
            };
        }])
  }.call(this)
}).call(this);