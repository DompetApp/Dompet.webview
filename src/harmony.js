;(function (source) {
  ;function reject (result) {
    if (typeof result === 'string') {
      return Promise.reject({
        status: 'failure',
        message: result,
        result: null
      })
    }

    if (typeof result === 'object') {
      return Promise.reject({
        status: 'failure',
        message: result?.message ?? null,
        result: result?.result ?? null,
      })
    }
    
    return Promise.reject({
      status: 'failure',
      message: null,
      result: null
    })
  }
  
  ;function resolve (result) {
    if (typeof result === 'object' && result?.status === 'success') {
      return Promise.resolve({
        status: 'success',
        message: result.message ?? null,
        result: result.result ?? null
      })
    }

    return reject(result)
  }

  ;function initialize(source) {
    source.program.relaunch = async function (options) {
      try { 
        return Promise.resolve(source.handler('CallRelaunch', options)).then(resolve).catch(reject)
      } catch (e) {
        return reject(e)
      }
    }

    source.program.redirectTo = async function (options) {
      try { 
        return Promise.resolve(source.handler('CallRedirectTo', options)).then(resolve).catch(reject)
      } catch (e) {
        return reject(e)
      }
    }

    source.program.navigateTo = async function (options) {
      try { 
        return Promise.resolve(source.handler('CallNavigateTo', options)).then(resolve).catch(reject)
      } catch (e) {
        return reject(e)
      }
    }

    source.program.navigateBack = async function (options) {
      try { 
        return Promise.resolve(source.handler('CallNavigateBack', options)).then(resolve).catch(reject)
      } catch (e) {
        return reject(e)
      }
    }

    source.program.scanQRCode = async function (options) {
      try { 
        return Promise.resolve(source.handler('CallScanQRCode', options)).then(resolve).catch(reject)
      } catch (e) {
        return reject(e)
      }
    }
  }

  ;function generate(source) {
    source.handler = window.harmony_webview.caller.bind(window.harmony_webview)
    source.runner = window.injectHarmonyBridgeRunner
    source.ready = true

    if (typeof source.runner === 'function') {
      var env = source.env
      var name = source.name

      source.runner({
        env: env,
        name: name,
        source: source,
      })
    }
  }

  ;function freeze(source) {
    delete window.injectHarmonyBridgeRunner
    delete window.harmony_webview
    Object.freeze(source.program)
    Object.freeze(source.handler)
    Object.freeze(source.runner)
    Object.freeze(source)
  }

  initialize(source)
  generate(source)
  freeze(source)
})(
  (window.injectHarmonyBridgeSourcer = {
    env: 'harmony',
    name: 'harmony_webview_bridge',
    program: Object.create(null),
    handler: undefined,
    runner: undefined,
    ready: false,
  })
)
