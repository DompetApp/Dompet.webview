;(function (core) {
  var injectControlStyle = function () {
    document.head.appendChild(
      injectCreateElement(
        'style',
        { type: 'text/css' },
        [
          'html, body { padding: 0; margin: 0; }',
          'body img { max-width: 100%; height: auto; }',
          '#_inject__control-container { display: block; position: fixed; bottom: 56px; right: 0; z-index: 9999; opacity: .95 }',
          '#_inject__control-content { display: block; width: 74px; height: 74px; position: relative; }',
          '#_inject__control-app { display: block; width: 74px; height: 74px; position: absolute; }',
          '#_inject__control-app { top: 0; left: 0; right: 0; bottom: 0; margin: auto; }',
          '#_inject__control-app-img { width: 74px; height: 74px; }',
        ].join('\n')
      )
    )
  }

  var injectCreateElement = function () {
    var element = arguments[0] instanceof Node ? arguments[0] : document.createElement(arguments[0])
    var object = arguments[1]
    var text = arguments[2]

    if (object) {
      for (var field in object) {
        element.setAttribute(field, object[field])
      }
    }

    if (text) {
      element.appendChild(document.createTextNode(text))
    }

    return element
  }

  var injectControlElement = function () {
    var image = 'https://linpengteng.github.io/resource/dompet-app/home.png'

    var controlApp = injectCreateElement('div', { id: '_inject__control-app' })

    var controlContent = injectCreateElement('div', {
      id: '_inject__control-content',
    })

    var controlContainer = injectCreateElement('div', {
      id: '_inject__control-container',
    })

    var controlAppImg = injectCreateElement('img', {
      id: '_inject__control-app-img',
      src: image,
    })

    var isTouch = false
    var startOffsetX = null
    var startOffsetY = null
    var startClientX = null
    var startClientY = null

    controlContainer.addEventListener('touchcancel', function (e) {
      isTouch = false
      startOffsetX = null
      startOffsetY = null
      startClientX = null
      startClientY = null
    })
    controlContainer.addEventListener('touchstart', function (e) {
      isTouch = true
      startOffsetX = +e.currentTarget.getAttribute('start-offset-x') || 0
      startOffsetY = +e.currentTarget.getAttribute('start-offset-y') || 0
      startClientX = e.changedTouches[0].clientX
      startClientY = e.changedTouches[0].clientY
      e.stopPropagation()
    })
    controlContainer.addEventListener('touchmove', function (e) {
      if (isTouch) {
        var maxWidth = window.innerWidth
        var maxHeight = window.innerHeight
        var offsetWidth = e.currentTarget.offsetWidth
        var offsetHeight = e.currentTarget.offsetHeight
        var endClientX = e.changedTouches[0].clientX
        var endClientY = e.changedTouches[0].clientY
        var moveX = startOffsetX + endClientX - startClientX
        var moveY = startOffsetY + endClientY - startClientY

        var positionTop = maxHeight - offsetHeight - 56
        var positionLeft = maxWidth - offsetWidth

        moveX = moveX + positionLeft + offsetWidth <= maxWidth ? moveX : maxWidth - positionLeft - offsetWidth
        moveY = moveY + positionTop + offsetHeight <= maxHeight ? moveY : maxHeight - positionTop - offsetHeight
        moveX = moveX + positionLeft >= 0 ? moveX : -positionLeft
        moveY = moveY + positionTop >= 0 ? moveY : -positionTop
        moveX = +moveX.toFixed(3)
        moveY = +moveY.toFixed(3)

        e.currentTarget.style = 'transform: translate(' + moveX + 'px, ' + moveY + 'px)'
        e.currentTarget.setAttribute('start-offset-x', moveX)
        e.currentTarget.setAttribute('start-offset-y', moveY)
        e.stopPropagation()
        e.preventDefault()
      }
    })
    controlContainer.addEventListener('touchend', function (e) {
      isTouch = false
      startOffsetX = null
      startOffsetY = null
      startClientX = null
      startClientY = null
      e.stopPropagation()
    })
    controlApp.addEventListener('click', function (e) {
      if (core.invoker.navigateBack) {
        core.invoker.navigateBack({ delta: 1 })
      }
    })

    window.addEventListener('resize', function (e) {
      if(controlContainer.hasAttribute('start-offset-x')) {
        controlContainer.removeAttribute('start-offset-x')
      }

      if(controlContainer.hasAttribute('start-offset-y')) {
        controlContainer.removeAttribute('start-offset-y')
      }

      if(controlContainer.hasAttribute('style')) {
        controlContainer.removeAttribute('style')
      }
    })

    controlApp.appendChild(controlAppImg)
    controlContent.appendChild(controlApp)
    controlContainer.appendChild(controlContent)

    document.body.appendChild(controlContainer)
  }

  var injectFlutterBridge = function () {
    var source = core.source
    var invoker = core.invoker

    var promisify = function (fn, timeout) {
      return function (options) {
        if (options.timeout >= 0) {
          timeout = options.timeout
        }

        return new Promise(function (resolve, reject) {
          if (timeout > 0) {
            setTimeout(function () {
              reject({
                status: 'failure',
                message: 'failure: timeout',
                result: null,
              })
            }, timeout)
          }

          fn(options).then(resolve).catch(reject)
        })
      }
    }

    try { var relaunch = promisify(source.program.relaunch, 60000) } catch (e) {}
    try { var redirectTo = promisify(source.program.redirectTo, 60000) } catch (e) {}
    try { var navigateTo = promisify(source.program.navigateTo, 60000) } catch (e) {}
    try { var navigateBack = promisify(source.program.navigateBack, 60000) } catch (e) {}
    try { var scanQRCode = promisify(source.program.scanQRCode, 60000) } catch (e) {}

    invoker.relaunch = function (options) {
      return relaunch({ ...options })
    }

    invoker.redirectTo = function (options) {
      return redirectTo({ ...options })
    }

    invoker.navigateTo = function (options) {
      return navigateTo({ ...options })
    }

    invoker.navigateBack = async function (options) {
      return navigateBack({ ...options })
    }

    invoker.scanQRCode = async function (options) {
      return scanQRCode({ ...options })
    }
  }

  var injectHarmonyBridge = function () {
    var source = core.source
    var invoker = core.invoker

    var promisify = function (fn, timeout) {
      return function (options) {
        if (options.timeout >= 0) {
          timeout = options.timeout
        }

        return new Promise(function (resolve, reject) {
          if (timeout > 0) {
            setTimeout(function () {
              reject({
                status: 'failure',
                message: 'failure: timeout',
                result: null,
              })
            }, timeout)
          }

          fn(options).then(resolve).catch(reject)
        })
      }
    }

    try { var relaunch = promisify(source.program.relaunch, 60000) } catch (e) {}
    try { var redirectTo = promisify(source.program.redirectTo, 60000) } catch (e) {}
    try { var navigateTo = promisify(source.program.navigateTo, 60000) } catch (e) {}
    try { var navigateBack = promisify(source.program.navigateBack, 60000) } catch (e) {}
    try { var scanQRCode = promisify(source.program.scanQRCode, 60000) } catch (e) {}

    invoker.relaunch = function (options) {
      return relaunch({ ...options })
    }

    invoker.redirectTo = function (options) {
      return redirectTo({ ...options })
    }

    invoker.navigateTo = function (options) {
      return navigateTo({ ...options })
    }

    invoker.navigateBack = async function (options) {
      return navigateBack({ ...options })
    }

    invoker.scanQRCode = async function (options) {
      return scanQRCode({ ...options })
    }
  }

  var initSDKEnvironment = function () {
    var callback = arguments[0]
    var harmonySourcer = window.injectHarmonyBridgeSourcer
    var flutterSourcer = window.injectFlutterBridgeSourcer

    if (flutterSourcer && flutterSourcer.ready === true) {
      delete window.injectFlutterBridgeSourcer
      delete window.injectFlutterBridgeRunner
      window[core.operate] = core.invoker

      core.invoker.ready = Promise.resolve({
        status: 'success',
        message: null,
        result: {
          name: flutterSourcer.name,
          env: flutterSourcer.env,
        },
      })

      core.source = flutterSourcer
      core.name = flutterSourcer.name
      core.env = flutterSourcer.env
      callback()
      return
    }

    if (!flutterSourcer || flutterSourcer.ready !== true) {
      var success = null

      core.invoker.ready = new Promise((resolve, reject) => {
        setTimeout(function () {
          reject({
            status: 'failure',
            message: 'flutter sdk loading timeout',
            result: null,
          })
        }, 8000)
        success = resolve
      })

      window.injectFlutterBridgeRunner = function (result) {
        delete window.injectFlutterBridgeSourcer
        delete window.injectFlutterBridgeRunner
        window[core.operate] = core.invoker
        core.source = result.source
        core.name = result.name
        core.env = result.env
        success({
          status: 'success',
          message: null,
          result: {
            name: result.name,
            env: result.env,
          },
        })
        callback()
        return
      }
    }

    if (harmonySourcer && harmonySourcer.ready === true) {
      delete window.injectHarmonyBridgeSourcer
      delete window.injectHarmonyBridgeRunner
      window[core.operate] = core.invoker

      core.invoker.ready = Promise.resolve({
        status: 'success',
        message: null,
        result: {
          name: harmonySourcer.name,
          env: harmonySourcer.env,
        },
      })

      core.source = harmonySourcer
      core.name = harmonySourcer.name
      core.env = harmonySourcer.env
      callback()
      return
    }

    if (!harmonySourcer || harmonySourcer.ready !== true) {
      var success = null

      core.invoker.ready = new Promise((resolve, reject) => {
        setTimeout(function () {
          reject({
            status: 'failure',
            message: 'harmony sdk loading timeout',
            result: null,
          })
        }, 8000)
        success = resolve
      })

      window.injectHarmonyBridgeRunner = function (result) {
        delete window.injectHarmonyBridgeSourcer
        delete window.injectHarmonyBridgeRunner
        window[core.operate] = core.invoker
        core.source = result.source
        core.name = result.name
        core.env = result.env
        success({
          status: 'success',
          message: null,
          result: {
            name: result.name,
            env: result.env,
          },
        })
        callback()
        return
      }
    }
  }

  var initSDKServicer = function () {
    switch (core.name) {
      case 'flutter_webview_bridge': {
        injectFlutterBridge()
        break
      }

      case 'harmony_webview_bridge': {
        injectHarmonyBridge()
        break
      }
    }
  }

  var initialize = function () {
    if (window[core.operate]) {
      return
    }

    initSDKEnvironment(function () {
      if (window.parent !== window) {
        initSDKServicer()
        return
      }

      initSDKServicer()
      injectControlStyle()
      injectControlElement()
    })
  }

  initialize()
})({
  env: '',
  name: '',
  operate: 'Dompet',
  invoker: {},
  source: {},
})
