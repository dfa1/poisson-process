// poisson process helpers
// (depends on functional.js and jquery.js)
function length(array) {
    return array.length;
}

function sum(array) {
    return reduce(array, expr("a+b"), 0);
}

function mean(array) {
    return sum(array) / length(array);
}

// http://en.wikipedia.org/wiki/Exponential_distribution#Generating_exponential_variates
function esp(lambda) {
    // -log(U)/lambda
    return -Math.log(Math.random()) / lambda;
}

function logger(message) {
    $('<span>'+message+'</span><br/>').appendTo('#log');
}
