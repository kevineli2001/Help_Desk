const { createToken, OPTIONS_TOKEN } = require('./app/utils/jwt')

console.log(createToken({name: 'Gary'}, OPTIONS_TOKEN.create))