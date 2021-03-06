import {reduce} from '../../pipeline/browsers'

function main() {
  const reduction = [1, 2, 3, 4, 5] |> reduce((total, currentValue, currentIndex, array) => { // eslint-disable-line no-unused-vars
    console.log(`total: ${total}, currentValue: ${currentValue}, currentIndex: ${currentIndex}`)
    return total + currentValue
  }, 5)

  console.log('reduction: ', reduction)
  console.log('done....')
}

main()
