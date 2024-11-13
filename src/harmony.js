;(function (source) {
  function initialize(source) {
    window.addEventListener('harmonyInAppWebViewPlatformReady', () => {
      source.handler = window.harmony_webview.callHandler
      source.runner = window.injectHarmonyAppRunner
      source.ready = true

      delete window.harmony_webview.callHandler
      delete window.injectHarmonyAppRunner
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

  function generate(source) {
    source.program.reLaunch = function (options) {
      return source.handler('ToJavaScriptHandler', 'CallReLaunch', options)
    }

    source.program.redirectTo = function (options) {
      return source.handler('ToJavaScriptHandler', 'CallRedirectTo', options)
    }

    source.program.navigateTo = function (options) {
      return source.handler('ToJavaScriptHandler', 'CallNavigateTo', options)
    }

    source.program.navigateBack = function (options) {
      return source.handler('ToJavaScriptHandler', 'CallNavigateBack', options)
    }
  }

  initialize(source)
  generate(source)
})(
  (window.injectHarmonyAppSourcer = {
    env: 'harmony',
    name: 'jharmony',
    program: Object.create(null),
    handler: undefined,
    runner: undefined,
    ready: false,
  })
)
