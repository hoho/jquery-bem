var callstack,
    callback = function($super, blockData, arg1, arg2, name) {
        callstack.push(blockData);
        callstack.push([(this.tagName || 'undefined').toLowerCase(), ++arg1, arg2, name]);

        return $super(blockData, arg1, arg2);
    },
    getCallback = function(name) {
        return function($super, blockData, arg1, arg2) {
            callback.call(this, $super, blockData, arg1, arg2, name);
        };
    };


$.BEM.decl(TEST_BLOCK_PREFIX + 'block1')
    .onBuild(getCallback(1))
    .onBuild(getCallback(2));

$.BEM.decl(TEST_BLOCK_PREFIX + 'block1')
    .onBuild(getCallback(3));

$.BEM.decl(TEST_BLOCK_PREFIX + 'block1', 'mod')
    .onBuild(getCallback(4));

$.BEM.decl(TEST_BLOCK_PREFIX + 'block1', 'mod2', 'val')
    .onBuild(getCallback(5));

test('Build test', function() {
    callstack = [];
    $.BEM.build(TEST_BLOCK_PREFIX + 'block1', 111, '222');
    deepEqual(callstack, [
        {block: TEST_BLOCK_PREFIX + 'block1'},
        ['undefined', 112, '222', 3],
        {block: TEST_BLOCK_PREFIX + 'block1'},
        ['undefined', 113, '222', 2],
        {block: TEST_BLOCK_PREFIX + 'block1'},
        ['undefined', 114, '222', 1]
    ]);

    deepEqual($.BEM.className(callstack[0]), TEST_BLOCK_PREFIX + 'block1');

    callstack = [];
    $.BEM.build({block: TEST_BLOCK_PREFIX + 'block1', mods: [{mod: 'mod'}], context: document.body}, 111, '222');
    deepEqual(callstack, [
        {block: TEST_BLOCK_PREFIX + 'block1', mods: [{mod: 'mod'}], context: document.body},
        ['body', 112, '222', 4],
        {block: TEST_BLOCK_PREFIX + 'block1', mods: [{mod: 'mod'}], context: document.body},
        ['body', 113, '222', 3],
        {block: TEST_BLOCK_PREFIX + 'block1', mods: [{mod: 'mod'}], context: document.body},
        ['body', 114, '222', 2],
        {block: TEST_BLOCK_PREFIX + 'block1', mods: [{mod: 'mod'}], context: document.body},
        ['body', 115, '222', 1]
    ]);

    deepEqual($.BEM.className(callstack[0]), TEST_BLOCK_PREFIX + 'block1');

    callstack = [];
    $.BEM.build({block: TEST_BLOCK_PREFIX + 'block1', mods: [{mod: 'mod2', val: 'val'}], context: document.body}, 111, '222');
    deepEqual(callstack, [
        {block: TEST_BLOCK_PREFIX + 'block1', mods: [{mod: 'mod2', val: 'val'}], context: document.body},
        ['body', 112, '222', 5],
        {block: TEST_BLOCK_PREFIX + 'block1', mods: [{mod: 'mod2', val: 'val'}], context: document.body},
        ['body', 113, '222', 3],
        {block: TEST_BLOCK_PREFIX + 'block1', mods: [{mod: 'mod2', val: 'val'}], context: document.body},
        ['body', 114, '222', 2],
        {block: TEST_BLOCK_PREFIX + 'block1', mods: [{mod: 'mod2', val: 'val'}], context: document.body},
        ['body', 115, '222', 1]
    ]);

    deepEqual($.BEM.className(callstack[0]), TEST_BLOCK_PREFIX + 'block1 ' + TEST_BLOCK_PREFIX + 'block1_mod2_val');

    callstack = [];
    $.BEM.build({block: TEST_BLOCK_PREFIX + 'block1', mods: [{mod: 'mod2', val: 'val'}, {mod: 'mod'}], context: document.body}, 111, '222');
    deepEqual(callstack, [
        {block: TEST_BLOCK_PREFIX + 'block1', mods: [{mod: 'mod2', val: 'val'}, {mod: 'mod'}], context: document.body},
        ['body', 112, '222', 5],
        {block: TEST_BLOCK_PREFIX + 'block1', mods: [{mod: 'mod2', val: 'val'}, {mod: 'mod'}], context: document.body},
        ['body', 113, '222', 4],
        {block: TEST_BLOCK_PREFIX + 'block1', mods: [{mod: 'mod2', val: 'val'}, {mod: 'mod'}], context: document.body},
        ['body', 114, '222', 3],
        {block: TEST_BLOCK_PREFIX + 'block1', mods: [{mod: 'mod2', val: 'val'}, {mod: 'mod'}], context: document.body},
        ['body', 115, '222', 2],
        {block: TEST_BLOCK_PREFIX + 'block1', mods: [{mod: 'mod2', val: 'val'}, {mod: 'mod'}], context: document.body},
        ['body', 116, '222', 1]
    ]);

    deepEqual($.BEM.className(callstack[0]), TEST_BLOCK_PREFIX + 'block1 ' + TEST_BLOCK_PREFIX + 'block1_mod2_val');
});
