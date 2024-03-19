let myWonderFul = []

async function kXa(one) {
  const data = await fetch('https://dog.ceo/api/breeds/list/all')
  const res = await data.json()

  console.log('res', res)

  console.log(one)
  console.log(456)
}

function kXa2(two) {
  fetch('https://dog.ceo/api/breeds/list/all')
    .then((data) => data.json())
    .then((data) => console.log('res2', myWonderFul.push(data)))

  console.log(two)
  console.log(123)
}

kXa('one')

kXa2('two')

console.log({ myWonderFul })
