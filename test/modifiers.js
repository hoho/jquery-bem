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
    $('%b-block1').bemMod('test', 'value');
    testClasses('test',
                ['1 b-block1_test_value', '2 b-block1_test_value',
                 '3 b-block1_test_value', '6 b-block1_test_value']);

    $('%b-block1').bemMod('test', 'new');
    testClasses('test',
                ['1 b-block1_test_new', '2 b-block1_test_new',
                 '3 b-block1_test_new', '6 b-block1_test_new']);

    $('%b-block1').bemMod('test2', 'cool');
    testClasses('test2',
                ['1 b-block1_test2_cool', '2 b-block1_test2_cool',
                 '3 b-block1_test2_cool', '6 b-block1_test2_cool']);

    ok($('%b-block1').is('{test=new}{test2=cool}'));

    $('%b-block1').bemMod('test', '');
    testClasses('test', []);

    ok($('%b-block1').is(':not({test})'));

    $('%*(*)').bemMod('yeeehaa', 'lol');
    testClasses('yeeehaa',
                ['4-1 b-block2__elem1_yeeehaa_lol', '4-2 b-block2__elem2_yeeehaa_lol',
                 '4-4 b-block2__elem2_yeeehaa_lol', '4-5 b-block2__elem2_yeeehaa_lol',
                 '4-6 b-block2__elem3_yeeehaa_lol', '6-1 b-block1__elem1_yeeehaa_lol',
                 '8-1 b-block5_yeeehaa_lol']);

    $('%*(*)').bemMod('yeeehaa', '');
    testClasses('yeeehaa', []);

    $('%b-block1').bemMod('testbool', true);
    testClasses('testbool', ['1 b-block1_testbool', '2 b-block1_testbool',
                             '3 b-block1_testbool', '6 b-block1_testbool']);
    $('%b-block1').bemMod('testbool', false);
    testClasses('testbool', []);

    $('%b-block1').bemMod('testbool', true).eq(1).bemMod('testbool', 'aaa');
    testClasses('testbool',  ['1 b-block1_testbool', '2 b-block1_testbool_aaa',
                              '3 b-block1_testbool', '6 b-block1_testbool']);

    $('%b-block1').eq(3).bemMod({block: 'b-block1', mod: 'testbool'}, '');
    testClasses('testbool',  ['1 b-block1_testbool', '2 b-block1_testbool_aaa',
                              '3 b-block1_testbool']);

    $('%b-block1').bemMod({block: 'b-block1', mod: 'testbool'}, null);
    testClasses('testbool', []);
});

test('Modifier getter', function() {
    var b = $('%b-block1');

    b.eq(0).bemMod('something', true);
    b.eq(1).bemMod('something', 'yo');
    b.eq(2).bemMod('something', 'argh');

    deepEqual(b.bemMod('something'), true, 'Getting boolean modifier');
    deepEqual(b.eq(1).bemMod({block: 'b-block1', mod: 'something'}), 'yo', 'Getting modifier with block');
    deepEqual(b.eq(2).bemMod({block: 'b-block1', mod: 'something'}), 'argh', 'Getting modifier with block 2');

    deepEqual(b.bemMod('nothing'), undefined, 'Non-existing modifier');
    deepEqual($('%b-block100500').bemMod('love'), undefined, 'Non-existing block');

    b = $('%b-block1(elem1)');

    b.bemMod('poooo', true);
    deepEqual(b.bemMod('poooo'), true, 'Getting element boolean modifier');

    b.bemMod('poooo', 'yes');
    deepEqual(b.bemMod('poooo'), 'yes', 'Getting element modifier');
    deepEqual(b.bemMod('arghargh'), undefined, 'Non-existing element modifier');
    deepEqual($('%b-block1(elem100500)').bemMod('love'), undefined, 'Non-existing element');
});
