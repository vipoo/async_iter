import {forEach, combineWhen} from '../../pipeline/browsers'

function* source() {
  yield '  this is not part of anything'
  yield '2019-05-26T08:26:14.384548+0000 blah blah'
  yield '  this is part of above'
  yield '  this is also part of above'
  yield '2019-05-27T08:26:14.384548+0000 a new record'
  yield '  this is part of above'
  yield '  this is also part of above'
}

const pattern = /\d*-\d*-\d*T\d*:\d*:\d*\.\d*\+\d*\s/
function main() {
  source()
    |> combineWhen(item => pattern.test(item), (i, c) => `${c}\n${i}`)
    |> forEach(console.log(?))

  console.log('done....')
}

main()
