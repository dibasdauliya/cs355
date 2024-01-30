const $ = document.querySelector.bind(document)

$('.theme-btn').addEventListener('click', toggleTheme)

function toggleTheme() {
  if (document.documentElement.hasAttribute('dark-mode')) {
    document.documentElement.removeAttribute('dark-mode', true)
    localStorage.removeItem('dark-mode')
  } else {
    document.documentElement.setAttribute('dark-mode', true)
    localStorage.setItem('dark-mode', true)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('dark-mode')) {
    document.documentElement.setAttribute('dark-mode', true)
  }
})
