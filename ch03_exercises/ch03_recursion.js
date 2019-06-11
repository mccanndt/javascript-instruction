function isEven(value) {
    value = Math.abs(value);
    if(value == 1) {
        return false;
    } else if (value == 0) {
        return true;
    } else {
        return isEven(value - 2);
    }
}

console.log(isEven(50));
console.log(isEven(75));
console.log(isEven(-1));