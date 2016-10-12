(function() {
  "use strict";
  angular.module("app.tabs", ["ngSanitize"]).controller("tabsCtrl", ["$scope", "$sce", function($scope, $sce) {
      $scope.tabs = [];
      $scope.container = 'MainContainer';
      $scope.addElement = function() {
          return "<span class='iTabs-clean'></span>";
      }
      $scope.init = function() {
          $scope.tabs = []; // deleted all tabs
          $('#' + $scope.container).find('> .window').each(function(i, el) {
              if($(el).find('> .panel-heading').length > 0) {
                  var index = $(el).attr('id') || i;
                  var btnMinus = $(el).find('> .panel-heading .window-toolbar .Minus');
                  var btnRemove = $(el).find('> .panel-heading .window-toolbar .Remove');
                  btnMinus.attr('onclick', 'minifyW(' + index + ')')
                  btnRemove.attr('onclick', 'closeW(' + index + ')')
              }
              var tab = {
                  id: $(el).attr('id') || i,
                  target: el,
                  name:  $(el).find('> .panel-heading').length > 0 ? 
                            $(el).find('> .panel-heading').clone().html() : "Không có tiêu đề",
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
                  break;
              }
          }
      }
      $scope.setClose = function(index) {
          for(var i in $scope.tabs) {
              if(index == $scope.tabs[i].id) {
                  $($scope.tabs[i].target).remove();
                  $scope.tabs.splice(i, 1);
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
            
        }])
  }.call(this)
}).call(this);