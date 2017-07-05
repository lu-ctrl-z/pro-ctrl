
var codeSpeedApp = angular.module('csProgress', []);
codeSpeedApp.directive('csPageProgress', [function() {
    
    return {
        templateUrl: '/plugin/page-progress/templates/page-progress.html',
        scope: {
            pageIndex: '=',
            pageSize: '=',
            showNumber: '@',
            pageClick: '&',
            barWidth: '@'
        },
        link: function(scope, element, attrs) {
            
            var startSize = 20;
            
            var progress = $(element).find('.cs-pageprogress');
            var bar = $(element).find('.cs-pageprogress__bar-indicator');
            
            if (scope.barWidth) {
                progress.css({ width: scope.barWidth });
            }
            var maxWidth = progress.width() - startSize;
            var step = maxWidth / (scope.pageSize - 1);
            
            if (scope.showNumber) {
                scope.numbers = [];
                for (var i=0; i<scope.pageSize; i++) {
                    scope.numbers.push(i + 1);
                }
                scope.numberStep = (step - startSize);
                
                if (attrs.pageClick) {
                    scope.enableClick = true;
                }
            }
            
            scope.$watch('pageIndex', function(newValue, oldValue) {
                if (newValue >= scope.pageSize) return;
                
                bar.css({ 'width': Math.floor(newValue * step + startSize) + 'px'});
            });
        }
    };
}]);

codeSpeedApp.directive('csPage', ['$timeout', function($timeout) {
    
    return {
        restrict: 'A',
        scope: {
            page: '@csPage',
            pageIndex: '=',
            pageAnimation: '@'
        },
        link: function(scope, element, attrs) {
            
            var animationBefore = scope.pageAnimation || 'cs-page__animation';
            var animationIn = animationBefore + '--in';
            var animationOut = animationBefore + '--out';
            
            var elem = $(element);
            elem.hide();
            elem.addClass('cs-page');
            elem.addClass(animationBefore);
            
            var page = Number(scope.page);
            
            scope.$watch('pageIndex', function(newValue, oldValue) {
                if (newValue != scope.page && oldValue != scope.page) return;
                
                if (newValue == scope.page) {
                    elem.show();
                    $timeout(function() {
                        elem.addClass(animationIn);
                        elem.removeClass(animationOut);
                    }, 20);
                } else if (newValue > scope.page) {
                    elem.addClass(animationIn);
                    elem.addClass(animationOut);
                    $timeout(function() { elem.hide(); }, 300);
                } else {
                    elem.removeClass(animationIn);
                    elem.removeClass(animationOut);
                    $timeout(function() { elem.hide(); }, 300);
                }
            });
        }
    };
}]);