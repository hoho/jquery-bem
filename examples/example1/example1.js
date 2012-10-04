$(function() {
    $('.js').bemSetMod('js', 'inited');
});

$.b_.decl('b-table')
    .elem('cell', 'type', 'result')
        .onMethod('set',
            function($super, val) {
                if (val) { this.text(val); }
                else { this.html('<em>empty</em>'); }
            });

$.b_.decl('b-table')
    .elem('cell', 'result', 'first')
        .onMethod('set',
            function($super, val) {
                return $super(val ? 'first: ' + val : '');
            });

$.b_.decl('b-table')
    .elem('cell', 'result', 'last')
        .onMethod('set',
            function($super, val) {
                return $super(val || Math.random());
            });

$.b_.decl('b-input')
    .onMod('js',
        function($super, mod, val, prev) {
            if (val !== 'inited') { return; }
            var button = this.closest('@b-table(row)').find('@b-button');
            this.keypress(function(e) {
                if (e.charCode === 13) { button.click(); }
            });
        });

$.b_.decl('b-button')
    .onMod('js',
        function($super, mod, val, prev) {
            $super(mod, val, prev);
            if (val !== 'inited') { return false; }
            this
                .mousedown(function() { $(this).bemSetMod('pressed', 'yes'); })
                .mouseup(function() { $(this).bemSetMod('pressed', ''); })
                .click(function() { $(this).bemCall('onclick'); });
            return true;
        })
    .onMethod('onclick',
        function() {
            var row = this.closest('@b-table(row)');
            row
                .find('@b-table(cell){type=result}')
                .bemCall('set', row.find('@b-input').focus().select().val());
        });

$.b_.decl('b-button', 'first', 'yes')
    .onMod('js',
        function($super, mod, val, prev) {
            if ($super(mod, val, prev)) {
                this
                    .mouseover(function() { $(this).bemSetMod('hover', 'yes'); })
                    .mouseout(function() { $(this).bemSetMod('hover', ''); });

                this.closest('@b-table(row)').find('@b-input').focus();
            }
        });

