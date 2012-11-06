var __declRet = [];

$.BEM.decl('b-block1')
    .onMod('love', function($super, mod, val, prev) { $super(mod, val, prev); __declRet.push('love ' + $(this).attr('id') + ' ' + mod + ' ' + val + ' ' + prev); })
    .onMod('100500', function($super, mod, val, prev) { __declRet.push('100500 ' + $(this).attr('id') + ' ' + mod + ' ' + val + ' ' + prev); })
    .elem('elem1')
        .onMod('blah', function($super, mod, val, prev) { $super(mod, val, prev); __declRet.push('blah ' + $(this).attr('id') + ' ' + mod + ' ' + val + ' ' + prev); })
        .onMethod('em1', function($super, p1, p2) { var ret = $super(p2, p1) || ''; __declRet.push('em1 ' + $(this).attr('id') + ' ' + p1 + ' ' + p2); return '123' + ret; })
        .onMethod('em1', function($super, p1, p2) { var ret = $super(p2, p1) || ''; __declRet.push('em1-1 ' + $(this).attr('id') + ' ' + p1 + ' ' + p2); return '123-2 ' + ret; })
        .onMethod('em2', function($super, p1, p2) { __declRet.push('em2 ' + $(this).attr('id') + ' ' + p1 + ' ' + p2); return '234'; })
        .end()
    .elem('elem1', 'blah', 'auch')
        .onMod('blah', function($super, mod, val, prev) { $super(mod, val, prev); __declRet.push('blah-auch ' + $(this).attr('id') + ' ' + mod + ' ' + val + ' ' + prev); })
        .end()
    .elem('elem1', 'blah')
        .onMod('blah', function($super, mod, val, prev) { $super(mod, val, prev); __declRet.push('blah-2 ' + $(this).attr('id') + ' ' + mod + ' ' + val + ' ' + prev); })
        .end()
    .onMethod('m1', function($super, p1, p2) { var ret = $super(p2, p1) || ''; __declRet.push('m1 ' + $(this).attr('id') + ' ' + p1 + ' ' + p2); return '345' + ret; })
    .onMethod('m2', function($super, p1, p2) { var ret = $super(p2, p1) || ''; __declRet.push('m2 ' + $(this).attr('id') + ' ' + p1 + ' ' + p2); return '456' + ret; })
    .onMethod('m2', function($super, p1, p2) { var ret = $super(p2, p1) || ''; __declRet.push('m2-2 ' + $(this).attr('id') + ' ' + p1 + ' ' + p2); return '567' + ret; });

$.BEM.decl('b-block1')
    .onMod('love', function($super, mod, val, prev) { $super(mod, val, prev); __declRet.push('love-2 ' + $(this).attr('id') + ' ' + mod + ' ' + val + ' ' + prev); });

$.BEM.decl('b-block1', 'life')
    .onMod('zzz', function($super, mod, val, prev) { __declRet.push('zzz ' + $(this).attr('id') + ' ' + mod + ' ' + val + ' ' + prev); })
    .onMethod('m1', function($super, p1, p2) { var ret = $super(p2, p1) || ''; __declRet.push('m1-2 ' + $(this).attr('id') + ' ' + p1 + ' ' + p2); return 'zzz' + ret; })

function equalRet(func, desired, ret) {
    __declRet = [];
    equal(func(), ret);
    deepEqual(__declRet, desired);
}

test('Modifier change test', function() {
    equalRet(
        function() {
            $('%b-block1').eq(0)
                .bemSetMod('love', 'not-so-cruel')
                .bemSetMod('love', '');
        },
        ['love 1 love not-so-cruel ', 'love-2 1 love not-so-cruel ',
         'love 1 love  not-so-cruel', 'love-2 1 love  not-so-cruel']
    );

    equalRet(
        function() {
            $('%b-block5')
                .bemSetMod('love', 'not-so-cruel')
                .bemSetMod('love', '');
        },
        []
    );

    equalRet(
        function() {
            $('%b-block1')
                .bemSetMod('love', 'cruel')
                .bemSetMod('love', 'not-cruel')
                .bemSetMod('love', 'cruel');
        },
        ['love 1 love cruel ', 'love-2 1 love cruel ',
         'love 6 love cruel ', 'love-2 6 love cruel ',
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
        function() { $('%b-block1(elem1)').bemSetMod('aaa', 'bbb').bemSetMod('aaa', ''); },
        []
    );

    equalRet(
        function() {
            $('%b-block1(elem1)')
                .bemSetMod('blah', 'auch')
                .bemSetMod('blah', 'zoo')
                .bemSetMod('blah', '');
        },
        ['blah 6-1 blah auch ',
         'blah 6-1 blah zoo auch',
         'blah-auch 6-1 blah zoo auch',
         'blah-2 6-1 blah zoo auch',
         'blah 6-1 blah  zoo',
         'blah-2 6-1 blah  zoo']
    );

    equalRet(function() { $('div').bemSetMod('gege', '1231').bemSetMod('gege', ''); }, []);

    equalRet(
        function() {
            $('div').bemSetMod('100500', 'yes').bemSetMod('100500', '');
        },
        ['100500 1 100500 yes ',
         '100500 2 100500 yes ',
         '100500 3 100500 yes ',
         '100500 6 100500 yes ',
         '100500 1 100500  yes',
         '100500 2 100500  yes',
         '100500 3 100500  yes',
         '100500 6 100500  yes']
    );

    equalRet(
        function() { $('div').bemSetMod('zzz', 'ololo').bemSetMod('zzz', ''); },
        ['zzz 3 zzz ololo ', 'zzz 3 zzz  ololo']
    );

    equalRet(
        function() { $('div').bemSetMod('b-block4', 'zzz', 'ololo').bemSetMod('zzz', ''); },
        []
    );

    equalRet(
        function() { $('div').bemSetMod('b-block1', 'zzz', 'ololo').bemSetMod('zzz', ''); },
        ['zzz 3 zzz ololo ', 'zzz 3 zzz  ololo']
    );

    equalRet(
        function() { $('div').bemSetMod({block: 'b-block1'}, 'zzz', 'ololo').bemSetMod('zzz', ''); },
        ['zzz 3 zzz ololo ', 'zzz 3 zzz  ololo']
    );

    equalRet(
        function() { $('div, span').bemSetMod({block: 'b-block1', elem: 'elem1'}, 'blah', 'ololo').bemSetMod({block: 'b-block1', elem: 'elem1'}, 'blah', ''); },
        ['blah 6-1 blah ololo ', 'blah 6-1 blah  ololo', 'blah-2 6-1 blah  ololo']
    );
});

test('Method call test', function() {
    equalRet(
        function() { return $('%b-block1').bemCall('m1', 11, 22); },
        ['m1 1 11 22'],
        '345'
    );

    equalRet(
        function() { return $('%b-block1[id=3]').bemCall('m1', 11, 22); },
        ['m1 3 22 11', 'm1-2 3 11 22'],
        'zzz345'
    );

    equalRet(
        function() { return $('%b-block1').bemCall('m2', 11, 22); },
        ['m2 1 22 11', 'm2-2 1 11 22'],
        '567456'
    );

    equalRet(
        function() { return $('%b-block100500').bemCall('m2', 11, 22); },
        []
    );

    equalRet(
        function() { return $('%b-block1(elem1)').bemCall('em1', 11, 22); },
        ['em1 6-1 22 11', 'em1-1 6-1 11 22'],
        '123-2 123'
    );

    equalRet(
        function() { return $('%b-block1(elem1)').bemCall('em2', 11, 22); },
        ['em2 6-1 11 22'],
        '234'
    );

    equalRet(
        function() { return $('%b-block2(elem1)').bemCall('em1', 11, 22); },
        []
    );

    equalRet(
        function() { return $('%b-block1(elem1)').bemCall({method: 'em2'}, 11, 22); },
        ['em2 6-1 11 22'],
        '234'
    );

    equalRet(
        function() { return $('%b-block1(elem1)').bemCall({method: 'em2', block: 'b-block1', elem: 'elem1'}, 11, 22); },
        ['em2 6-1 11 22'],
        '234'
    );

    equalRet(
        function() { return $('%b-block1').eq(2).bemCall({method: 'm2', block: 'b-block1'}, 11, 22); },
        ['m2 3 22 11', 'm2-2 3 11 22'],
        '567456'
    );
});
