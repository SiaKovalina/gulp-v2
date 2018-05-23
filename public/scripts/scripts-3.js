var arr = _.map([1, 2, 3], function(num){ return num * 3; });
console.log(arr);

var arr2 = _.partition([1, 2, 3, 4], n => n % 2);
console.log(arr2);