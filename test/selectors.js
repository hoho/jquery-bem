// BEM selectors tests.
function getNodeIds(n) {
    var ret = [];
    n.each(function() { ret.push($(this).attr('id')); });
    return ret;
}

function equalNodes(selector, ids) {
    deepEqual(getNodeIds($(selector)), ids, 'Correct ' + selector + ' node(s)');
}

test('Block selectors test', function() {
    equalNodes('@b-block1', ['1', '2', '3', '6']);
    equalNodes('@b-block2', ['4', '7']);
    equalNodes('@b-block5', ['8-1']);
    equalNodes('@b-block2 @b-block3', ['4-3']);
    equalNodes('@b-block2, @b-block3, @b-block5', ['4', '4-3', '7', '8-1']);
    equalNodes('@b-block1[id = 6]', ['6']);
    equalNodes('@*', ['1', '2', '3', '4', '4-3', '6', '7', '8', '8-1']);
    equalNodes('#test-data div @b-block1', ['6']);
});

test('Element selectors test', function() {
    equalNodes('@b-block1(elem1)', ['6-1']);

    // TODO: More tests.

    equalNodes('@*(*)', ['4-1', '4-2', '4-4', '4-5', '4-6', '6-1', '8-1']);
});
