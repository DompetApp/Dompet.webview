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
        return Promise.resolve(source.handler('ToJavaScriptHandler', 'CallRelaunch', options)).then(resolve).catch(reject)
      } catch (e) {
        return reject(e)
      }
    }

    source.program.redirectTo = async function (options) {
      try { 
        return Promise.resolve(source.handler('ToJavaScriptHandler', 'CallRedirectTo', options)).then(resolve).catch(reject)
      } catch (e) {
        return reject(e)
      }
    }

    source.program.navigateTo = async function (options) {
      try { 
        return Promise.resolve(source.handler('ToJavaScriptHandler', 'CallNavigateTo', options)).then(resolve).catch(reject)
      } catch (e) {
        return reject(e)
      }
    }

    source.program.navigateBack = async function (options) {
      try { 
        return Promise.resolve(source.handler('ToJavaScriptHandler', 'CallNavigateBack', options)).then(resolve).catch(reject)
      } catch (e) {
        return reject(e)
      }
    }

    source.program.scanQRCode = async function (options) {
      try { 
        return Promise.resolve(source.handler('ToJavaScriptHandler', 'CallScanQRCode', options)).then(resolve).catch(reject)
      } catch (e) {
        return reject(e)
      }
    }
  }

  ;function generate(source) {
    window.addEventListener('flutterInAppWebViewPlatformReady', () => {
      source.handler = window.flutter_inappwebview.callHandler.bind(window.flutter_inappwebview)
      source.runner = window.injectFlutterBridgeRunner
      source.ready = true

      delete window.injectFlutterBridgeRunner
      delete window.flutter_inappwebview
      Object.freeze(source.program)
      Object.freeze(source.handler)
      Object.freeze(source.runner)
      Object.freeze(source)

      if (typeof source.runner === 'function') {
        var env = source.env
        var name = source.name

        source.runner({
          env: env,
          name: name,
          source: source,
        })
      }
    })
  }

  initialize(source)
  generate(source)
})(
  (window.injectFlutterBridgeSourcer = {
    env: 'flutter',
    name: 'flutter_webview_bridge',
    program: Object.create(null),
    handler: undefined,
    runner: undefined,
    ready: false,
  })
)
