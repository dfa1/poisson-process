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

function random(upTo) {
    return Math.floor(Math.random() * upTo);
}

    // http://stackoverflow.com/questions/1266402/implementing-mathematical-sets-in-javascript
    Array.prototype.contains = function(e) {
        return this.lastIndexOf(e, this.length) != -1;
    }


    Array.prototype.notContains = function(e) {
        return this.lastIndexOf(e, this.length) == -1;
    }

function union(a1, a2) {
    var res = [];

    each(a1, function(e) {
        res.push(e);
    });

    each(a2, function(e) {
        if (res.notContains(e)) {
            res.push(e);
        }
    });

    return res;
}

function intersection(a1, a2) {
    var res = [];

    each(a1, function(e) {
        if (a2.contains(e)) {
            res.push(e);
        }
    });

    return res;
}

// mapping javascript operators to functions
var operators = {
    add : function(a, b) {
        return a + b;
    },

    sub : function(a , b) {
        return a - b;
    },

    mul : function(a , b) {
        return a * b;
    },

    div: function(a , b) {
        return a / b;
    },

    mod: function(a , b) {
        return a % b;
    },

    lt : function (a, b) {
        return a < b;
    },

    square: function(a) {
        return a * a;
    }
}