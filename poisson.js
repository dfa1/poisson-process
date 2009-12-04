// poisson process helpers
// (depends on functional.js and jquery.js)

// http://en.wikipedia.org/wiki/Exponential_distribution#Generating_exponential_variates
function esp(lambda) {
    // -log(U)/lambda
    return -Math.log(Math.random()) / lambda;
}

//////////
// utils

function length(array) {
    return array.length;
}

function sum(array) {
    return reduce(array, expr("a+b"), 0);
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
