__d = function(a, b, c) {
    $('body').on(a, b, c);
};

$(function() {
    minifyW = function(index) {
        angular.element(document.getElementById('tabsCtrl')).scope().setMinus(index);
    }
    closeW = function(index) {
        angular.element(document.getElementById('tabsCtrl')).scope().setClose(index);
    }
    __d('click', '#cmdFullScreen', function() {
        if(!$('#appManager').hasClass('isFullScreen')) {
            $('#appManager').addClass('isHideSideRight');
        } else {
            $('#appManager').removeClass('isHideSideRight');
        }
        $('#appManager').toggleClass('isFullScreen')
    });
    __d('click', '#cmdHideSideRight', function() {
        $('#appManager').toggleClass('isHideSideRight')
    });
    __d('click', '#cmdMinHeader', function() {
        $('#appManager').toggleClass('isMinHeader')
    });
    /*Process Resize left container*/
    var Resizer = {startX: null, stopX: null, el: null};
    function initDrag(e) {
        var appManager = $('#appManager');
        if(appManager.hasClass('isFullScreen')) return;
        Resizer.el = e.target;
        Resizer.startX = e.clientX;
        document.documentElement.addEventListener('mousemove', doDrag, false);
        document.documentElement.addEventListener('mouseup', stopDrag, false);
    }
    function doDrag(e) {
            $(Resizer.el).css("left", e.clientX);
            $('#LeftSidebarContainer').css('width', e.clientX);
            $('#MainContainer').css('left', e.clientX + 8);
            $('#tabsList').css('left', e.clientX + 8);
    }
    function stopDrag(e) {
        document.documentElement.removeEventListener('mousemove', doDrag, false);
        document.documentElement.removeEventListener('mouseup', stopDrag, false);
    }
    __d('mousedown', '#Hsplit',  initDrag);
    __d('dblclick', '#Hsplit',  function() {
        var width = 200;
        $(this).css("left", width);
        $('#LeftSidebarContainer').css('width', width);
        $('#MainContainer').css('left', width + 8);
        $('#tabsList').css('left', width + 8);
    });
    /*End Process Resize left container*/
})
