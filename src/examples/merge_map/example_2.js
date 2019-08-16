import {forEach, mergeMap, map} from '../../pipeline/browsers'

const source1 = [1, 2, 3, 4, 5]
const source2 = ['a', 'b', 'c', 'd', 'e']

async function main() {
  await (source2
    |> mergeMap(x => source1 |> map(i => `${i} - ${x}`))
    |> forEach(console.log(?)))

  console.log('done....')
}

main()
