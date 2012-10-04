$.b_.decl('b-table')
    .elem('cell', 'result', 'first')
        .onMethod('set',
            function($super, val) {
                return $super(val ? 'first: ' + val : '');
            });
