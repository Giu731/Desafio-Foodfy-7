const {Pool} = require("pg")

module.exports = new Pool({
    user: 'postgres',
    password: '22082009385',
    host: "localhost",
    port: 5432,
    database: "foodfy"
})