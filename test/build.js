var callstack,
    callback = function($super, meta, arg1, arg2, name) {
        callstack.push(meta);
        callstack.push([(this.tagName || 'undefined').toLowerCase(), ++arg1, arg2, name]);

        return $super && $super(meta, arg1, arg2);
    },
    getCallback = function(name, isDecl) {
        return isDecl ?
            function(meta, arg1, arg2) {
                callback.call(this, null, meta, arg1, arg2, name);
            }
            :
            function($super, meta, arg1, arg2) {
                callback.call(this, $super, meta, arg1, arg2, name);
            };
    };


$.BEM.decl(TEST_BLOCK_PREFIX + 'build-block')
    .onBuild(getCallback(1, true));

$.BEM.extend(TEST_BLOCK_PREFIX + 'build-block')
    .onBuild(getCallback(2))
    .onBuild(getCallback(3));

$.BEM.extend(TEST_BLOCK_PREFIX + 'build-block', 'mod')
    .onBuild(getCallback(4));

$.BEM.extend(TEST_BLOCK_PREFIX + 'build-block', 'mod2', 'val2')
    .onBuild(getCallback(5));

test('Build test', function() {
    callstack = [];
    $.BEM.build(TEST_BLOCK_PREFIX + 'build-block', 111, '222');
    deepEqual(callstack, [
        {block: TEST_BLOCK_PREFIX + 'build-block'},
        ['undefined', 112, '222', 3],
        {block: TEST_BLOCK_PREFIX + 'build-block'},
        ['undefined', 113, '222', 2],
        {block: TEST_BLOCK_PREFIX + 'build-block'},
        ['undefined', 114, '222', 1]
    ]);

    deepEqual($.BEM.className(callstack[0]), TEST_BLOCK_PREFIX + 'build-block');

    callstack = [];
    $.BEM.build({block: TEST_BLOCK_PREFIX + 'build-block', mods: {mod: 'val'}, context: document.body}, 111, '222');
    deepEqual(callstack, [
        {block: TEST_BLOCK_PREFIX + 'build-block', mods: {mod: 'val'}},
        ['body', 112, '222', 4],
        {block: TEST_BLOCK_PREFIX + 'build-block', mods: {mod: 'val'}},
        ['body', 113, '222', 3],
        {block: TEST_BLOCK_PREFIX + 'build-block', mods: {mod: 'val'}},
        ['body', 114, '222', 2],
        {block: TEST_BLOCK_PREFIX + 'build-block', mods: {mod: 'val'}},
        ['body', 115, '222', 1]
    ]);

    deepEqual($.BEM.className(callstack[0]), TEST_BLOCK_PREFIX + 'build-block ' + TEST_BLOCK_PREFIX + 'build-block_mod_val');

    callstack = [];
    $.BEM.build({block: TEST_BLOCK_PREFIX + 'build-block', mods: {mod2: 'val2'}, context: document.body}, 111, '222');
    deepEqual(callstack, [
        {block: TEST_BLOCK_PREFIX + 'build-block', mods: {mod2: 'val2'}},
        ['body', 112, '222', 5],
        {block: TEST_BLOCK_PREFIX + 'build-block', mods: {mod2: 'val2'}},
        ['body', 113, '222', 3],
        {block: TEST_BLOCK_PREFIX + 'build-block', mods: {mod2: 'val2'}},
        ['body', 114, '222', 2],
        {block: TEST_BLOCK_PREFIX + 'build-block', mods: {mod2: 'val2'}},
        ['body', 115, '222', 1]
    ]);

    deepEqual($.BEM.className(callstack[0]), TEST_BLOCK_PREFIX + 'build-block ' + TEST_BLOCK_PREFIX + 'build-block_mod2_val2');

    callstack = [];
    $.BEM.build({block: TEST_BLOCK_PREFIX + 'build-block', mods: {mod2: 'val2', mod: 'val', mod3: true}, context: document.body}, 111, '222');
    deepEqual(callstack, [
        {block: TEST_BLOCK_PREFIX + 'build-block', mods: {mod2: 'val2', mod: 'val', mod3: true}},
        ['body', 112, '222', 5],
        {block: TEST_BLOCK_PREFIX + 'build-block', mods: {mod2: 'val2', mod: 'val', mod3: true}},
        ['body', 113, '222', 4],
        {block: TEST_BLOCK_PREFIX + 'build-block', mods: {mod2: 'val2', mod: 'val', mod3: true}},
        ['body', 114, '222', 3],
        {block: TEST_BLOCK_PREFIX + 'build-block', mods: {mod2: 'val2', mod: 'val', mod3: true}},
        ['body', 115, '222', 2],
        {block: TEST_BLOCK_PREFIX + 'build-block', mods: {mod2: 'val2', mod: 'val', mod3: true}},
        ['body', 116, '222', 1]
    ]);

    deepEqual($.BEM.className(callstack[0]), TEST_BLOCK_PREFIX + 'build-block ' + TEST_BLOCK_PREFIX + 'build-block_mod2_val2 ' + TEST_BLOCK_PREFIX + 'build-block_mod_val ' + TEST_BLOCK_PREFIX + 'build-block_mod3');
});
