'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  //BASE_API: '"https://easy-mock.com/mock/5950a2419adc231f356a6636/vue-admin"',
  BASE_API: '"http://localhost:8080"',//修改为nginx的转发端口
  OSS_PATH:'"https://itcolors-edu.oss-cn-hangzhou.aliyuncs.com/2020/12/11/b498d4035d5e490d8dd572cbe2ba22a6modelfile.xlsx"'
})
