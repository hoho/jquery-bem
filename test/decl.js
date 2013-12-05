// TODO: Test redeclaration and no declaration exceptions.

var __declRet = [];

$.BEM.decl(TEST_BLOCK_PREFIX + 'block1')
    .onMod('love', function(mod, val, prev) { __declRet.push('love ' + this.$.attr('id') + ' ' + mod + ' ' + val + ' ' + prev); })
    .onMod('100500', function(mod, val, prev) { __declRet.push('100500 ' + this.$.attr('id') + ' ' + mod + ' ' + val + ' ' + prev); })
    .elem('elem1')
        .onMod('blah', function(mod, val, prev) { __declRet.push('blah ' + this.$.attr('id') + ' ' + mod + ' ' + val + ' ' + prev); })
        .onCall('em1', function(p1, p2) { var ret = ''; __declRet.push('em1 ' + this.$.attr('id') + ' ' + p1 + ' ' + p2); return '123' + ret; })
        .onCall('em2', function(p1, p2) { __declRet.push('em2 ' + this.$.attr('id') + ' ' + p1 + ' ' + p2); return '234'; })
        .end()
    .onCall('m1', function(p1, p2) { var ret = ''; __declRet.push('m1 ' + this.$.attr('id') + ' ' + p1 + ' ' + p2); return '345' + ret; })
    .onCall('m2', function(p1, p2) { var ret = ''; __declRet.push('m2 ' + this.$.attr('id') + ' ' + p1 + ' ' + p2); return '456' + ret; });

$.BEM.extend(TEST_BLOCK_PREFIX + 'block1')
    .elem('elem1', 'blah', 'auch')
        .onMod('blah', function($super, mod, val, prev) { $super(mod, val, prev); __declRet.push('blah-auch ' + this.$.attr('id') + ' ' + mod + ' ' + val + ' ' + prev); })
        .end()
    .elem('elem1', 'blah')
        .onMod('blah', function($super, mod, val, prev) { $super(mod, val, prev); __declRet.push('blah-2 ' + this.$.attr('id') + ' ' + mod + ' ' + val + ' ' + prev); })
        .end();

$.BEM.extend(TEST_BLOCK_PREFIX + 'block1')
    .elem('elem1')
        .onCall('em1', function($super, p1, p2) { var ret = $super(p2, p1) || ''; __declRet.push('em1-1 ' + this.$.attr('id') + ' ' + p1 + ' ' + p2); return '123-2 ' + ret; })
        .end()
    .onMod('love', function($super, mod, val, prev) { $super(mod, val, prev); __declRet.push('love-2 ' + this.$.attr('id') + ' ' + mod + ' ' + val + ' ' + prev); })
    .onCall('m2', function($super, p1, p2) { var ret = $super(p2, p1) || ''; __declRet.push('m2-2 ' + this.$.attr('id') + ' ' + p1 + ' ' + p2); return '567' + ret; });

$.BEM.decl(TEST_BLOCK_PREFIX + 'block1', 'life')
    .onMod('zzz', function(mod, val, prev) { __declRet.push('zzz ' + this.$.attr('id') + ' ' + mod + ' ' + val + ' ' + prev); });

$.BEM.extend(TEST_BLOCK_PREFIX + 'block1', 'life')
    .onCall('m1', function($super, p1, p2) { var ret = $super(p2, p1) || ''; __declRet.push('m1-2 ' + this.$.attr('id') + ' ' + p1 + ' ' + p2); return 'zzz' + ret; });

$.BEM.decl(TEST_BLOCK_PREFIX + 'block5')
    .onMod('moooo', function(mod, val, prev) { __declRet.push(TEST_BLOCK_PREFIX + 'block5 ' + mod + ' ' + val + ' ' + prev); })
    .onMod('fooo', function(mod, val, prev) { __declRet.push(TEST_BLOCK_PREFIX + 'block5 ' + mod + ' ' + val + ' ' + prev); })
    .onCall('mememe', function() { __declRet.push(TEST_BLOCK_PREFIX + 'block5 mememe'); return 'mememe'; });

$.BEM.decl(TEST_BLOCK_PREFIX + 'block4')
    .elem('elem1')
        .onMod('moooo', function(mod, val, prev) {
            __declRet.push(TEST_BLOCK_PREFIX + 'block4__elem1 ' + mod + ' ' + val + ' ' + prev);
            this['something'] = 9876;
            this.bemMod('fooo', 'booo' + val);
            __declRet.push(TEST_BLOCK_PREFIX + 'block4__elem1 getMod ' + this.bemMod('fooo'));
        })
        .onMod('fooo', function(mod, val, prev) {
            __declRet.push(TEST_BLOCK_PREFIX + 'block4__elem1 ' + mod + ' ' + val + ' ' + prev + ' ' + this['something']);
        })
        .onCall('mememe', function(par1, par2) {
            this['something'] += '|' + par1 + '|' + par2 + '|';
            return 'ooooooo';
        });

$.BEM.extend(TEST_BLOCK_PREFIX + 'block4')
    .elem('elem1')
        .onMod('fooo', function($super, mod, val, prev) {
            var r = this.bemCall('mememe', 'tyc', 'piu');
            this['something'] += 'ahahah' + r;
            $super(mod, val, prev);
        });

function equalRet(func, desired, ret) {
    __declRet = [];
    deepEqual(func(), ret);
    deepEqual(__declRet, desired);
}

test('Modifier change test', function() {
    equalRet(
        function() {
            $('%' + TEST_BLOCK_PREFIX + 'block1').eq(0)
                .bemMod('love', 'not-so-cruel')
                .bemMod('love', '');
        },
        ['love 1 love not-so-cruel undefined', 'love-2 1 love not-so-cruel undefined',
         'love 1 love undefined not-so-cruel', 'love-2 1 love undefined not-so-cruel']
    );

    equalRet(
        function() {
            $('%' + TEST_BLOCK_PREFIX + 'block5')
                .bemMod('love', 'not-so-cruel')
                .bemMod('love', '');
        },
        []
    );

    equalRet(
        function() {
            $('%' + TEST_BLOCK_PREFIX + 'block1')
                .bemMod('love', 'cruel')
                .bemMod('love', 'not-cruel')
                .bemMod('love', 'cruel');
        },
        ['love 1 love cruel undefined', 'love-2 1 love cruel undefined',
         'love 6 love cruel undefined', 'love-2 6 love cruel undefined',
         'love 1 love not-cruel cruel', 'love-2 1 love not-cruel cruel',
         'love 2 love not-cruel cruel', 'love-2 2 love not-cruel cruel',
         'love 3 love not-cruel cruel', 'love-2 3 love not-cruel cruel',
         'love 6 love not-cruel cruel', 'love-2 6 love not-cruel cruel',
         'love 1 love cruel not-cruel', 'love-2 1 love cruel not-cruel',
         'love 2 love cruel not-cruel', 'love-2 2 love cruel not-cruel',
         'love 3 love cruel not-cruel', 'love-2 3 love cruel not-cruel',
         'love 6 love cruel not-cruel', 'love-2 6 love cruel not-cruel']
    );

    equalRet(
        function() {
            $('%' + TEST_BLOCK_PREFIX + 'block1(elem1)')
                .bemMod('aaa', 'bbb')
                .bemMod('aaa', '');
        },
        []
    );

    equalRet(
        function() {
            $('%' + TEST_BLOCK_PREFIX + 'block1(elem1)')
                .bemMod('blah', 'auch')
                .bemMod('blah', 'zoo')
                .bemMod('blah', '');
        },
        ['blah 6-1 blah auch undefined',
         'blah 6-1 blah zoo auch',
         'blah-auch 6-1 blah zoo auch',
         'blah-2 6-1 blah zoo auch',
         'blah 6-1 blah undefined zoo',
         'blah-2 6-1 blah undefined zoo']
    );

    equalRet(
        function() {
            $('div')
                .bemMod('gege', '1231')
                .bemMod('gege', '');
        },
        []
    );

    equalRet(
        function() {
            $('div')
                .bemMod('100500', 'yes')
                .bemMod('100500', '');
        },
        ['100500 1 100500 yes undefined',
         '100500 2 100500 yes undefined',
         '100500 3 100500 yes undefined',
         '100500 6 100500 yes undefined',
         '100500 1 100500 undefined yes',
         '100500 2 100500 undefined yes',
         '100500 3 100500 undefined yes',
         '100500 6 100500 undefined yes']
    );

    equalRet(
        function() {
            $('div')
                .bemMod('zzz', 'ololo')
                .bemMod('zzz', '');
        },
        ['zzz 3 zzz ololo undefined',
         'zzz 3 zzz undefined ololo']
    );

    equalRet(
        function() {
            $('div')
                .bemMod({block: TEST_BLOCK_PREFIX + 'block4', mod: 'zzz'}, 'ololo')
                .bemMod('zzz', ''); },
        []
    );

    equalRet(
        function() {
            $('div')
                .bemMod({block: TEST_BLOCK_PREFIX + 'block1', mod: 'zzz'}, 'ololo')
                .bemMod('zzz', '');
        },
        ['zzz 3 zzz ololo undefined',
         'zzz 3 zzz undefined ololo']
    );

    equalRet(
        function() {
            $('div, span')
                .bemMod({block: TEST_BLOCK_PREFIX + 'block1', elem: 'elem1', mod: 'blah'}, 'ololo')
                .bemMod({block: TEST_BLOCK_PREFIX + 'block1', elem: 'elem1', mod: 'blah'}, '');
        },
        ['blah 6-1 blah ololo undefined',
         'blah 6-1 blah undefined ololo',
         'blah-2 6-1 blah undefined ololo']
    );

    equalRet(
        function() {
            $('div')
                .bemMod('zzz', true)
                .bemMod('zzz', null); },
        ['zzz 3 zzz true undefined',
         'zzz 3 zzz undefined true']
    );

    equalRet(
        function() {
            $('div')
                .bemMod('zzz', true)
                .bemMod('zzz', true)
                .bemMod('zzz', null);
        },
        ['zzz 3 zzz true undefined',
         'zzz 3 zzz undefined true']
    );

    equalRet(
        function() {
            $('%' + TEST_BLOCK_PREFIX + 'block1').eq(0)
                .bemMod('love', 'auch')
                .bemMod('love', 'auch')
                .bemMod('love', 'oops')
                .bemMod('love', 'oops', true)
                .bemMod('love', '')
                .bemMod('love', '', true);
        },
        ["love 1 love auch cruel", "love-2 1 love auch cruel",
         "love 1 love oops auch", "love-2 1 love oops auch",
         "love 1 love oops oops", "love-2 1 love oops oops",
         "love 1 love undefined oops", "love-2 1 love undefined oops",
         "love 1 love undefined undefined", "love-2 1 love undefined undefined"]
    );
});

test('Call test', function() {
    equalRet(
        function() { return $('%' + TEST_BLOCK_PREFIX + 'block1').bemCall('m1', 11, 22); },
        ['m1 1 11 22'],
        '345'
    );

    equalRet(
        function() { return $('%' + TEST_BLOCK_PREFIX + 'block1[id=3]').bemCall('m1', 11, 22); },
        ['m1 3 22 11', 'm1-2 3 11 22'],
        'zzz345'
    );

    equalRet(
        function() { return $('%' + TEST_BLOCK_PREFIX + 'block1').bemCall('m2', 11, 22); },
        ['m2 1 22 11', 'm2-2 1 11 22'],
        '567456'
    );

    equalRet(
        function() { return $('%' + TEST_BLOCK_PREFIX + 'block100500').bemCall('m2', 11, 22); },
        []
    );

    equalRet(
        function() { return $('%' + TEST_BLOCK_PREFIX + 'block1(elem1)').bemCall('em1', 11, 22); },
        ['em1 6-1 22 11', 'em1-1 6-1 11 22'],
        '123-2 123'
    );

    equalRet(
        function() { return $('%' + TEST_BLOCK_PREFIX + 'block1(elem1)').bemCall('em2', 11, 22); },
        ['em2 6-1 11 22'],
        '234'
    );

    equalRet(
        function() { return $('%' + TEST_BLOCK_PREFIX + 'block2(elem1)').bemCall('em1', 11, 22); },
        []
    );

    equalRet(
        function() { return $('%' + TEST_BLOCK_PREFIX + 'block1(elem1)').bemCall({call: 'em2'}, 11, 22); },
        ['em2 6-1 11 22'],
        '234'
    );

    equalRet(
        function() { return $('%' + TEST_BLOCK_PREFIX + 'block1(elem1)').bemCall({call: 'em2', block: TEST_BLOCK_PREFIX + 'block1', elem: 'elem1'}, 11, 22); },
        ['em2 6-1 11 22'],
        '234'
    );

    equalRet(
        function() { return $('%' + TEST_BLOCK_PREFIX + 'block1').eq(2).bemCall({call: 'm2', block: TEST_BLOCK_PREFIX + 'block1'}, 11, 22); },
        ['m2 3 22 11', 'm2-2 3 11 22'],
        '567456'
    );
});

test('Callback context test', function() {
    equalRet(
        function() {
            return $('%' + TEST_BLOCK_PREFIX + 'block5')
                .bemMod('moooo', true)
                .bemMod('moooo', 'yyyy')
                .bemCall('mememe');
        },
        [TEST_BLOCK_PREFIX + 'block5 moooo true undefined',
         TEST_BLOCK_PREFIX + 'block4__elem1 moooo true undefined',
         TEST_BLOCK_PREFIX + 'block4__elem1 fooo boootrue undefined 9876|tyc|piu|ahahahooooooo',
         TEST_BLOCK_PREFIX + 'block4__elem1 getMod boootrue',
         TEST_BLOCK_PREFIX + 'block5 moooo yyyy true',
         TEST_BLOCK_PREFIX + 'block4__elem1 moooo yyyy true',
         TEST_BLOCK_PREFIX + 'block4__elem1 fooo boooyyyy boootrue 9876|tyc|piu|ahahahooooooo',
         TEST_BLOCK_PREFIX + 'block4__elem1 getMod boooyyyy',
         TEST_BLOCK_PREFIX + 'block5 mememe'],
        'mememe'
    );
});
