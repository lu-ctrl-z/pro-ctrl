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
      angular.module("app.tables", ['ngStorage']).controller("tableCtrl", ["$scope", "$filter", "$localStorage", function($scope, $filter, $localStorage) {
          var init;
          $scope.config = {
              pull: "/pull/",
              push: "/push/",
              commit: "",
              showIndex: true,
          };
          $scope.stores = [{
        	  code: Ctrl.getNextCode(),
              cycl: "",
              kind: "",
              desciption: "",
              number: "",
              price: "",
              showAdd: true,
              showEdit: false,
              showDelete: true,
              editable: true,
            }];
          $scope.addRow = function() {
              $scope.stores.push({
                  code: Ctrl.getNextCode(),
                  cycl: "",
                  kind: "",
                  desciption: "",
                  number: "",
                  price: "",
                  showAdd: true,
                  showEdit: false,
                  showDelete: true,
                  editable: true,
              })
              $scope.search($scope.currentPage);
          }
          $scope.removeRow = function(store) {
              if($scope.stores.length <= 1) {
                  return;
              }
              var index = $scope.stores.indexOf(store);
              $scope.stores.splice(index, 1);
              $scope.search($scope.currentPage);
          }
          $scope.editRow = function(store) {
              store.editable = true;
              store.showEdit = false;
          }
          $scope.saveRow = function(store) {
              
          };
          return  $scope.searchKeywords = "",
              $scope.filteredStores = [],
              $scope.row = "", $scope.type = "",
              $scope.select = function(page) {
                  var end, start;
                  if($scope.numPerPage == "tất cả") {
                     start = 0, end = $scope.filteredStores.length;
                  } else if($scope.numPerPage == "chưa lưu") {
                      $scope.currentPageStores = [];
                      for(var i = 0; i < $scope.filteredStores.length; i++) {
                          if($scope.filteredStores[i].editable == true) {
                              $scope.stores[i].stt = i+1;
                              $scope.currentPageStores.push($scope.stores[i]);
                          }
                      }
                      return $scope.currentPageStores;
                  } else {
                     start = (page - 1) * $scope.numPerPage,
                     end = start + $scope.numPerPage;
                  }
                  $scope.currentPageStores = $scope.filteredStores.slice(start, end);
                  for(var i = 1; i <= $scope.currentPageStores.length; i++) {
                      $scope.currentPageStores[i-1].stt = start+i;
                  }
                  return $scope.currentPageStores;
              },
              $scope.onFilterChange = function() {
                  return $scope.select(1), $scope.currentPage = 1, $scope.row = ""
              },
              $scope.onNumPerPageChange = function() {
                  return $scope.select(1), $scope.currentPage = 1
              },
              $scope.onOrderChange = function() {
                  return $scope.select(1), $scope.currentPage = 1
              },
              $scope.search = function() {
                  return $scope.filteredStores = $filter("filter")($scope.stores, $scope.searchKeywords), $scope.onFilterChange()
              },
              $scope.order = function(rowName, type) {
                  return ( $scope.row !== rowName || type !== $scope.type ) 
                         ? ($scope.row = rowName, $scope.type = type, 
                            $scope.filteredStores = $filter("orderBy")($scope.stores, rowName, $scope.type == "desc" ? true : false), $scope.onOrderChange()) : void 0
              },
              $scope.numPerPageOpt = [10, 15, 20, "tất cả", "chưa lưu"],
              $scope.numPerPage = $scope.numPerPageOpt[2],
              $scope.currentPage = 1,
              $scope.currentPageStores = [],
              (init = function() {
                  return $scope.search(), $scope.select($scope.currentPage)
              })();
      }])
  }.call(this),
  function() {
        "use strict";
        angular.module("app", ["app.tabs", "app.tables", "ui.bootstrap"]).config([function() {
            
        }]).filter('NE', ['$sce', function($sce){
            return function(text) {
                return $sce.trustAsHtml(text);
            };
        }])
  }.call(this)
}).call(this);
