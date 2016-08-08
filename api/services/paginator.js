module.exports = {
	/**
	 * $pagger: {total: 300, current: 30, limit: 10, links: 9}
	 * $links : integer
	 * $list_class : Ex 'pagger' => <ul class="pagger">
	 * @param $pagger
	 * @param $links
	 * @param $list_class
	 * @returns {String} html
	 */
    createLinks: function( $pagger, $links, $list_class ) {
        if ( $pagger.limit == 'all' ) {
            return '';
        }

        $last       = Math.ceil( $pagger.total / $pagger.limit );
        $pagger.current = parseInt( $pagger.current );
        $start      = ( $pagger.current - $links  > 0 )     ? $pagger.current - $links : 1;
        $end        = ( $pagger.current + $links < $last ) ? $pagger.current + $links : $last;

        $html       = '<ul class="' + $list_class + '">';
        $class      = ( $pagger.current == 1 ) ? "item disabled" : "item";
        if($pagger.current == 1) {
            $html       += '<li class="' + $class + '"><span>&laquo;</span></li>';
        } else {
            $html       += '<li class="' + $class + '"><a data-title="trang ' + ($pagger.current - 1) + '" href="?limit=' + $pagger.limit + '&page=' + ( $pagger.current - 1 ) + '">&laquo;</a></li>';
        }

        if ( $start > 1 ) {
            $html   += '<li class="item"><a href="?limit=' + $pagger.limit + '&page=1">1</a></li>';
            $html   += '<li class="item disabled"><span>...</span></li>';
        }

        for ( $i = $start ; $i <= $end; $i++ ) {
            $class  = ( $pagger.current == $i ) ? "item active" : "item";
            $html   += '<li class="' + $class + '"><a href="?limit=' + $pagger.limit + '&page=' + $i + '">' + $i + '</a></li>';
        }

        if ( $end < $last ) {
            $html   += '<li class="disabled item"><span>...</span></li>';
            $html   += '<li class="item"><a href="?limit=' + $pagger.limit + '&page=' + $last + '">' + $last + '</a></li>';
        }

        $class      = ( $pagger.current == $last ) ? "item disabled" : "item";
        if($pagger.current == $last) {
            $html       += '<li class="' + $class + '"><span>&raquo;</span></li>';
        } else {
            $html       += '<li class="' + $class + '"><a data-title="trang ' + ($pagger.current + 1) + '" href="?limit=' + $pagger.limit + '&page=' + parseInt( $pagger.current + 1 ) + '">&raquo;</a></li>';
        }

        $html       += '</ul>';

        return $html;
    }
}