import {reduce} from '../../pipeline'

function main() {
  const reduction = [1, 2, 3, 4, 5] |> reduce((total, currentValue, currentIndex, array) => {
    console.log(`total: ${total}, currentValue: ${currentValue}, currentIndex: ${currentIndex}`)
    return total + currentValue
  }, 5)

  console.log('reduction: ', reduction)
  console.log('done....')
}

main()
