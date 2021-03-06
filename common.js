// poisson process helpers
// (depends on lambdascript.js and jquery.js)

// http://en.wikipedia.org/wiki/Exponential_distribution#Generating_exponential_variates
function esp(lambda) {
    // -log(U)/lambda
    return -Math.log(Math.random()) / lambda;
}

function length(array) {
    return array.length;
}

function sum(array) {
    return reduce(lambda("a+b"), array, 0);
}

function mean(array) {
    return sum(array) / length(array);
}

// return a random value in range [0, upTo)
function random(upTo) {
    return Math.floor(Math.random() * upTo);
}

function logger(message) {
    $('<span>' + message + '</span><br/>').appendTo('#log');
}

function span(message, cls) {
    return '<span class="' + cls + '">' + message + '</span>';
}

function result(message) {
    return span(message, 'result');
}

function expected(message) {
    return span(message, 'expected');
}

function absError(message) {
    return span(message, 'error');
}

// TODO: move to lambdascript?
function loopUntil(f) {
    do {
        if (!f()) {
            break;
        }
    } while (true);
}