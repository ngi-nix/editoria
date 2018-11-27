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
  resArray.splice(to, 0, resArray.splice(from, 1)[0])
  return resArray
}

module.exports = utils
