let arr1 = [1,2,3,4,5];

for(let i = 0; i < arr1.length; i++) { 
    let x = arr1.splice(i, 1).pop();
    arr1.unshift(x);
}

console.log(arr1);