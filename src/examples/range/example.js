import {range} from '../../range'

async function example1() {
  console.log('range from 0 to 5')
  for await (const item of range(5))
    process.stdout.write(`${item} `)
}

async function example2() {
  console.log('\n\nrange from 10 to 15')
  for await (const item of range({start: 10, end: 15}))
    process.stdout.write(`${item} `)
}

async function example3() {
  console.log('\n\nrange from 0 to -15')
  for await (const item of range({end: -15}))
    process.stdout.write(`${item} `)
}

async function example4() {
  console.log('\n\nrange from 0 to 15')
  for await (const item of range({end: 15}))
    process.stdout.write(`${item} `)
}

async function example5() {
  console.log('\n\nrange from 0 to 15')
  for await (const item of range({end: 15, step: 2}))
    process.stdout.write(`${item} `)
}

async function main() {
  await example1()
  await example2()
  await example3()
  await example4()
  await example5()

  console.log('\n\ndone...')
}

main()
