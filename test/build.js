var callstack,
    callback = function($super, arg1, arg2, name) {
        callstack.push([(this.tagName || 'undefined').toLowerCase(), ++arg1, arg2, name]);

        return $super(arg1, arg2);
    },
    getCallback = function(name) {
        return function($super, arg1, arg2) {
            callback.call(this, $super, arg1, arg2, name);
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
        ['undefined', 112, '222', 3],
        ['undefined', 113, '222', 2],
        ['undefined', 114, '222', 1]
    ]);

    callstack = [];
    $.BEM.build({block: TEST_BLOCK_PREFIX + 'block1', mods: [{mod: 'mod'}], context: document.body}, 111, '222');
    deepEqual(callstack, [
        ['body', 112, '222', 4],
        ['body', 113, '222', 3],
        ['body', 114, '222', 2],
        ['body', 115, '222', 1]
    ]);

    callstack = [];
    $.BEM.build({block: TEST_BLOCK_PREFIX + 'block1', mods: [{mod: 'mod2', val: 'val'}], context: document.body}, 111, '222');
    deepEqual(callstack, [
        ['body', 112, '222', 5],
        ['body', 113, '222', 3],
        ['body', 114, '222', 2],
        ['body', 115, '222', 1]
    ]);

    callstack = [];
    $.BEM.build({block: TEST_BLOCK_PREFIX + 'block1', mods: [{mod: 'mod2', val: 'val'}, {mod: 'mod'}], context: document.body}, 111, '222');
    deepEqual(callstack, [
        ['body', 112, '222', 5],
        ['body', 113, '222', 4],
        ['body', 114, '222', 3],
        ['body', 115, '222', 2],
        ['body', 116, '222', 1]
    ]);
});
