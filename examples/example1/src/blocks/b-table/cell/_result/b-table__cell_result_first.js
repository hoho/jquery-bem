$.b_.decl('b-table')
    .elem('cell', 'result', 'first')
        .defineMethod('set',
            function($super, val) {
                return $super(val ? 'first: ' + val : '');
            });
