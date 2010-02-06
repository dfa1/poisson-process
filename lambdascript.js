/*
 * LambdaScript, http://bitbucket.org/dfa/lambdascript
 * Version: 1.2 (53ada00d6460 on 2010-02-06 13:45 +0100)
 * (c) 2009, 2010 Davide Angelocola <davide.angelocola@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @namespace `LambdaScript` is the namespace for the LambdaScript library.
 * NB: documentation is out-of-sync
 */
var LambdaScript = this.LambdaScript || {};

/** @ignore */
LambdaScript._toFunction = function(e) {
    if (typeof e === 'string') {
        return LambdaScript.lambda(e);
    } else if (typeof e === 'function') {
        return e;
    } else {
        throw 'Not a string or function';
    }
};

/** @ignore */
LambdaScript._toIterator = function(iterable) {
    if (iterable.constructor === Array) {
        return new LambdaScript._ArrayIterator(iterable);
    } else if (iterable.next && iterable.hasNext) {
        return iterable;
    } else {
        throw 'Not iterable';
    }
}

/** @ignore */
LambdaScript._RangeIterator = function(start, stopAt, stepBy) {
    this.stopAt = stopAt;
    this.step = stepBy;
    this.i = start;

    this.next = function() {
        var res = this.i;
        this.i = this.step(this.i);
        return res;
    };

    this.hasNext = function() {
        return this.i <= this.stopAt;
    };

    // convert the rest of this iterator to a regular array
    this.toArray = function() {
        var result = [];

        for (var j = this.i; j <= this.stopAt; j = this.step(j)) {
            result.push(j);
        }

        return result;
    };

    this.toString = function() {
        return 'RangeIterator';
    };
};

/** @ignore */
LambdaScript._ArrayIterator = function(array) {
    this.array = array;
    this.i = 0;

    this.next = function() {
        return this.array[this.i++];
    };

    this.hasNext = function() {
        return this.i < this.array.length;
    };

    // returns a copy of this array
    this.toArray = function() {
        return Array.prototype.slice.call(this.array);
    };

    this.toString = function() {
        return 'ArrayIterator';
    };
};

/**
 * unary/binary/ternary function factory.
 *
 * @function
 * @param {String} expr an expression
 * @returns {Function} a function that evaluates to 'expr'
 *
 * @example
 * lambda('-a') is equivalent to function negate(a) { return -a; }
 *
 * @example
 * lambda('a + b') is equivalent to function (a, b) { return a + b; }
 *
 * @example
 * lambda('a * b + c') is equivalent to function (a, b, c) { return a * b + c; }
 */
LambdaScript.lambda = function(expr) {
    return function(a, b, c) {
        return eval(expr);
    };
};

/**
 * Given two functions, 'f' and 'g', returns another function f(g(x)).
 *
 * @function
 * @param {Function} f a function
 * @param {Function} g another function
 * @returns {Function} the composed function
 *
 * @example
 * >>> var greet = function(name){ return "hi: " + name; };
 * >>> var exclaim  = function(statement){ return statement + "!"; };
 * >>> var welcome = LambdaScript.compose(greet, exclaim);
 * >>> welcome('moe');
 * 'hi: moe!'
 */
LambdaScript.compose = function(f, g) {
    return function() {
        return f(g.apply(null, arguments));
    };
};

LambdaScript.not = function(fn) {
    return function() {
        return !fn();
    };
};

LambdaScript.ifTrue = function(test, body) {
    return function() {
        if (test()) {
            body();
        }
    };
};

LambdaScript.ifFalse = function(test, body) {
    return function() {
        if (not(test)()) {
            body();
        }
    };
};

/**
 * Range iterator.
 *
 * @function
 * @param [Number] begin defaults 1 when not specified
 * @param [Number] end always specified
 * @param [Number|String|Function] step a function or a costant
 * @returns {RangeIterator} a new range iterator
 *
 * @example
 * >>> range(5)
 * [1, 2, 3, 4, 5]
 *
 * @example
 * >>> range(5, 10)
 * [5, 6, 7, 8, 9, 10]
 *
 * @example
 * >>> range(5, 25, 5)
 * [5, 10, 15, 20, 25]
 *
 * @example
 * >>> range(1, 10, 'a+2')
 * [1, 3, 5, 7, 9]
 *
 * @example
 * >>> range(3, 100, function(a) { return a*3;})
 * [3, 9, 27, 81]
 */
LambdaScript.range = function() {
    var begin = 1;
    var end = 1;
    var step = function(i) {
        return i + 1;
    };

    switch (arguments.length) {
        case 1:
            end = arguments[0];
            break;

        case 2:
            begin = arguments[0];
            end = arguments[1];
            break;

        case 3:
            begin = arguments[0];
            end = arguments[1];

            if (typeof arguments[2] == 'number') {
                var s = arguments[2];
                /** @ignore */
                step = function(i) {
                    return i + s;
                };
            } else if (typeof arguments[2] == 'string') {
                step = LambdaScript.lambda(arguments[2]);
            } else if (typeof arguments[2] == 'function') {
                step = arguments[2];
            } else {
                throw 'third argument can be number, string or an unary function';
            }

            break;
    }

    return new LambdaScript._RangeIterator(begin, end, step);
};

/**
 * Iterates over 'array', yielding each in turn to the function 'e'.
 *
 * @function
 * @param {Function} e a unary function to invoke for each element
 * @param {Array} array an array
 * @returns {Array} the 'array' itself
 *
 * @example
 *
 * >>> function toUpperCase(s) { return s.toUpperCase(); }
 * >>> map(toUpperCase, ['foo', 'bar', 'baZ'])
 * ['FOO', 'BAR', 'BAZ']
 */
LambdaScript.each = function(e, iterable) {
    var fn = LambdaScript._toFunction(e);
    var iterator = LambdaScript._toIterator(iterable);

    while (iterator.hasNext()) {
        fn(iterator.next());
    }

    return iterable;
};

/**
 * Convenient alias for "each".
 */
LambdaScript.forEach = function(iterable, e) {
    return LambdaScript.each(e, iterable);
};

/**
 * Reduce boils down 'array' into a single value using 'i' ss the initial state
 * of the reduction, and each successive step of it should be returned by 'e'.
 *
 * AKA: '#inject' in Smalltalk or 'fold' in lisp.
 *
 * @function
 * @param {Function} e a binary function
 * @param {Array} iterable an array to reduce
 * @param {Object} initialValue the initial value
 * @returns {Array} a new array
 *
 * @example
 * >>> reduce(lambda('a+b'), [1, 2, 3, 4], 0) // sum of range(1, 4)
 * 10
 */
LambdaScript.reduce = function(e, iterable, initialValue) {
    var i = initialValue;
    var fn = LambdaScript._toFunction(e);
    var iterator = LambdaScript._toIterator(iterable);

    LambdaScript.each(function(element) {
        i = fn(i, element);
    }, iterator);

    return i;
};

/**
 * Produces a new array of values by mapping each value in 'array' through
 * the unary transformation function 'e'.
 *
 * AKA: '#collect' in Smalltalk.
 *
 * @function
 * @param {Function} e an unary function
 * @param {Array} iterable an array
 * @returns {Array} a new array
 *
 * @example
 * >>> function square(a) { return a*a; }
 * >>> map(square, [2, 3, 4, 5])
 * [4, 9, 16, 25]
 *
 * @example
 * >>> map(lambda('a*a'), [2, 3, 4, 5])
 * [4, 9, 16, 25]
 *
 * @example
 * >>> map('a*a', [2, 3, 4, 5])
 * [4, 9, 16, 25]
 */
LambdaScript.map = function(e, iterable) {
    var fn = LambdaScript._toFunction(e);
    var iterator = LambdaScript._toIterator(iterable);
    var result = [];
    
    LambdaScript.each(function (element) {
        result.push(fn(element));
    }, iterator);

    return result;
};

/***
 * Looks through each value in 'array', returning a new array of all the values
 * that pass the truth test 'e'.
 *
 * AKA: #select in Smalltalk.
 *
 * @function
 * @param {Function} e a truth test (a unary function)
 * @param {Array} array an array
 * @returns {Array} a new array 
 *
 * @example
 * >>> filter(lambda('a%2==0'), range(1, 10))
 * [2, 4, 6, 8, 10]
 */
LambdaScript.filter = function(e, iterable) {
    var fn = LambdaScript._toFunction(e);
    var iterator = LambdaScript._toIterator(iterable);
    var result = [];

    LambdaScript.each(function(element) {
        if (fn(element)) {
            result.push(element);
        } 
    }, iterator);

    return result;
};

/**
 * Returns true if all of the values in 'array' pass the truth test 'e'.
 * 'all' maybe a convenient alias for this function.
 *
 * @function
 * @param {Function} e a truth test (a unary function)
 * @param {Array} iterable an array
 * @returns {Boolean}
 *
 * @example
 *
 */
LambdaScript.every = function(e, iterable) {
    var fn = LambdaScript._toFunction(e);
    var iterator = LambdaScript._toIterator(iterable);
    var result = true;

    LambdaScript.each(function(element) {
        if (!fn(element)) {
            result = false;
        }
    }, iterator);

    return result;
};

/**
 * Returns true if <b>any</b> of the values in 'array' pass the truth test 'e'.
 * 'any' maybe a convenient alias for this function.
 *
 * @function
 * @param {Function} e the truth test (a unary function)
 * @param {Array} iterable an array
 * @returns {Boolean}
 *
 * @example
 */
LambdaScript.some = function(e, iterable) {
    var fn = LambdaScript._toFunction(e);
    var iterator = LambdaScript._toIterator(iterable);
    var result = false;

    LambdaScript.each(function(element) {
        if (fn(element)) {
            result = true;
        }
    }, iterator);

    return result;
};

/**
 * Bind the last n-parameters to a function.
 *
 * @function
 * @param {Function} e a function
 * @param [Arguments] ...
 * @returns {Function} a function
 *
 * @example
 * >>> var mulBy2 = curry('a*b', 2);
 * >>> mulBy2(21)
 * 42
 */
LambdaScript.curry = function(e) {
    var fn = LambdaScript._toFunction(e);
    var innerArgs = Array.prototype.slice.call(arguments, 1);
    return function () {
        return fn.apply(this, innerArgs.concat(Array.prototype.slice.call(arguments, 0)))
    };
};

/**
 * Build a function that returns the value of the property 'm'.
 *
 * @function
 * @param {String} m a property name
 * @returns {Function} a pluck function
 *
 * @example
 * >>> map(pluck('length'), ['a', 'aa', 'aaa', 'aaaa'])
 * [ 1, 2, 3, 4 ]
 */
LambdaScript.pluck = function(m) {
    return function(o) {
        return o[m];
    }
};


/**
 * Given a function 'f' returns another function that caches memoize results.
 *
 * @function
 * @param {Function} f a function
 * @returns {Function} a memoized version of 'f'
 */
LambdaScript.memoize = function(f) {
    var cache = {};

    return function() {
        var args = Array.prototype.splice.call(arguments, 0);

        if (!(args in cache)) {
            cache[args] = f.apply(this, args);
        }

        return cache[args];
    };
};

/**
 * This function copies all the public functions in `LambdaScript` except itself
 * into the global namespace.
 *
 * @function
 *
 * @example
 * >>> LambdaScript.install()
 */
LambdaScript.install = function() {
    var source = LambdaScript;
    /** @ignore */
    var target = (function() {
        return this;
    })(); // References the global object.

    for (var name in source) {
        if (name != 'install' && name.charAt(0) != '_') {
            target[name] = source[name];
        }
    }
};

/* jsdoc: http://code.google.com/p/jsdoc-toolkit/w/list */

