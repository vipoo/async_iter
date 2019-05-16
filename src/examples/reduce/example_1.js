import {reduce} from '../..'

function main() {
  const reduction = reduce([1, 2, 3, 4, 5], (total, currentValue, currentIndex, array) => {
    console.log(`total: ${total}, currentValue: ${currentValue}, currentIndex: ${currentIndex}`)
    return total + currentValue
  }, 5)

  console.log('reduction: ', reduction)
  console.log('done....')
}

main()
