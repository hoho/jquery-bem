function testClasses(mod, expected) {
    var ret = [];
    $('*')
        .each(function() {
            var r = new RegExp('(?:\\s|^)([^\\s]+' + mod + '(?:_[^\\s]+)?)(?:\\s|$)'),
                c = ($(this).attr('class') || '').match(r);
            if (c) { ret.push($(this).attr('id') + ' ' + c[1]); }
        });
    deepEqual(ret, expected);
}

test('Modifier class changes', function() {
    $('%b-block1').bemSetMod('test', 'value');
    testClasses('test',
                ['1 b-block1_test_value', '2 b-block1_test_value',
                 '3 b-block1_test_value', '6 b-block1_test_value']);

    $('%b-block1').bemSetMod('test', 'new');
    testClasses('test',
                ['1 b-block1_test_new', '2 b-block1_test_new',
                 '3 b-block1_test_new', '6 b-block1_test_new']);

    $('%b-block1').bemSetMod('test2', 'cool');
    testClasses('test2',
                ['1 b-block1_test2_cool', '2 b-block1_test2_cool',
                 '3 b-block1_test2_cool', '6 b-block1_test2_cool']);

    ok($('%b-block1').is('{test=new}{test2=cool}'));

    $('%b-block1').bemSetMod('test', '');
    testClasses('test', []);

    ok($('%b-block1').is(':not({test})'));

    $('%*(*)').bemSetMod('yeeehaa', 'lol');
    testClasses('yeeehaa',
                ['4-1 b-block2__elem1_yeeehaa_lol', '4-2 b-block2__elem2_yeeehaa_lol',
                 '4-4 b-block2__elem2_yeeehaa_lol', '4-5 b-block2__elem2_yeeehaa_lol',
                 '4-6 b-block2__elem3_yeeehaa_lol', '6-1 b-block1__elem1_yeeehaa_lol',
                 '8-1 b-block5_yeeehaa_lol']);

    $('%*(*)').bemSetMod('yeeehaa', '');
    testClasses('yeeehaa', []);

    $('%b-block1').bemSetMod('testbool', true);
    testClasses('testbool', ['1 b-block1_testbool', '2 b-block1_testbool',
                             '3 b-block1_testbool', '6 b-block1_testbool']);
    $('%b-block1').bemSetMod('testbool', false);
    testClasses('testbool', []);

    $('%b-block1').bemSetMod('testbool', true).eq(1).bemSetMod('testbool', 'aaa');
    testClasses('testbool',  ['1 b-block1_testbool', '2 b-block1_testbool_aaa',
                              '3 b-block1_testbool', '6 b-block1_testbool']);

    $('%b-block1').eq(3).bemSetMod('b-block1', 'testbool', '');
    testClasses('testbool',  ['1 b-block1_testbool', '2 b-block1_testbool_aaa',
                              '3 b-block1_testbool']);

    $('%b-block1').bemDelMod({block: 'b-block1'}, 'testbool');
    testClasses('testbool', []);
});

test('Modifier getter', function() {
    var b = $('%b-block1');
    b.eq(0).bemSetMod('something', true);
    b.eq(1).bemSetMod('something', 'yo');
    b.eq(2).bemSetMod('something', 'argh');
    equal(b.bemGetMod('something'), true, 'Getting boolean modifier');
    equal(b.eq(1).bemGetMod('b-block1', 'something'), 'yo', 'Getting modifier with block');
    equal(b.eq(2).bemGetMod({block: 'b-block1'}, 'something'), 'argh', 'Getting modifier with block 2');

    equal(b.bemGetMod('nothing'), null, 'Non-existing modifier');
    equal($('%b-block100500').bemGetMod('love'), null, 'Non-existing block');

    b = $('%b-block1(elem1)');
    b.bemSetMod('poooo', true);
    equal(b.bemGetMod('poooo'), true, 'Getting element boolean modifier');
    b.bemSetMod('poooo', 'yes');
    equal(b.bemGetMod('poooo'), 'yes', 'Getting element modifier');
    equal(b.bemGetMod('arghargh'), null, 'Non-existing element modifier');
    equal($('%b-block1(elem100500)').bemGetMod('love'), null, 'Non-existing element');
});
