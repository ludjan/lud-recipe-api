const Client = require('pg')

const client = new Client( {
    // pass a config object
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})

module.exports = client