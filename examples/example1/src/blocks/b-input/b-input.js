$.BEM.decl('b-input')
    .onMod('js',
        function($super, mod, val, prev) {
            if (val !== 'inited') { return; }
            var button = this.closest('@b-table(row)').find('@b-button');
            this.keypress(function(e) {
                if (e.charCode === 13) { button.click(); }
            });
        });
