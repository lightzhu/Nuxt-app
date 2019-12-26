/*
 *
 * 常用方法集合
 *
 * getUrlParam(key[, url])    获取url指定参数的值
 *
 * formatAliaccount(account)  格式化支付宝账号
 *
 * extend(obj, obj1, obj2...) 合并多个对象
 *
 * trim(text)         去除字符串首尾空格
 *
 * toArray(obj)         转成真正的数组
 *
 * each(obj, callback)      遍历数组或对象属性，执行相应操作
 *
 * toJSON(jsonStr)      将JSON字符串转成对象
 *
 * isObject(obj)        是否为对象
 *
 * isEmptyObject(obj)     对象是否为空
 *
 * isFunction(obj)        是否为函数
 *
 * isArray(obj)         是否为数组
 *
 * isArrayLike(obj)       是否为类数组
 *
 * isWindow(obj)        是否为window对象
 *
 * isNumeric(obj)       是否为数字类型
 *
 * isEmpty(str)         字符串是否为空
 *
 * isMobile(obj)        是否为手机号码
 *
 * isMail(obj)          是否为邮箱
 *
 * $$(sel)              获取匹配的DOM元素
 *
 * css(sel, key, value) 获取或设置元素样式
 *
 * offset(sel)          返回当前匹配元素相对于当前文档的偏移,返回的对象包含两个整型属性：top 和 left
 *
 */
let class2type = {}
let toString = class2type.toString
let hasOwn = class2type.hasOwnProperty
let slice = [].slice
/** ************ 正则表达式 **************/
let rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g

each(
  'Boolean Number String Function Array Date RegExp Object Error Symbol'.split(
    ' '
  ),
  function(i, name) {
    class2type['[object ' + name + ']'] = name.toLowerCase()
  }
)

/** *************** 工具类函数 start ******************/
// 获取url指定参数的值
export function getUrlParam(key, url = window.location.href) {
  if (key === undefined) return null

  let rParam = new RegExp('(\\?|&)' + key + '=([^&]*)(&|$)')
  let result = url.match(rParam)
  if (result) return decodeURIComponent(result[2])

  return null
}

// 格式化支付宝账号
export function formatAliaccount(account) {
  let [aliaccount, result] = ['', '']
  let rPhone = /^\s*(\d{3})(\d{5})(\d{3})\s*$/
  let rMail = /^\s*(\w+)(@\w+.\w+)\s*$/

  if ((result = account.match(rPhone)) != null) {
    aliaccount = result[1] + '**' + result[3]
  } else if ((result = account.match(rMail)) != null) {
    let [mailPrefix, mailSuffix] = [result[1], result[2]]

    if (mailPrefix.length <= 4) {
      aliaccount =
        mailPrefix.charAt(0) +
        '**' +
        mailPrefix.charAt(mailPrefix.length - 1) +
        mailSuffix
    } else {
      aliaccount =
        mailPrefix.substring(0, 2) +
        '**' +
        mailPrefix.substring(mailPrefix.length - 2) +
        mailSuffix
    }
  }
  return aliaccount
}

// 合并多个对象
export function extend(obj) {
  let source, prop

  if (!isObject(obj)) return obj

  for (let i = 1, length = arguments.length; i < length; i++) {
    source = arguments[i]
    for (prop in source) {
      if (hasOwn.call(source, prop)) {
        obj[prop] = source[prop]
      }
    }
  }
  return obj
}

// 去除字符串首尾空格
export function trim(text) {
  return text == null ? '' : (text + '').replace(rtrim, '')
}

// 转成真正的数组
export function toArray(obj) {
  return (Array.from && Array.from(obj)) || slice.call(obj)
}

// 对象遍历器
export function each(obj, callback) {
  let length
  let i = 0

  if (isArrayLike(obj)) {
    length = obj.length
    for (; i < length; i++) {
      if (callback.call(obj[i], i, obj[i]) === false) {
        break
      }
    }
  } else {
    for (i in obj) {
      if (callback.call(obj[i], i, obj[i]) === false) {
        break
      }
    }
  }

  return obj
}

// 将JSON字符串转成对象
export function toJSON(jsonStr) {
  let jsonObj = null

  try {
    jsonObj = JSON.parse(jsonStr)
  } catch (e) {}

  return jsonObj
}
/** *************** 工具类函数 end ******************/

/** *************** 判断类函数 start ******************/
// 是否为对象
export function isObject(obj) {
  return _type(obj) === 'object' || isFunction(obj)
}

// 对象是否为空
export function isEmptyObject(obj) {
  let name

  for (name in obj) {
    return false
  }
  return true
}

// 是否为函数
export function isFunction(obj) {
  return _type(obj) === 'function'
}

// 是否为数组
export var isArray =
  Array.isArray ||
  function(obj) {
    return _type(obj) === 'array'
  }

// 是否为类数组
export function isArrayLike(obj) {
  let length = !!obj && 'length' in obj && obj.length
  let typeStr = _type(obj)

  if (typeStr === 'function' || isWindow(obj)) {
    return false
  }

  if (obj.nodeType === 1 && length) {
    return true
  }

  return (
    typeStr === 'array' ||
    length === 0 ||
    (typeof length === 'number' && length > 0 && length - 1 in obj)
  )
}

// 是否为window对象
export function isWindow(obj) {
  return obj != null && obj === obj.window
}

// 是否为数字类型
export function isNumeric(obj) {
  // parseFloat NaNs numeric-cast false positives (null|true|false|"")
  // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
  // subtraction forces infinities to NaN
  // adding 1 corrects loss of precision from parseFloat (#15100)
  let realStringObj = obj && obj.toString()

  return !isArray(obj) && realStringObj - parseFloat(realStringObj) + 1 >= 0
}

// 内部函数，判断js原生对象类型
function _type(obj) {
  if (obj == null) {
    return obj + ''
  }
  return typeof obj === 'object' || typeof obj === 'function'
    ? class2type[toString.call(obj)] || 'object'
    : typeof obj
}

// 字符串是否为空
export function isEmpty(str) {
  if (trim(str) === '') {
    return true
  }
  return false
}

// 是否为手机号码
export function isMobile(str) {
  return /^1(2|3|4|5|6|7|8|9)\d{9}$/.test(str)
}

// 是否是邮箱
export function isMail(str) {
  return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})$/.test(
    str
  )
}
/** *************** 判断类函数 end *****************/

/** *************** DOM操作相关函数 start *****************/
// 获取匹配的DOM元素
export function $$(sel) {
  let elemList = document.querySelectorAll(sel)

  return elemList
}

// 获取或设置元素样式
export function css(sel, opts) {
  if (isEmpty(sel) || isEmpty(opts)) return

  let elemList = document.querySelectorAll(sel)

  if (elemList.length === 0) return

  if (typeof opts === 'string') {
    return window.getComputedStyle(elemList[0], null)[opts]
  } else {
    each(elemList, function(i, elem) {
      // Don't set styles on text and comment nodes
      if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style)
        return

      for (var key in opts) {
        elem.style[key] = opts[key]
      }
    })
  }
}

// 返回当前匹配元素相对于当前文档的偏移
export function offset(sel) {
  let elem = isObject(sel) ? sel : document.querySelector(sel) || {}
  let box = elem.getBoundingClientRect() || {
    top: 0,
    left: 0
  }

  return {
    top: box.top + window.pageYOffset,
    left: box.left + window.pageXOffset
  }
}
/** *************** DOM操作相关函数 end *****************/

// wap登录
export function loginByWap(callbackUrl) {
  window.location.href =
    '//m.taofen8.com/s/login?callback=' + window.encodeURIComponent(callbackUrl)
}

// 动态加载js
export function loadJsAsync(url, callback) {
  let script = document.createElement('script')
  let target = document.getElementsByTagName('script')[0] || document.head

  script.src = url
  script.async = true

  if (typeof callback === 'function') {
    script.onload = function() {
      script.onload = null
      callback()
    }
  }

  target.parentNode.insertBefore(script, target)
}

// 生成唯一标识符
export function generateUUID() {
  var d = new Date().getTime()
  if (window.performance && typeof window.performance.now === 'function') {
    d += performance.now()
  }
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(
    c
  ) {
    var r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
  return uuid
}
