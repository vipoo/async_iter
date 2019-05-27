import {reduce} from '../../pipeline'

async function* source() {
  yield await 1
  yield await 2
  yield await 3
  yield await 4
  yield await 5
}

async function main() {
  const reduction = await (source() |> reduce(async (total, currentValue, currentIndex, array) => {
    console.log(`total: ${total}, currentValue: ${currentValue}, currentIndex: ${currentIndex}`)
    return total + currentValue
  }, 5))

  console.log('reduction: ', reduction)
  console.log('done....')
}

main()
