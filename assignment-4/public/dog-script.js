const $ = document.querySelector.bind(document),
  dataListEl = $('#breeds')

async function fetchBreedImage() {
  const breed = $('#breed').value || 'boston bulldog',
    breedType = breed.split(' ')

  // fetches the image of the breed from the server
  const response = await fetch(
    // if the breed has a type, it will be included in the url
    `http://localhost:3000/image/${
      breedType.length > 1 ? `${breedType[1]}/${breedType[0]}` : breed
    }`
  )
  const data = await response.json()

  // if the status is success, the image will be shown. If not, an error message will be shown
  if (data.status === 'success') {
    $('#dog-img').classList.remove('hide')
    $('#img-time-log').classList.remove('hide')

    $('#img-err-text').classList.add('hide')

    $('#dog-img').src = data.message
    $('#dog-img').alt = breed
  } else {
    $('#dog-img').classList.add('hide')
    $('#img-time-log').classList.add('hide')

    $('#img-err-text').innerText = 'No images found.'
    $('#img-err-text').classList.remove('hide')
  }

  console.log(data)
}

async function fetchAllBreeds() {
  const response = await fetch('http://localhost:3000/breeds')
  const data = await response.json()

  // data returns breeds in objects and inside some objects there are types of it. Object.keys() gets all the key values of the data in the array. Now I can access each breed and check if they have types. If they have their types I've included them in the final list

  const breeds = Object.keys(data.message)
    .map((breed) => {
      if (data.message[breed].length > 0) {
        return data.message[breed].map((type) => `${type} ${breed}`)
      } else {
        return breed
      }
    })
    .flat() // flat() removes the nested arrays and makes it a single array

  // adding all bree inside datalist
  breeds.forEach((breed) => {
    const optionEl = document.createElement('option')
    optionEl.value = breed
    dataListEl.appendChild(optionEl)
  })
}

$('#show-images').addEventListener('click', (e) => {
  fetchBreedImage()
})

document.addEventListener('DOMContentLoaded', () => {
  fetchAllBreeds()

  // fetching the image of the breed every 5 seconds
  setInterval(() => {
    fetchBreedImage()
  }, 5000)

  // changing the seconds in the page to show the time of the next image change
  let sec = 4
  setInterval(() => {
    $('#img-change-seconds').innerText = `${sec} ${
      sec == 1 ? 'second' : 'seconds'
    }`
    if (sec == 1) {
      sec = 5
    } else {
      sec -= 1
    }
  }, 1000)
})
