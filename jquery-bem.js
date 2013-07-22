/*!
 * jQuery BEM v0.2.1, https://github.com/hoho/jquery-bem
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
    prototype = 'prototype',
    sliceFunc = Array[prototype].slice,
    $fn = $.fn,
    emptyString = '',
    commaString = ',',

    blockProto,

    m = $.expr.match,
    f = $.expr.filter,

    _decl = {}, // _decl is a dictionary to store declared callbacks.

    isObject = function(obj) {
        return typeof obj === strobject;
    },

    Block = function(name, mod, val) {
        this._k = name;
        this._c = name + (mod ? modSeparator + mod + (val ? modSeparator + val : emptyString) : emptyString);
    },

    Element = function(block, name, mod, val) {
        this._b = block;
        this._k = block._k + elemSeparator + name;
        this._c = block._k + elemSeparator + name + (mod ? modSeparator + mod + (val ? modSeparator + val : emptyString) : emptyString);
    },

    getClassName = function(elem/**/, className) {
        return (className = elem && elem.className) ?
            (isObject(className) ?
                className.baseVal
                :
                className || (typeof elem.getAttribute !== strundefined && elem.getAttribute('class')) || emptyString)
            :
            emptyString;
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

    declCallback = function(what, name, callback/**/, c, i) {
        if (!(c = _decl[this._k])) {
            _decl[this._k] = c = [];
        }

        if (isObject(name)) {
            for (i in name) {
                c.push([what + commaString + i + commaString + this._c, name[i]]);
            }
        } else {
            c.push([what + commaString + name + commaString + this._c, callback]);
        }
    },

    Super = function(context, callbacks/**/, position) {
        position = callbacks.length - 1;

        return function wrapper() {
            if (position >= 0) {
                var args = sliceFunc.call(arguments);

                args.unshift(wrapper);

                return callbacks[position--].apply(context, args);
            }
        };
    },

    getBlockElemModByClassName = function(className, blockName, elemName, modName, firstOnly/**/, ret, ret2) {
        ret = {};

        className.replace(globalWhitespace, '  ').replace(getBlockElemModRegExp(blockName, elemName, modName),
            function(_, b, e, m, v) {
                if (!blockName && !elemName && firstOnly) {
                    blockName = b;
                    elemName = e;
                }

                _ = b + (e ? elemSeparator + e : emptyString);
                if (!ret[_]) { ret[_] = []; }
                // v is a modifier value or undefined for boolean modifiers.
                if (m) { ret[_].push({mod: m, val: v || true}); }
            }
        );

        if (blockName) {
            blockName = blockName + (elemName ? elemSeparator + elemName : emptyString);

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

    getCallbacks = function(part, name, key, mods) {
        var matcher = {}, i, j, k, ret = [];

        matcher[k = part + commaString + name + commaString + key] = true;

        k = k + modSeparator;

        for (i = 0; i < mods.length; i++) {
            matcher[j = k + mods[i].mod] = true;

            matcher[j + modSeparator + mods[i].val] = true;
        }

        mods = _decl[key];

        if (mods) {
            for (i = 0; i < mods.length; i++) {
                j = mods[i];

                if (j[0] in matcher) {
                    ret.push(j[1]);
                }
            }
        }

        return ret;
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
            val = match[1] || emptyString;

            // Operators are mostly copied from Sizzle attributes handler.
            return operator === '=' ? val === check :
                   operator === '!=' ? val !== check :
                   operator === '^=' ? check && val.indexOf(check) === 0 :
                   operator === '*=' ? check && val.indexOf(check) > -1 :
                   operator === '$=' ? check && val.substr(val.length - check.length) === check :
                   operator === '|=' ? val === check || val.substr(0, check.length + 1) === check + '-' :
                   !check;
        }

        return false;
    };
};


Block[prototype] = blockProto = {
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


Element[prototype] = {
    onMod: blockProto.onMod,
    onCall: blockProto.onCall,
    end: function() {
        return this._b;
    }
};


$.BEM = {
    decl: function(name, mod, val) {
        return new Block(name, mod, val);
    },

    build: function(name) {
        var args = sliceFunc.call(arguments, 1),
            mods,
            context;

        if (isObject(name)) {
            mods = name.mods;
            context = name.context;
            name = name.block;
        }

        return Super(
            context,
            getCallbacks(buildKey, buildKey, name, mods || [])
        ).apply(this, args);
    }
};


$fn.bemCall = function(name) {
    var blockName, elemName, _args, self, whatToCall, i;

    if (isObject(name)) {
        if (blockName = name.block) {
            elemName = name.elem;
        }

        name = name.call;
    }

    if (!name) {
        return;
    } else {
        name += emptyString;
    }

    _args = sliceFunc.call(arguments, 1);

    self = this.eq(0);

    whatToCall = getBlockElemModByClassName(getClassName(self[0]), blockName, elemName, undefined, true);

    for (i in whatToCall) {
        return Super(
            self,
            getCallbacks(callKey, name, i, whatToCall[i])
        ).apply(this, _args);
    }
};


$fn.bemMod = function(mod, val) {
    var blockName,
        elemName,
        tmp,
        i;

    if (isObject(mod)) {
        if (blockName = mod.block) {
            elemName = mod.elem;
        }

        mod = mod.mod;
    }

    if (!mod) {
        $.error('No modifier');
        return;
    }

    if (val === undefined) {
        // Getting modifier.
        tmp = getBlockElemModByClassName(getClassName(this[0]), blockName, elemName, mod, true);

        for (i in tmp) {
            tmp = tmp[i][0];
            return tmp ? tmp.val || true : undefined;
        }

        return undefined;
    } else {
        // Setting modifier.
        if (typeof val === 'boolean') {
            val = val ? true : emptyString;
        }

        this.each(function() {
            var whatToCall = getBlockElemModByClassName(getClassName(this), blockName, elemName),
                callbacks,
                j,
                w,
                prev,
                self = $(this);

            for (i in whatToCall) {
                w = whatToCall[i];
                prev = undefined;

                for (j = 0; j < w.length; j++) {
                    if (w[j].mod === mod) {
                        prev = w[j].val;
                    }
                }

                if ((!prev && !val) || (prev === val)) {
                    return;
                }

                callbacks = getCallbacks(modKey, mod, i, w);

                j = i + modSeparator + mod;

                // Don't forget about boolean modifiers.
                if (prev) {
                    self.removeClass(j + (prev === true ? emptyString : modSeparator + prev));
                }

                if (val) {
                    self.addClass(j + (val === true ? emptyString : modSeparator + val));
                }

                Super(self, callbacks)(mod, val ? val : undefined, prev);
            }
        });

        return this;
    }
};

///////////////////////////////////////////////////////////////////////////////
})($);
