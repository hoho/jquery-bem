$.BEM.decl('b-button')
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
