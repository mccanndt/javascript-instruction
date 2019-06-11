let x = 4;
let y = 4;

console.log(Math.min(x ,y));

function min(x, y) {
    if (x < y) {
        return x;
    } else {
        return y;
    }
}

console.log(min(x, y));