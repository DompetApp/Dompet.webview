;(function (core) {
  var injectControlStyle = function () {
    document.head.appendChild(
      injectCreateElement(
        'style',
        { type: 'text/css' },
        [
          'html, body { padding: 0 !important; margin: 0 !important; }',
          '#_inject__control-container { display: block; position: fixed; bottom: 66px; right: 0; z-index: 9999; opacity: .95 }',
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

        var positionTop = maxHeight - offsetHeight - 66
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
    controlContainer.addEventListener('touchcancel', function () {
      isTouch = false
      startOffsetX = null
      startOffsetY = null
      startClientX = null
      startClientY = null
    })
    controlApp.addEventListener('click', function (e) {
      if (core.invoker.navigateBack) {
        core.invoker.navigateBack({ delta: 999 })
      }
    })

    controlApp.appendChild(controlAppImg)
    controlContent.appendChild(controlApp)
    controlContainer.appendChild(controlContent)

    document.body.appendChild(controlContainer)
  }

  var injectFlutterWebApi = function () {
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

    try {
      var reLaunch = promisify(source.program.reLaunch, 60000)
    } catch (e) {}

    try {
      var redirectTo = promisify(source.program.redirectTo, 60000)
    } catch (e) {}

    try {
      var navigateTo = promisify(source.program.navigateTo, 60000)
    } catch (e) {}

    try {
      var navigateBack = promisify(source.program.navigateBack, 60000)
    } catch (e) {}

    invoker.reLaunch = function (options) {
      return reLaunch({ page: options.page })
    }

    invoker.redirectTo = function (options) {
      return redirectTo({ page: options.page })
    }

    invoker.navigateTo = function (options) {
      return navigateTo({ page: options.page })
    }

    invoker.navigateBack = async function (options) {
      return navigateBack({ delta: options.delta })
    }
  }

  var initSDKEnvironment = function () {
    var callback = arguments[0]
    var harmonySourcer = window.injectHarmonyAppSourcer
    var flutterSourcer = window.injectFlutterAppSourcer

    if (flutterSourcer && flutterSourcer.ready === true) {
      delete window.injectFlutterAppSourcer
      delete window.injectFlutterAppRunner
      window[core.operate] = core.invoker

      core.invoker.ready = Promise.resolve({
        status: 'success',
        message: null,
        result: null,
      })

      core.source = flutterSourcer.source
      core.name = flutterSourcer.name
      core.env = flutterSourcer.env
      callback()
      return
    }

    if (flutterSourcer && flutterSourcer.ready === false) {
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

      window.injectFlutterAppRunner = function (result) {
        delete window.injectFlutterAppSourcer
        delete window.injectFlutterAppRunner
        window[core.operate] = core.invoker
        core.source = result.source
        core.name = result.name
        core.env = result.env
        callback()
        success()
        return
      }
    }
  }

  var initSDKServicer = function () {
    switch (core.name) {
      case 'jflutter': {
        injectFlutterWebApi()
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
