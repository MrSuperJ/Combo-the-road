let inited = false

let progressingList = {
  signin: false,
  signup: false,
  reset: false,
  animating: false,
  timer: {}
}

// 表单校验使用的缓存变量
let validElList = new Map()

// 表单校验使用的策略
var strategies = {
  isEmpty: function(value, errorMsg) {
    errorMsg = errorMsg || '为空'
    if (value === '') {
      return '\u00d7 ' + errorMsg;
    }
  },
  minLength: function(value, length, errorMsg) {
    if (value.length < length) {
      return '\u00d7 ' + errorMsg;
    }
  },
  isMobile: function(value, errorMsg) {
    if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
      return '\u00d7 ' + errorMsg;
    }
  },
  isEmail: function(value, errorMsg) {
    if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(value)) {
      return '\u00d7 ' + errorMsg;
    }
  },
  isEqual: function(valueArray, errorMsg) {
    // console.info('equal 校验')
    if (valueArray[0] === '' || valueArray.length === 1 || (new Set(valueArray).size) !== 1) {
      return '\u00d7 ' + errorMsg
    }
  },
  default: function(value) {
    return '\u00d7 ' + `没有找到校验规则，随便你输入什么，过得去算我输`
  }
};
// 每种表单的验证
let validDict = {
  'username': function(el, length) {
    let value = el.value
    length = length || 4
    let errorMsg = `用户名长度不能小于 ${length} 位`
    let result
    result = strategies.isEmpty(value, '用户名不能为空')
    result = result || strategies.minLength(value, length, errorMsg)
    return { err: !!result, msg: result || ' \u221a' }
  },
  'email': function(el) {
    let value = el.value
    let errorMsg = `邮箱格式不正确`
    let result
    result = strategies.isEmpty(value, '邮箱不能为空')
    result = result || strategies.isEmail(value, errorMsg)
      // console.info('判断结果', result)
    return { err: !!result, msg: result || ' \u221a' }
  },
  'passwd': function(el, length) {
    let value = el.value
    length = length || 4
    let errorMsg = `密码长度不能小于 ${length} 位`
    let result
    result = strategies.isEmpty(value, '密码不能为空')
    result = result || strategies.minLength(value, length, errorMsg)
    return { err: !!result, msg: result || ' \u221a' }
  },
  'passwdConfirm': function(el) {
    // console.info(el)
    let form = findParent('.form', el)
    if (!form) {
      console.info('没找到范围表单，这是个假按钮')
      return { err: !!1, msg: ' \u00d7 没找到范围表单，这是个假按钮' }
    }
    let valueArray = [].map.call(form.querySelectorAll('[name^="passwd"]'), v => v.value)
      // console.info('value Array', valueArray)
    let errorMsg = `确认密码应与密码一致有效`
    let result
    result = strategies.isEmpty(el.value, '确认密码不能为空')
    result = result || strategies.isEqual(valueArray, errorMsg)
    return { err: !!result, msg: result || ' \u221a' }
  },
  'default': function(el) {
    let value = el.value
    let result = strategies.default(value)
    return { err: !!result, msg: result || ' \u221a' }
  }
}