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
    equalNodes('%b-block1', ['1', '2', '3', '6']);
    equalNodes('%b-block2', ['4', '7']);
    equalNodes('%b-block5', ['8-1']);
    equalNodes('%b-block2 %b-block3', ['4-3']);
    equalNodes('%b-block2, %b-block3, %b-block5', ['4', '4-3', '7', '8-1']);
    equalNodes('%b-block1[id = 6]', ['6']);
    equalNodes('%*', ['1', '2', '3', '4', '4-3', '6', '7', '8', '8-1', '9', '10']);
    equalNodes('%b-block100500', []);
    equalNodes('#test-data div %b-block1', ['6']);
});

test('Element selectors test', function() {
    equalNodes('%b-block1(elem1)', ['6-1']);
    equalNodes('%b-block2(elem1)', ['4-1']);
    equalNodes('%b-block2(elem2)', ['4-2', '4-4', '4-5']);
    equalNodes('%b-block4(elem1)', ['8-1']);
    equalNodes('%b-block1(elem1), %b-block2(elem3)', ['4-6', '6-1']);
    equalNodes('#test-data div %b-block2(elem3)', ['4-6']);
    equalNodes('%b-block100500(elem1)', []);
    equalNodes('%b-block2(elem100500)', []);
    equalNodes('%*(*)', ['4-1', '4-2', '4-4', '4-5', '4-6', '6-1', '8-1']);
});

test('Modifier selectors test', function() {
    equalNodes('%b-block1{love}', ['2', '3']);
    equalNodes('%b-block1{love=cruel}', ['2', '3']);
    equalNodes('%b-block1{love!=boo}', ['2', '3']);
    equalNodes('%b-block1{love^=cru}', ['2', '3']);
    equalNodes('%b-block1{love*=ue}', ['2', '3']);
    equalNodes('%b-block1{love$=el}', ['2', '3']);
    equalNodes('%b-block4{momo|=va}', ['9']);
    equalNodes('div{love}', ['2', '3']);
    equalNodes('div{boo}', ['4-4', '4-5']);
    equalNodes('%*(elem2){boo = moo}', ['4-4', '4-5']);
    equalNodes('{ooo}', ['4-5']);
    equalNodes('{ooo = zoo}', ['4-5']);
    equalNodes('%b-block1{love}[id=3]{life}', ['3']);
    equalNodes('%b-block1{love=cruel}{life!=easy}', ['3']);
    equalNodes('{bool}', ['3', '9']);
    equalNodes('{bool!=something}', ['3', '9']);
    equalNodes('{bool=something}', []);
});
