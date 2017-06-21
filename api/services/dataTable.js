module.exports = {
    $id: null,
    $perPage: 10,
    $pullUri: null,
    $pushUri: null,
    begin: function($id, $class) {
        if(!$id) { $id = ""; }
        else { $id = ' id="' + $id + '" '; }
        $class = $class || 'table form-table table-striped table-bordered';
        return 
'<table' + $id + 'class="' + $class + '">\
  <thead>\
    <tr>';
    },
    column: function( config ) {
        //titleKey, property, class, headerClass, escapeXml, renderer, sortAble, style
        return '<th class="size-1">STT</th>';
    }
    
};