var callstack,
    callback = function($super, arg1, arg2, name) {
        callstack.push([this.tagName.toLowerCase(), arg1, arg2, name]);

        return $super(arg1, arg2);
    },
    getCallback = function(name) {
        return function($super, arg1, arg2) {
            callback.call(this, $super, arg1, arg2, name);
        };
    };


$.BEM.decl('b-block1')
    .onBuild(getCallback(1))
    .onBuild(getCallback(2));

$.BEM.decl('b-block1')
    .onBuild(getCallback(3));

$.BEM.decl('b-block1', 'mod')
    .onBuild(getCallback(4));

$.BEM.decl('b-block1', 'mod2', 'val')
    .onBuild(getCallback(5));

test('Build test', function() {
    callstack = [];
    $.BEM.build(document.body, 'b-block1', 111, '222');
    deepEqual(callstack, [
        ['body', 111, '222', 3],
        ['body', 111, '222', 2],
        ['body', 111, '222', 1]
    ]);

    callstack = [];
    $.BEM.build(document.body, {block: 'b-block1', mods: [['mod']]}, 111, '222');
    deepEqual(callstack, [
        ['body', 111, '222', 4],
        ['body', 111, '222', 3],
        ['body', 111, '222', 2],
        ['body', 111, '222', 1]
    ]);

    callstack = [];
    $.BEM.build(document.body, {block: 'b-block1', mods: [['mod2', 'val']]}, 111, '222');
    deepEqual(callstack, [
        ['body', 111, '222', 5],
        ['body', 111, '222', 3],
        ['body', 111, '222', 2],
        ['body', 111, '222', 1]
    ]);

    callstack = [];
    $.BEM.build(document.body, {block: 'b-block1', mods: [['mod2', 'val'], ['mod']]}, 111, '222');
    deepEqual(callstack, [
        ['body', 111, '222', 5],
        ['body', 111, '222', 4],
        ['body', 111, '222', 3],
        ['body', 111, '222', 2],
        ['body', 111, '222', 1]
    ]);
});