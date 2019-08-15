import {pump} from '../../pipeline/browsers'

/**
 * Example usage of the pump function
 * @name example_7
 * @memberof module:pump-examples
 * @function
 */
async function main() {
  const items = pump((target, hasStopped) => undefined) // eslint-disable-line no-unused-vars

  console.log('attempt to iterator over non async pump, errors')

  try {
    for await (const item of items)
      console.log(item)
  } catch (err) {
    console.log(err.message)
  }

  console.log('consumed all values.')

}

main()
