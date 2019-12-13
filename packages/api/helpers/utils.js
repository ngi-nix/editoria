const utils = {}

utils.reorderArray = (array, item, to, from = undefined) => {
  const resArray = []

  for (let i = 0; i < array.length; i += 1) {
    resArray.push(array[i])
  }

  if (from === undefined) {
    resArray.push(item)
    from = from || resArray.length - 1
  }
  const dragged = resArray.splice(from, 1)[0]
  resArray.splice(to, 0, dragged)
  return resArray
}

utils.isEmpty = data => {
  let isEmpty = false
  if (!data) {
    isEmpty = true
  } else {
    isEmpty = data.trim().length === 0
  }

  return isEmpty
}

module.exports = utils
