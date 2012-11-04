function testClasses(mod, expected) {
    var ret = [];
    $('*')
        .each(function() {
            var r = new RegExp('(?:\\s|^)([^\\s]+' + mod + '_[^\\s]+)(?:\\s|$)'),
                c = ($(this).attr('class') || '').match(r);
            if (c) { ret.push($(this).attr('id') + ' ' + c[1]); }
        });
    deepEqual(ret, expected);
}

test('Modifier class changes', function() {
    $('@b-block1').bemSetMod('test', 'value');
    testClasses('test',
                ['1 b-block1_test_value', '2 b-block1_test_value',
                 '3 b-block1_test_value', '6 b-block1_test_value']);

    $('@b-block1').bemSetMod('test', 'new');
    testClasses('test',
                ['1 b-block1_test_new', '2 b-block1_test_new',
                 '3 b-block1_test_new', '6 b-block1_test_new']);

    $('@b-block1').bemSetMod('test2', 'cool');
    testClasses('test2',
                ['1 b-block1_test2_cool', '2 b-block1_test2_cool',
                 '3 b-block1_test2_cool', '6 b-block1_test2_cool']);

    ok($('@b-block1').is('{test=new}{test2=cool}'));

    $('@b-block1').bemSetMod('test', '');
    testClasses('test', []);

    ok($('@b-block1').is(':not({test})'));

    $('@*(*)').bemSetMod('yeeehaa', 'lol');
    testClasses('yeeehaa',
                ['4-1 b-block2__elem1_yeeehaa_lol', '4-2 b-block2__elem2_yeeehaa_lol',
                 '4-4 b-block2__elem2_yeeehaa_lol', '4-5 b-block2__elem2_yeeehaa_lol',
                 '4-6 b-block2__elem3_yeeehaa_lol', '6-1 b-block1__elem1_yeeehaa_lol',
                 '8-1 b-block5_yeeehaa_lol']);

    $('@*(*)').bemSetMod('yeeehaa', '');
    testClasses('yeeehaa', []);
});
