// utilities
// depends on functional.js
function n(array) {
    return array.length;
}

function sum(array) {
    return reduce(array, operators.add, 0);
}

function mean(array) {
    return sum(array) / n(array);
}

// numerical possion: a very smart algorithm
function poisson(lambda) {
    return -Math.log(Math.random()) / lambda;
}

