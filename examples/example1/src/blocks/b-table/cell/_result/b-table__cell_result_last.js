$.b_.decl('b-table')
    .elem('cell', 'result', 'last')
        .defineMethod('set',
            function($super, val) {
                return $super(val || Math.random());
            });
