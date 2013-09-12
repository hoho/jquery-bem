/*!
 * jQuery BEM v0.5.1, https://github.com/hoho/jquery-bem
 * Copyright 2012-2013 Marat Abdullin
 * Released under the MIT license
 */
(function($, undefined) {
///////////////////////////////////////////////////////////////////////////////

var blockPrefixes = '(?:b-|l-)',
    elemSeparator = '__',
    modSeparator = '_',
    whitespace = '[\\x20\\t\\r\\n\\f]',
    characterEncoding = '(?:[a-zA-Z0-9-]|[^\\x00-\\xa0])+',
    operators = '([*^$|!]?=)',
    modifiers = '\\{' + whitespace + '*(' + characterEncoding + ')' +
                whitespace + '*(?:' + operators + whitespace +
                '*(' + characterEncoding + '))?' + whitespace + '*\\}',
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
    _declMap = {},

    isObject = function(obj) {
        return typeof obj === 'object';
    },

    Block = function(isDecl, name, mod, val) {
        this._d = isDecl;
        this._k = name;
        this._c = name + (mod ? modSeparator + mod + (val ? modSeparator + val : emptyString) : emptyString);
    },

    Element = function(block, name, mod, val/**/, self) {
        self = this;
        self._b = block;
        self._d = block._d;
        self._c = ((self._k = block._k + elemSeparator + name)) +
                  (mod ? modSeparator + mod + (val ? modSeparator + val : emptyString) : emptyString);
    },

    getClassName = function(elem/**/, className) {
        return (className = elem && elem.className) ?
            (isObject(className) ?
                className.baseVal
                :
                className || (elem.getAttribute !== undefined && elem.getAttribute('class')) || emptyString)
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

    declCallback = function(isDecl, what, name, callback/**/, c, mapKey, key, self) {
        self = this;

        if (!((c = _decl[self._k]))) {
            _decl[self._k] = c = [];
        }

        mapKey = what + commaString + name + commaString;
        key = mapKey + self._c;
        mapKey += self._k;

        if (isDecl && (mapKey in _declMap)) {
            $.error('Redeclaration in ' + self._c);
        }

        if (!isDecl && !(mapKey in _declMap)) {
            $.error('Not declared ' + self._c);
        }

        _declMap[mapKey] = true;

        c.push({k: key, c: callback, d: isDecl});

        return self;
    },

    Super = function(context, callbacks/**/, position, args, cba) {
        position = callbacks.length - 1;

        return function wrapper() {
            if (position >= 0) {
                args = sliceFunc.call(arguments);
                cba = callbacks[position--];

                if (!cba.d) {
                    args.unshift(wrapper);
                }

                return cba.c.apply(context, args);
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
                if (!ret[_]) { ret[_] = {}; }
                // v is a modifier value or undefined for boolean modifiers.
                if (m) { ret[_][m] = v || true; }
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
        var matcher = {}, i, j, k, l, ret = [];

        matcher[k = part + commaString + name + commaString + key] = true;

        k += modSeparator;

        for (i in mods) {
            matcher[j = k + i] = true;

            if (l = mods[i]) {
                if (l !== true) {
                    matcher[j + modSeparator + l] = true;
                }
            }
        }

        mods = _decl[key];

        if (mods) {
            for (i = 0; i < mods.length; i++) {
                j = mods[i];

                if (j.k in matcher) {
                    ret.push(j);
                }
            }
        }

        return ret;
    };


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
        return declCallback.call(this, this._d, buildKey, buildKey, callback);
    },

    onMod: function(name, callback) {
        return declCallback.call(this, this._d, modKey, name, callback);
    },

    onCall: function(name, callback) {
        return declCallback.call(this, this._d, callKey, name, callback);
    },

    elem: function(name, mod, val) {
        return new Element(this, name, mod, val);
    }
};


Element[prototype] = {
    onBuild: blockProto.onBuild,
    onMod: blockProto.onMod,
    onCall: blockProto.onCall,
    end: function() {
        return this._b;
    }
};


$.BEM = {
    decl: function(name, mod, val) {
        return new Block(true, name, mod, val);
    },

    extend: function(name, mod, val) {
        return new Block(false, name, mod, val);
    },

    build: function(name) {
        var args = sliceFunc.call(arguments, 1),
            mods,
            context,
            details = {};

        if (isObject(name)) {
            context = name.context;
            details.block = name.block;

            mods = name.mods;
            if (mods) {
                details.mods = mods;
            }

            if (name.elem) {
                details.elem = name.elem;
                name = name.block + elemSeparator + name.elem;
            } else {
                name = name.block;
            }
        } else {
            details.block = name;
        }

        args.unshift(details);

        return Super(
            context,
            getCallbacks(buildKey, buildKey, name, mods || {})
        ).apply(this, args);
    },

    setup: function(settings) {
        if (settings) {
            if (settings.prefixes) {
                blockPrefixes = settings.prefixes;
            }
        }

        // Extending Sizzle with our custom matchers.
        m.BLOCK = new RegExpre('^%(' + blockPrefixes + characterEncoding + '|\\*)');
        m.ELEM = new RegExpre('^%(' + blockPrefixes + characterEncoding + '|\\*)\\(' +
                              whitespace + '*(' + characterEncoding + '|\\*)' + whitespace +
                              '*\\)');
        m.MOD = new RegExpre('^' + modifiers);
    },

    className: function(details) {
        // Helper method to concatenate 'class' attribute by the structure
        // passed to onBuild() callbacks.
        if (!details) { return emptyString; }

        var ret = [],
            be,
            mods,
            mod,
            val;

        if (be = details.block) {
            if (details.elem) {
                be += elemSeparator + details.elem;
            }

            ret.push(be);

            if (mods = details.mods) {
                for (mod in mods) {
                    if (val = mods[mod]) {
                        ret.push(be + modSeparator + mod + (val === true ? emptyString : modSeparator + val));
                    }
                }
            }
        }

        return ret.join(' ');
    }
};


$.BEM.setup();


$fn.bemCall = function(name) {
    var blockName,
        elemName,
        args = sliceFunc.call(arguments, 1),
        self = this.eq(0),
        whatToCall,
        i;

    if (isObject(name)) {
        if (blockName = name.block) {
            elemName = name.elem;
        }

        name = name.call;
    }

    if (name) {
        name += emptyString;

        whatToCall = getBlockElemModByClassName(getClassName(self[0]), blockName, elemName, undefined, true);

        for (i in whatToCall) {
            return Super(
                self,
                getCallbacks(callKey, name, i, whatToCall[i])
            ).apply(this, args);
        }
    }
};


$fn.bemMod = function(mod, val, force) {
    var blockName,
        elemName,
        tmp,
        i,
        self = this;

    if (isObject(mod)) {
        if (blockName = mod.block) {
            elemName = mod.elem;
        }

        mod = mod.mod;
    }

    if (!mod) {
        $.error('No modifier');
    }

    if (val === undefined) {
        // Getting modifier.
        tmp = getBlockElemModByClassName(getClassName(self[0]), blockName, elemName, mod, true);

        for (i in tmp) {
            tmp = tmp[i];

            for (i in tmp) {
                return tmp[i];
            }

            break;
        }

        return undefined;
    } else {
        // Setting modifier.
        if (typeof val === 'boolean') {
            val = val ? true : emptyString;
        }

        self.each(function() {
            var whatToCall = getBlockElemModByClassName(getClassName(this), blockName, elemName),
                callbacks,
                j,
                w,
                prev,
                self = $(this);

            for (i in whatToCall) {
                w = whatToCall[i];
                prev = undefined;

                for (j in w) {
                    if (j === mod) {
                        prev = w[j];
                    }
                }

                if (!force && ((!prev && !val) || (prev === val))) {
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

        return self;
    }
};

///////////////////////////////////////////////////////////////////////////////
})($);
