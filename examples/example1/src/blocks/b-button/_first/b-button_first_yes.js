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
