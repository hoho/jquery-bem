// BEM selectors tests.
function getNodeIds(n) {
    var ret = [];
    n.each(function() { ret.push($(this).attr('id')); });
    return ret;
}

function equalNodes(selector, ids) {
    deepEqual(getNodeIds($(selector)), ids, 'Correct ' + selector + ' node(s)');
}

//$.BEM.setup({blockPrefixes: ''});

test('Unprefixed block selectors test', function() {
    //equalNodes('%b-block1', ['1', '2', '3', '6']);
});

test('Unprefixed element selectors test', function() {
//    equalNodes('%b-block1(elem1)', ['6-1']);
});

test('Unprefixed modifier selectors test', function() {
//    equalNodes('%b-block1{love}', ['2', '3']);
});