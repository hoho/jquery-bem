/*!
 * jQuery BEM — v0.0.1 — 2012-10-04
 * https://github.com/hoho/jquery-bem
 *
 * Copyright (c) 2012 Marat Abdullin
 * Released under the MIT license
 */
(function($) {
///////////////////////////////////////////////////////////////////////////////

var blockPrefixes = '(?:b\\-|l\\-)?',
    elemSeparator = '__',
    modSeparator = '_',
    whitespace = '[\\x20\\t\\r\\n\\f]',
    characterEncoding = '(?:[a-zA-Z0-9-]|[^\\x00-\\xa0])+',
    operators = '([*^$|!]?=)',
    modifiers = '\\{' + whitespace + '*(' + characterEncoding + ')' +
                whitespace + '*(?:' + operators + whitespace +
                '*(' + characterEncoding + '))?' + whitespace + '*\\}',
    strundefined = 'undefined',
    strobject = 'object',
    globalWhitespace = new RegExp(whitespace, 'g');

var m = $.expr.match,
    f = $.expr.filter;


// Copied from jQuery.
var getClassName = function(elem) {
    return elem.className || (typeof elem.getAttribute !== strundefined && elem.getAttribute('class')) || '';
};


// Extending Sizzle with our custom matchers.
m.BLOCK = new RegExp('^%(' + blockPrefixes + characterEncoding + '|\\*)');
m.ELEM = new RegExp('^%(' + blockPrefixes + characterEncoding + '|\\*)\\(' +
                    whitespace + '*(' + characterEncoding + '|\\*)' + whitespace +
                    '*\\)');
m.MOD = new RegExp('^' + modifiers);


// Handlers for our custom selectors (ELEM first, BLOCK second — order matters).
f.ELEM = function(blockName, elemName) {
    if (blockName === '*') { blockName = blockPrefixes + characterEncoding; }
    if (elemName === '*') { elemName = characterEncoding; }
    var expr = new RegExp(
        '(?:^|' + whitespace + '+)' + blockName + elemSeparator + elemName +
        '(?:' + whitespace + '+|$)'
    );

    return function(elem) {
        return expr.test(getClassName(elem));
    };
};


f.BLOCK = function(name) {
    if (name === '*') { name = blockPrefixes + characterEncoding; }
    var expr = new RegExp(
        '(?:^|' + whitespace + '+)' + name + '(?:' + whitespace + '+|$)'
    );

    return function(elem) {
        return expr.test(getClassName(elem));
    };
};


f.MOD = function(name, operator, check) {
    var expr = new RegExp(
        '(?:^|' + whitespace + '+)' + blockPrefixes + characterEncoding +
        '(?:' + elemSeparator + characterEncoding +')?' +
        modSeparator + name + '(?:' + modSeparator + '(' + characterEncoding +
        '))?(?:' + whitespace + '+|$)'
    );

    return function(elem) {
        var match = getClassName(elem).match(expr),
            val;
        if (match) {
            val = match[1] || '';
            // Operators are mostly copied from Sizzle attributes handler.
            return operator === '=' ? val === check :
                   operator === '!=' ? val !== check :
                   operator === '^=' ? check && val.indexOf(check) === 0 :
                   operator === '*=' ? check && val.indexOf(check) > -1 :
                   operator === '$=' ? check && val.substr(val.length - check.length) === check :
                   operator === '|=' ? val === check || val.substr(0, check.length + 1) === check + '-' :
                   typeof check === strundefined;
        } else {
            return false;
        }
    };
};


var Block,
    Element,
    _decl = {}; // _decl is a dictionary to store declared callbacks.


var declCallback = function(what, name, callback) {
    var c = _decl[this._key];
    if (!c) { _decl[this._key] = c = []; }

    if ($.type(name) === strobject) {
        for (var i in name) {
            c.push([what + ',' + i + ',' + this._cbKey, name[i]]);
        }
    } else {
        c.push([what + ',' + name + ',' + this._cbKey, callback]);
    }
}


Block = function(name, mod, val) {
    this._key = name;
    this._cbKey = name + (mod ? modSeparator + mod + (val ? modSeparator + val : '') : '');
};


Block.prototype.onMod = function(name, callback) {
    declCallback.call(this, 'mod', name, callback);
    return this;
};


Block.prototype.onMethod = function(name, callback) {
    declCallback.call(this, 'method', name, callback);
    return this;
};


Block.prototype.elem = function(name, mod, val) {
    return new Element(this, name, mod, val);
};


Element = function(block, name, mod, val) {
    this._block = block;
    this._key = block._key + elemSeparator + name;
    this._cbKey = block._key + elemSeparator + name + (mod ? modSeparator + mod + (val ? modSeparator + val : '') : '');
};


Element.prototype.onMod = Block.prototype.onMod;
Element.prototype.onMethod = Block.prototype.onMethod;


Element.prototype.end = function() {
    return this._block;
};


var Super = function(context, callbacks) {
    var position = callbacks.length - 1;
    return function wrapper() {
        if (position >= 0) {
            var args = Array.prototype.slice.call(arguments);
            args.unshift(wrapper);
            return callbacks[position--].apply(context, args);
        }
    };
};


$.BEM = {
    decl: function(name, mod, val) {
        return new Block(name, mod, val);
    }
};


var getBlockElemModRegExp = function(blockName, elemName, modName) {
    return new RegExp(
        '(?:^|' + whitespace + ')(' + (blockName || (blockPrefixes + characterEncoding)) +
        ')(?:' + elemSeparator + '(' + (elemName || characterEncoding) + '))?(?:' +
        modSeparator + '(' + (modName || characterEncoding) + ')(?:' +
        modSeparator + '(' + characterEncoding + '))?)?(?:' + whitespace + '|$)',
        'g'
    );
};


var getBlockElemModByClassName = function(className, blockName, elemName, modName, firstOnly) {
    var ret = {};
    (className || '').replace(globalWhitespace, '  ').replace(getBlockElemModRegExp(blockName, elemName, modName),
        function(_, b, e, m, v) {
            if (!blockName && !elemName && firstOnly) {
                blockName = b;
                elemName = e;
            }

            _ = b + (e ? elemSeparator + e: '');
            if (!ret[_]) { ret[_] = []; }
            // v is a modifier value or undefined for boolean modifiers.
            if (m) { ret[_].push([m, v ? v : true]); }
        }
    );

    if (blockName) {
        blockName = blockName + (elemName ? elemSeparator + elemName : '');
        if (ret[blockName]) {
            var ret2 = {};
            ret2[blockName] = ret[blockName];
            ret = ret2;
        } else {
            ret = {};
        }
    }

    return ret;
};


var getCallbacks = function(part, name, key, what) {
    var matcher = {}, i, j, k, ret = [];

    k = part + ',' + name + ',' + key;
    matcher[k] = true;
    k = k + modSeparator;
    for (i = 0; i < what.length; i++) {
        j = k + what[i][0];
        matcher[j] = true;
        matcher[j + modSeparator + what[i][1]] = true;
    }

    what = _decl[key];

    if (what) {
        for (i = 0; i < what.length; i++) {
            j = what[i];
            if (j[0] in matcher) {
                ret.push(j[1]);
            }
        }
    }

    return ret;
};


$.fn.bemCall = function(method) {
    var blockName, elemName, _args;

    if ($.type(method) === strobject) {
        blockName = method.block;
        if (blockName) { elemName = method.elem; }
        method = method.method;
    }
    if (!method) { return; } else { method += ''; }

    _args = Array.prototype.slice.call(arguments, 1);

    var self = this.eq(0),
        whatToCall = getBlockElemModByClassName(self.attr('class'), blockName, elemName, undefined, true),
        callbacks, i;
    for (i in whatToCall) {
        callbacks = getCallbacks('method', method, i, whatToCall[i]);
        return Super(self, callbacks).apply(this, _args);
    }
};


var bemSetGetMod = function(what, where, mod, val) {
    var blockName, elemName, w, i;

    if ($.type(where) === strobject) {
        blockName = where.block;
        if (blockName) { elemName = where.elem; }
    } else if ($.type(val) === strundefined) {
        if (what || !mod) {
            val = mod;
            mod = where;
        }
    } else {
        blockName = where;
    }

    if (!mod) {
        $.error('No modifier');
        return;
    }

    if (what) {
        // Setting modifier.
        if ($.type(val) === 'boolean') { val = val ? true : ''; }

        this.each(function() {
            var whatToCall = getBlockElemModByClassName(getClassName(this), blockName, elemName),
                callbacks, j, prev, self = $(this);

            for (i in whatToCall) {
                w  = whatToCall[i];
                prev = undefined;
                for (j = 0; j < w.length; j++) {
                    if (w[j][0] == mod) {
                        prev = w[j][1];
                    }
                }
                if ((!prev && !val) || (prev === val)) { return; }
                callbacks = getCallbacks('mod', mod, i, w);
                j = i + modSeparator + mod;
                // Don't forget about boolean modifiers.
                if (prev) { self.removeClass(j + (prev === true ? '' : modSeparator + prev)); }
                if (val) { self.addClass(j + (val === true ? '' : modSeparator + val)); }
                Super(self, callbacks)(mod, val ? val : undefined, prev);
            }
        });

        return this;
    } else {
        // Getting modifier.
        w = getBlockElemModByClassName(this.eq(0).attr('class'), blockName, elemName, mod, true);
        for (i in w) {
            w = w[i][0];
            return w ? w[1] || true : null;
        }
        return null;
    }

};


$.fn.bemSetMod = function(where, mod, val) {
    return bemSetGetMod.call(this, true, where, mod, val);
};


$.fn.bemGetMod = function(where, mod) {
    return bemSetGetMod.call(this, false, where, mod);
};


$.fn.bemDelMod = function(where, mod) {
    var val;
    if ($.type(mod) === strundefined) { mod = ''; }
    else { val = ''; }
    return this.bemSetMod(where, mod, val);
};

///////////////////////////////////////////////////////////////////////////////
})(jQuery);
