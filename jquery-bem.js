/*!
 * jQuery BEM v0.1.0, https://github.com/hoho/jquery-bem
 * Copyright 2012-2013 Marat Abdullin
 * Released under the MIT license
 */
(function($, undefined) {
///////////////////////////////////////////////////////////////////////////////

var blockPrefixes = '(?:b\\-|l\\-)',
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
    modKey = 'm',
    callKey = 'c',
    buildKey = 'b',
    RegExpre = RegExp,
    globalWhitespace = new RegExpre(whitespace, 'g'),
    sliceFunc = Array.prototype.slice,
    $fn = $.fn,

    blockProto,

    m = $.expr.match,
    f = $.expr.filter,

    _decl = {}, // _decl is a dictionary to store declared callbacks.

    Block = function(name, mod, val) {
        this._key = name;
        this._cbKey = name + (mod ? modSeparator + mod + (val ? modSeparator + val : '') : '');
    },

    Element = function(block, name, mod, val) {
        this._block = block;
        this._key = block._key + elemSeparator + name;
        this._cbKey = block._key + elemSeparator + name + (mod ? modSeparator + mod + (val ? modSeparator + val : '') : '');
    },

    getClassName = function(elem/**/, className) {
        return (className = elem && elem.className) ?
            (typeof className === strobject ?
                className.baseVal
                :
                className || (typeof elem.getAttribute !== strundefined && elem.getAttribute('class')) || '')
            :
            '';
    },

    getBlockElemModRegExp = function(blockName, elemName, modName) {
        return new RegExpre(
            '(?:^|' + whitespace + ')(' + (blockName || (blockPrefixes + characterEncoding)) +
                ')(?:' + elemSeparator + '(' + (elemName || characterEncoding) + '))?(?:' +
                modSeparator + '(' + (modName || characterEncoding) + ')(?:' +
                modSeparator + '(' + characterEncoding + '))?)?(?:' + whitespace + '|$)',
            'g'
        );
    },

    declCallback = function(what, name, callback) {
        var c = _decl[this._key];

        if (!c) { _decl[this._key] = c = []; }

        if (typeof name === strobject) {
            for (var i in name) {
                c.push([what + ',' + i + ',' + this._cbKey, name[i]]);
            }
        } else {
            c.push([what + ',' + name + ',' + this._cbKey, callback]);
        }
    },

    Super = function(context, callbacks) {
        var position = callbacks.length - 1;

        return function wrapper() {
            if (position >= 0) {
                var args = sliceFunc.call(arguments);

                args.unshift(wrapper);

                return callbacks[position--].apply(context, args);
            }
        };
    },

    getBlockElemModByClassName = function(className, blockName, elemName, modName, firstOnly) {
        var ret = {},
            ret2;

        className.replace(globalWhitespace, '  ').replace(getBlockElemModRegExp(blockName, elemName, modName),
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
                ret2 = {};
                ret2[blockName] = ret[blockName];
                ret = ret2;
            } else {
                ret = {};
            }
        }

        return ret;
    },

    getCallbacks = function(part, name, key, what) {
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
    },

    bemSetGetMod = function(what, where, mod, val/**/, blockName, elemName, tmp, i) {
        if (typeof where === strobject) {
            blockName = where.block;

            if (blockName) {
                elemName = where.elem;
            }
        } else if (typeof val === strundefined) {
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
            if (typeof val === 'boolean') { val = val ? true : ''; }

            this.each(function() {
                var whatToCall = getBlockElemModByClassName(getClassName(this), blockName, elemName),
                    callbacks, j, w, prev, self = $(this);

                for (i in whatToCall) {
                    w = whatToCall[i];
                    prev = undefined;

                    for (j = 0; j < w.length; j++) {
                        if (w[j][0] == mod) {
                            prev = w[j][1];
                        }
                    }

                    if ((!prev && !val) || (prev === val)) { return; }

                    callbacks = getCallbacks(modKey, mod, i, w);

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
            tmp = getBlockElemModByClassName(getClassName(this[0]), blockName, elemName, mod, true);

            for (i in tmp) {
                tmp = tmp[i][0];
                return tmp ? tmp[1] || true : null;
            }

            return null;
        }
    };

// Extending Sizzle with our custom matchers.
m.BLOCK = new RegExpre('^%(' + blockPrefixes + characterEncoding + '|\\*)');
m.ELEM = new RegExpre('^%(' + blockPrefixes + characterEncoding + '|\\*)\\(' +
                      whitespace + '*(' + characterEncoding + '|\\*)' + whitespace +
                      '*\\)');
m.MOD = new RegExpre('^' + modifiers);


// Handlers for our custom selectors (ELEM first, BLOCK second — order matters).
f.ELEM = function(blockName, elemName) {
    if (blockName === '*') { blockName = blockPrefixes + characterEncoding; }
    if (elemName === '*') { elemName = characterEncoding; }

    var expr = new RegExpre(
        '(?:^|' + whitespace + '+)' + blockName + elemSeparator + elemName +
        '(?:' + whitespace + '+|$)'
    );

    return function(elem) {
        return expr.test(getClassName(elem));
    };
};


f.BLOCK = function(name) {
    if (name === '*') { name = blockPrefixes + characterEncoding; }

    var expr = new RegExpre(
        '(?:^|' + whitespace + '+)' + name + '(?:' + whitespace + '+|$)'
    );

    return function(elem) {
        return expr.test(getClassName(elem));
    };
};


f.MOD = function(name, operator, check) {
    var expr = new RegExpre(
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


Block.prototype = blockProto = {
    onBuild: function(callback) {
        declCallback.call(this, buildKey, buildKey, callback);
        return this;
    },

    onMod: function(name, callback) {
        declCallback.call(this, modKey, name, callback);
        return this;
    },

    onCall: function(name, callback) {
        declCallback.call(this, callKey, name, callback);
        return this;
    },

    elem: function(name, mod, val) {
        return new Element(this, name, mod, val);
    }
};


Element.prototype = {
    onMod: blockProto.onMod,
    onCall: blockProto.onCall,
    end: function() {
        return this._block;
    }
};


$.BEM = {
    decl: function(name, mod, val) {
        return new Block(name, mod, val);
    },

    build: function(parent, name) {
        var args = sliceFunc.call(arguments, 2),
            mods,
            callbacks;

        if (typeof name === strobject) {
            mods = name.mods;
            name = name.block;
        }

        callbacks = getCallbacks(buildKey, buildKey, name, mods || []);

        return Super(parent, callbacks).apply(this, args);
    }
};


$fn.bemCall = function(name) {
    var blockName, elemName, _args, self, whatToCall, callbacks, i;

    if (typeof name === strobject) {
        if (blockName = name.block) {
            elemName = name.elem;
        }

        name = name.call;
    }

    if (!name) {
        return;
    } else {
        name += '';
    }

    _args = sliceFunc.call(arguments, 1);

    self = this.eq(0);
    whatToCall = getBlockElemModByClassName(getClassName(self[0]), blockName, elemName, undefined, true);

    for (i in whatToCall) {
        callbacks = getCallbacks(callKey, name, i, whatToCall[i]);

        return Super(self, callbacks).apply(this, _args);
    }
};


$fn.bemSetMod = function(where, mod, val) {
    return bemSetGetMod.call(this, true, where, mod, val);
};


$fn.bemGetMod = function(where, mod) {
    return bemSetGetMod.call(this, false, where, mod);
};

///////////////////////////////////////////////////////////////////////////////
})($);
