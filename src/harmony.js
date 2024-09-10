;(function (cacher, runner, source) {
  ;function reject (options) {
    return function (result) {
      if (result === null) {
        return Promise.reject({
          status: 'failure',
          message: null,
          result: null,
        })
      }

      if (typeof result !== 'object') {
        return Promise.reject({
          status: 'failure',
          message: null,
          result: result ?? null,
        })
      }

      return Promise.reject({
        status: 'failure',
        message: result.message ?? null,
        result: result.result ?? null,
      })
    }
  }

  ;function resolve (options) {
    return function (result) {
      if (result === null) {
        return Promise.reject(result)
      }

      if (typeof result !== 'object') {
        return Promise.reject(result)
      }

      if (result.status !== 'success') {
        return Promise.reject(result)
      }

      return Promise.resolve({
        status: 'success',
        message: result.message ?? null,
        result: result.result ?? null,
      })
    }
  }

  ;function initialize (runner) {
    if (typeof runner === 'function') {
      Promise.resolve().then(function (result) {
        var env = source.env
        var name = source.name
        var version = source.version

        delete window.injectHarmonyAppRunner
        delete window.injectHarmonyAppSourcer

        return runner({
          env: env,
          name: name,
          source: source,
          version: version
        })
      })
    }
  }

  ;function generate (source) {
    source.program.ready = function (callback) {
      var env = source.env
      var name = source.name
      var version = source.version

      delete window.injectHarmonyAppRunner
      delete window.injectHarmonyAppSourcer

      return Promise.resolve({
        env: env,
        name: name,
        source: source,
        version: version
      }).then(function (result) {
        callback(result)
        return result
      })
    }

    source.program.reLaunch = function (options) {
      return source.handler('ToJavascriptHandler', 'CallReLaunch', options)
        .then(resolve(options))
        .catch(reject(options))
    }

    source.program.switchTab = function (options) {
      return source.handler('ToJavascriptHandler', 'CallSwitchTab', options)
        .then(resolve(options))
        .catch(reject(options))
    }

    source.program.redirectTo = function (options) {
      return source.handler('ToJavascriptHandler', 'CallRedirectTo', options)
        .then(resolve(options))
        .catch(reject(options))
    }

    source.program.navigateTo = function (options) {
      return source.handler('ToJavascriptHandler', 'CallNavigateTo', options)
        .then(resolve(options))
        .catch(reject(options))
    }

    source.program.navigateBack = function (options) {
      return source.handler('ToJavascriptHandler', 'CallNavigateBack', options)
        .then(resolve(options))
        .catch(reject(options))
    }
  }

  ;function freeze (source) {
    if (!Object.isFrozen(source)) {
      Object.freeze(source.handler)
      Object.freeze(source.program)
      Object.freeze(source)
    }
  }

  initialize(runner)
  generate(source)
  freeze(source)
})(
  Object.create(null),
  window.injectHarmonyAppRunner,
  window.injectHarmonyAppSourcer = {
    env: 'harmony',
    name: 'jharmony',
    version: '1.0.0',
    handler: undefined,
    program: Object.create(null),
    harmony: true,
    ready: true
  }
)
