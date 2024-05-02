const dutchFlagSort = (arr) => {
  let i = 0
  let j = arr.length - 1
  while (i < j) {
    console.log(`arr=${arr}, i=${i}, j=${j}`)
    // i一直掃, 直到掃到0
    if (arr[i] === 1) {
      i++
      continue
    }

    // j一直掃, 直到掃到1
    if (arr[j] === 0) {
      j--
      continue
    }

    // 當條件符合i=0,j=1,進行交換
    [arr[i], arr[j]] = [arr[j], arr[i]]
    i++
  }
}

// 排序-Big O(n),執行一次迴圈進行排序 [1,0,0,1]=>[1,1,0,0]
const length = 10
const arr = Array.from({ length }, () => Math.floor(Math.random() * 2))
console.log(`arr=${arr}`)
dutchFlagSort(arr)
