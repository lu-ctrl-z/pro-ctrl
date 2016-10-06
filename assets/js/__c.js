$(function() {
    var RESIZE = {startX: null, stopX: null, el: null};
    var resizer = document.getElementById('Hsplit');
    var LeftSidebarContainer = document.getElementById('LeftSidebarContainer');
    var MainContainer = document.getElementById('MainContainer');
    resizer.addEventListener('mousedown', initDrag, false);
    function initDrag(e) {
        RESIZE.el = e.target;
        RESIZE.startX = e.clientX;
        document.documentElement.addEventListener('mousemove', doDrag, false);
        document.documentElement.addEventListener('mouseup', stopDrag, false);
    }
    function doDrag(e) {
        RESIZE.el.style.left = (e.clientX) + 'px';
        LeftSidebarContainer.style.width = (e.clientX) + 'px';
        MainContainer.style.left = (e.clientX + 8) + 'px';
    }
    function stopDrag(e) {
        document.documentElement.removeEventListener('mousemove', doDrag, false);
        document.documentElement.removeEventListener('mouseup', stopDrag, false);
    }
})

