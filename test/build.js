var callstack,
    callback = function($super, details, arg1, arg2, name) {
        callstack.push(details);
        callstack.push([(this.tagName || 'undefined').toLowerCase(), ++arg1, arg2, name]);

        return $super && $super(details, arg1, arg2);
    },
    getCallback = function(name, isDecl) {
        return isDecl ?
            function(details, arg1, arg2) {
                callback.call(this, null, details, arg1, arg2, name);
            }
            :
            function($super, details, arg1, arg2) {
                callback.call(this, $super, details, arg1, arg2, name);
            };
    };


$.BEM.decl(TEST_BLOCK_PREFIX + 'build-block')
    .onBuild(getCallback(1, true))
    .elem('some-element')
        .onBuild(getCallback(11, true))
    .end();

$.BEM.extend(TEST_BLOCK_PREFIX + 'build-block')
    .onBuild(getCallback(2))
    .elem('some-element')
        .onBuild(getCallback(22))
    .end()
    .onBuild(getCallback(3));

$.BEM.extend(TEST_BLOCK_PREFIX + 'build-block', 'mod')
    .onBuild(getCallback(4));

$.BEM.extend(TEST_BLOCK_PREFIX + 'build-block')
    .elem('some-element', 'mod')
        .onBuild(getCallback(44))
    .end()
    .elem('some-element', 'mod2', 'val2')
        .onBuild(getCallback(55))
    .end();

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

    callstack = [];
    $.BEM.build({block: TEST_BLOCK_PREFIX + 'build-block', elem: 'some-element'}, 111, '222');
    deepEqual(callstack, [
        {block: TEST_BLOCK_PREFIX + 'build-block', elem: 'some-element'},
        ['undefined', 112, '222', 22],
        {block: TEST_BLOCK_PREFIX + 'build-block', elem: 'some-element'},
        ['undefined', 113, '222', 11]
    ]);

    callstack = [];
    $.BEM.build({block: TEST_BLOCK_PREFIX + 'build-block', elem: 'some-element', mods: {mod: 'val'}, context: document.body}, 111, '222');
    deepEqual(callstack, [
        {block: TEST_BLOCK_PREFIX + 'build-block', elem: 'some-element', mods: {mod: 'val'}},
        ['body', 112, '222', 44],
        {block: TEST_BLOCK_PREFIX + 'build-block', elem: 'some-element', mods: {mod: 'val'}},
        ['body', 113, '222', 22],
        {block: TEST_BLOCK_PREFIX + 'build-block', elem: 'some-element', mods: {mod: 'val'}},
        ['body', 114, '222', 11]
    ]);
    deepEqual($.BEM.className(callstack[0]), TEST_BLOCK_PREFIX + 'build-block__some-element ' + TEST_BLOCK_PREFIX + 'build-block__some-element_mod_val');

    callstack = [];
    $.BEM.build({block: TEST_BLOCK_PREFIX + 'build-block', elem: 'some-element', mods: {mod2: 'val2', mod: 'val', mod3: true}, context: document.body}, 111, '222');
    deepEqual(callstack, [
        {block: TEST_BLOCK_PREFIX + 'build-block', elem: 'some-element', mods: {mod: 'val', mod2: 'val2', mod3: true}},
        ['body', 112, '222', 55],
        {block: TEST_BLOCK_PREFIX + 'build-block', elem: 'some-element', mods: {mod: 'val', mod2: 'val2', mod3: true}},
        ['body', 113, '222', 44],
        {block: TEST_BLOCK_PREFIX + 'build-block', elem: 'some-element', mods: {mod: 'val', mod2: 'val2', mod3: true}},
        ['body', 114, '222', 22],
        {block: TEST_BLOCK_PREFIX + 'build-block', elem: 'some-element', mods: {mod: 'val', mod2: 'val2', mod3: true}},
        ['body', 115, '222', 11]
    ]);
    deepEqual($.BEM.className(callstack[0]), TEST_BLOCK_PREFIX + 'build-block__some-element ' + TEST_BLOCK_PREFIX + 'build-block__some-element_mod2_val2 ' + TEST_BLOCK_PREFIX + 'build-block__some-element_mod_val ' + TEST_BLOCK_PREFIX + 'build-block__some-element_mod3');
});
