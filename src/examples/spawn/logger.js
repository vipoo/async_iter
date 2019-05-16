
let count = 1
setInterval(() => {
  if (count % 5 === 0)
    console.error(`This is a sample of error data: ${count++}`)
  else
    console.log(`This is a sample of data: ${count++}`)
}, 0)
