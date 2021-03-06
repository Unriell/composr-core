'use strict'

var DEFAULT_STATUS_CODE = 200

function MockedResponse (res) {
  this.res = res
  this.cookies = {}
  this.headers = {}
  this.finished = false
  this.statusCode = DEFAULT_STATUS_CODE
  this.callbacks = { end: [] }
}

MockedResponse.prototype.on = function on (event, cb) {
  this.callbacks[event].push(cb)
}

MockedResponse.prototype.status = function status (statusCode) {
  this.statusCode = parseInt(statusCode, 10)

  return this
}

MockedResponse.prototype.cookie = function cookie (name, value, options) {
  this.cookies[name] = value

  if (this.res && typeof (this.res.setCookie) === 'function') {
    this.res.setCookie(name, value, options)
  }

  return this
}

MockedResponse.prototype.setHeader = function setHeader (name, value) {
  if (this.res) {
    this.res.header(name, value)
  }

  this.headers[name] = value

  return this
}

MockedResponse.prototype.setHeaders = function setHeaders (headers) {
  this.headers = headers

  if (this.res && typeof (this.res.header) === 'function') {
    var that = this
    Object.keys(headers).forEach(function (header) {
      that.res.header(header, headers[header])
    })
  }

  return this
}

MockedResponse.prototype.send = function send (maybeCode, maybeBody) {
  if (!this.finished) {
    var status = this.statusCode || 200
    var data

    if (typeof maybeCode === 'number') {
      status = maybeCode
      data = maybeBody
    } else {
      data = maybeCode
    }

    data = typeof (data) !== 'undefined' && data !== null ? data : ''

    if (data.toString) {
      // Check if the object passed has the "toString" method, if not, don't use it
      this.setHeader('Content-Length', data.toString().length)
    }

    this.finished = true

    if (this.res) {
      this.res.send(status, data)
    }

    var params = {
      status: status,
      body: data,
      headers: this.headers
    }

    // Only set cookies if status distinct than 40x or 50x
    if (status.toString().indexOf('4') !== 0 && status.toString().indexOf('5') !== 0) {
      params.cookies = this.cookies
    }

    this.callbacks.end.forEach(function (cb) { cb(params) })
  }
}

module.exports = MockedResponse
