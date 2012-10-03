$.b_.decl('b-table')
    .elem('cell', 'type', 'result')
        .defineMethod('set',
            function($super, val) {
                if (val) { this.text(val); }
                else { this.html('<em>empty</em>'); }
            });
