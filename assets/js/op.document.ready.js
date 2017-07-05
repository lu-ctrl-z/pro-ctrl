_op = $;

_op(function() {
    "user strict"
    heightChanged = function() {
    	var headOffset = _op('#head-height-offset').height();
    	var obj = _op('#menu-fluid-container');
    	obj.css('margin-top', headOffset + 'px');
    	obj.css('height', (_op(window).height() - headOffset)  + 'px')
    };
    _op(window).resize(heightChanged).load(heightChanged);
    _op('#button-show-menu').click(function() {
    	_op('#body').toggleClass('show-fluid');
    })
});
__d = function(a, b, c) {
	_op('body').on(a, b, c);
};
