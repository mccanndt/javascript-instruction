function range(start, end, step) {
    let range = [];
    if (start < end) {
        while (start <= end) {
            range.push(start);
            start += step;
        }
    } else {
        while (end <= start) {
            range.push(start);
            start += step;
        }
    }

    return range;
}

function sum(numbers) {
    let total = 0;
    for (let number of numbers) {
        total += number;
    }
    return total;
}

console.log(sum(range(1, 10, 2)));
console.log(sum(range(5, 2, -1)));