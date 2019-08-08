import {range, forEach} from '../../pipeline/browsers'

/**
 * Example usage of the forEach function
 * @name example_1
 * @memberof module:forEach-examples
 * @function
 */

function main() {
  range({start: 1, end: 20})
    |> forEach(x => console.log(x))

  console.log('done....')
}

main()
