class Loader {
  constructor(loaderFn) {
    this.loaderFn = loaderFn
    this.cache = new Map()
  }

  load(key) {
    const cache = this.cache.get(key)
    if (cache) {
      return cache
    }

    const promise = new Promise((resolve, reject) => {
      this.loaderFn(key)
        .then(result => resolve(result))
        .catch(error => reject(error))
    })
    this.cache.set(key, promise)
    return promise
  }
}

module.exports = Loader
