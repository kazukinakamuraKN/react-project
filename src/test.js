// concatTest
const a = [1,2,3]
const b = [3,4,5]

console.log(a.concat(b))

a.concat(b)

// 破壊的ではない
console.log(a)


console.log(a.slice(0,2))
console.log(b.slice(0))