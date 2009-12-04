// Functional Javascript
// (C) 2009, Davide Angelocola <davide.angelocola@gmail.com>
//
// MIT license

function each(array, f) {
    for (var i = 0; i < array.length; i++) {
        f(array[i]);
    }
}

function reduce(array, f, i) {
    each(array, function (element) {
        i = f(i, element);
    });

    return i;
}

function map(array, f) {
    var result = [];
    
    each(array, function (element) {
        result.push(f(element));
    });

    return result;
}

function filter(array, f) {
    var result = [];

    each(array, function(x) {
        if (f(x)) {
            result.push(x);
        } 
    });

    return result;
}

function every(array, f) {
    var result = true;

    each(array, function(x) {
        if (!f(x)) {
            result = false;
        }
    });

    return result;
}

function some(array, f) {
    var result = false;

    each(array, function(x) {
        if (f(x)) {
            result = true;
        }
    });

    return result;
}

function loopUntil(f) {
    do {
        if (!f()) {
            break;
        }
    } while (true);
}

function compose(func1, func2) {
    return function() {
        return func1(func2.apply(null, arguments));
    };
}

function range() {
    var begin = 1;
    var end = 1;
    var step = 1;

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
            step = arguments[2];
            break;
    }

    var result = [];

    for (var i = begin; i <= end; i+=step) {
        result.push(i);
    }

    return result;
}

// unary/binary/ternary function factory
//
// expr("a + b")     is function (a, b) { return a + b; }
// expr("a * b + c") is function (a, b) { return a * b + c; }
function expr(s) {
    return function() {
        var a;
        var b;
        var c;

        switch (arguments.length) {
            case 1:
                a = arguments[0];
                break;

            case 2:
                a = arguments[0];
                b = arguments[1];
                break;

            case 3:
                a = arguments[0];
                b = arguments[1];
                c = arguments[2];
                break;
        }

        return eval(s);
    }
}
