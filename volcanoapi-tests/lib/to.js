function object(promise) {
  return promise.then(data => ({ resolve: data, reject: null })).catch(error => ({ resolve: undefined, reject: error }))
}

function array(promise) {
  return promise.then(d => [d, null]).catch(e => [undefined, e])
}

module.exports = { object, array }
