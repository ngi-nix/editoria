function numHead() {
  const titles = document.querySelectorAll('.ct')
  let i = 0
  let j = 0
  titles.forEach(title => {
    const num = document.createElement('div')
    num.classList.add('cn')

    if (title.closest('section').classList.contains('body-part')) {
      i = 1
      j += 1
      num.textContent = j
    } else if (title.closest('section').classList.contains('body-chapter')) {
      num.textContent = i
      i++
    }
    const locator = title.parentNode
    locator.insertBefore(num, title)
  })
}
